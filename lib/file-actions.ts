"use server"

import { PrismaClient } from '@prisma/client'
// import Folder from '@prisma/client'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { v4 } from "uuid";
import { revalidatePath } from 'next/cache';

export interface FileRecord {
    id: string
    name: string
    size: number
    type: string
    url: string
    uploadedAt: string
    folderId: string | null
  }
  
  export interface FolderRecord {
    id: string
    name: string
    parentId: string | null
    createdAt: string
  }
  
  export interface DB {
    files: FileRecord[]
    folders: FolderRecord[]
  }
  export interface FileTypeInfo {
    type: string;
    label: string;
    count: number;
  }
  
const prisma = new PrismaClient()


const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
  
  const BUCKET_NAME = process.env.S3_BUCKET_NAME!
  const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL!


  export async function uploadFile(formdata:FormData) {
    const file = formdata.get("file") as File
    const folderId = formdata.get("folderId") as string | null

    if(!file) throw new Error("No file provided")

    const buffer = Buffer.from(await file.arrayBuffer())
    const id = v4()
    const key = `files/${id}/${file.name}`
    const url = `${S3_PUBLIC_URL}/${key}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key:key,
        Body: buffer,
        ContentType: file.type,
        ContentDisposition: `inline; filename = "${encodeURIComponent(file.name)}`,
        ACL: 'public-read',
      })
    )

    const newFile = await prisma.file.create({
      data:{
        id,
        name:file.name,
        size:file.size,
        type:file.type,
        key:key,
        url:url,
        folderId:folderId,
      }
    })

    revalidatePath("/")

    return { id:newFile.id }
  }

  export async function uploadFiles(formdata:FormData) {
    const folderId = formdata.get("folderId") as string | null
    const fileEntries = Array.from(formdata.entries()).filter(([key]) => key.startsWith("file-"))

    if(fileEntries.length === 0) throw new Error("no files provided")
      
    const uploadPromises = fileEntries.map(async ([, file]) => {
      if(!(file instanceof File)) return null

      const buffer = Buffer.from(await file.arrayBuffer())
      const id = v4()
      const key = `files/${id}/${file.name}`
      const url = `${S3_PUBLIC_URL}/${key}`

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          ContentDisposition: `inline; filename="${encodeURIComponent(file.name)}"`,
          ACL:'public-read'
        })
      )

      return prisma.file.create({
        data:{
          id,
          name:file.name,
          size:file.size,
          type:file.type,
          key:key,
          url:url,
          folderId:folderId,
        }
      })
    })

    const results = await Promise.all(uploadPromises)
    revalidatePath("/")
    return results.filter(Boolean).map(file => ({ id: file!.id }))  
  
  }

  export async function getFiles(folderId: string | null = null):Promise<FileRecord[]> {
    const files = await prisma.file.findMany({
      where: {
        folderId: folderId
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    })
    
    return files.map(file  => ({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.url,
      uploadedAt: file.uploadedAt.toISOString(),
      folderId: file.folderId
    }))
  }

  export async function getFolders(parentId: string | null = null): Promise<FolderRecord[]> {
    const folders = await prisma.folder.findMany({
      where: {
        parentId: parentId
      },
      orderBy: {
        name: 'asc' 
      }
    })
    
    return folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId,
      createdAt: folder.createdAt.toISOString()
    }))
  }

  export async function getAllFolders(): Promise<FolderRecord[]> {
    const folders = await prisma.folder.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId,
      createdAt: folder.createdAt.toISOString()
    }))
  }


  export async function createFolder(data:{name:string, parentId:string | null }) {
    const folder = await prisma.folder.create({
      data:{
        name:data.name,
        parentId:data.parentId
      }
    })
    revalidatePath("/")
    return { id: folder.id }
  }

  export async function deleteFile(id: string) {
    const file = await prisma.file.findUnique({
      where: { id }
    })
    
    if (!file) {
      throw new Error("File not found")
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: file.key
      })
    )
    await prisma.file.delete({
      where: { id }
    })
    
    revalidatePath("/drive")
    return { success: true }
  }

  export async function deleteFolder(id: string) {
    const folder = await prisma.folder.findUnique({
      where: { id }
    })
    
    if (!folder) {
      throw new Error("Folder not found")
    }
    
    const allFolderIds = await getAllChildFolderIds(id)
    allFolderIds.push(id)
    
    const files = await prisma.file.findMany({
      where: {
        folderId: {
          in: allFolderIds
        }
      }
    })
    
    for (const file of files) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: file.key
        })
      )
    }
    
    await prisma.file.deleteMany({
      where: {
        folderId: {
          in: allFolderIds
        }
      }
    })
    
    for (const folderId of allFolderIds.reverse()) {
      await prisma.folder.delete({
        where: { id: folderId }
      })
    }
    
    revalidatePath("/drive")
    return { success: true }
  }

  async function getAllChildFolderIds(parentId: string): Promise<string[]> {
    const childFolders = await prisma.folder.findMany({
      where: { parentId }
    })
    
    const childIds = childFolders.map(folder => folder.id)
    
    for (const childId of [...childIds]) {
      const grandchildIds = await getAllChildFolderIds(childId)
      childIds.push(...grandchildIds)
    }
    
    return childIds
  }


  export async function getFileTypes(): Promise<FileTypeInfo[]> {
    const files = await prisma.file.findMany()
    
    const typeCounts: Record<string, number> = {}
    
    files.forEach(file => {
      const category = getFileCategory(file.type)
      typeCounts[category] = (typeCounts[category] || 0) + 1
    })
    
    return Object.entries(typeCounts)
      .map(([type, count]) => ({
        type,
        label: getFileCategoryLabel(type),
        count,
      }))
      .sort((a, b) => b.count - a.count) 
  }
  
  function getFileCategory(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "image"
    if (mimeType.startsWith("video/")) return "video"
    if (mimeType.startsWith("audio/")) return "audio"
    if (
      mimeType.startsWith("text/") ||
      mimeType.includes("document") ||
      mimeType.includes("pdf") ||
      mimeType.includes("sheet") ||
      mimeType.includes("presentation")
    ) {
      return "document"
    }
    return "other"
  }
  
  function getFileCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      image: "Images",
      video: "Videos",
      audio: "Audio",
      document: "Documents",
      other: "Other Files",
    }
    return labels[category] || "Other"
  }