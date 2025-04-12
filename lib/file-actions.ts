"use server"

import { PrismaClient } from '@prisma/client'
// import Folder from '@prisma/client'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import fs from "fs";
import path from "path";
import { v4 } from "uuid";
import { revalidatePath } from 'next/cache';

interface FileRecord {
    id: string
    name: string
    size: number
    type: string
    path: string
    uploadedAt: string
    folderId: string | null
  }
  
  interface FolderRecord {
    id: string
    name: string
    parentId: string | null
    createdAt: string
  }
  
  interface DB {
    files: FileRecord[]
    folders: FolderRecord[]
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


  export async function uploadFile(formdata:FormData) {
    const file = formdata.get("file") as File
    const folderId = formdata.get("folderId") as string | null

    if(!file) throw new Error("No file provided")

    const buffer = Buffer.from(await file.arrayBuffer())
    const id = v4()
    const key = `files/${id}/${file.name}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key:key,
        Body: buffer,
        ContentType: file.type,
        ContentDisposition: `inline; filename = "${encodeURIComponent(file.name)}`,
      })
    )

    const newFile = await prisma.file.create({
      data:{
        id,
        name:file.name,
        size:file.size,
        type:file.type,
        key:key,
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
      
    const uploadPromises = fileEntries.map(async ([_, file]) => {
      if(!(file instanceof File)) return null

      const buffer = Buffer.from(await file.arrayBuffer())
      const id = v4()
      const key = `files/${id}/${file.name}`

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          ContentDisposition: `inline; filename="${encodeURIComponent(file.name)}"`,
        })
      )

      return prisma.file.create({
        data:{
          id,
          name:file.name,
          size:file.size,
          type:file.type,
          key:key,
          folderId:folderId,
        }
      })
    })

    const results = await Promise.all(uploadPromises)
    revalidatePath("/")
    return results.filter(Boolean).map(file => ({ id: file!.id }))  
  
  }

  export async function getFiles(folderId: string | null = null) {
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
      uploadedAt: file.uploadedAt.toISOString(),
      folderId: file.folderId
    }))
  }

  export async function getFolders(parentId: string | null = null) {
    const folders = await prisma.folder.findMany()
    
    return folders.map(folder  => ({
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId,
      createdAt: folder.createdAt.toISOString()
    }))
  }