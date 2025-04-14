"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { deleteFile, deleteFolder, FileRecord, FolderRecord } from "@/lib/file-actions"
import { FolderCard } from "./folder-card"
import { FileCard } from "./file-card"

interface FileListProps {
  files: FileRecord[]
  folders: FolderRecord[]
  onFolderClick: (folderId: string) => void
  onDeleteSuccess: () => void
  isLoading: boolean
  activeTypeFilters: string[]
}

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc" | "size-asc" | "size-desc"


export function FileList({
  files,
  folders,
  onFolderClick,
  onDeleteSuccess,
  isLoading,
  activeTypeFilters,
}: FileListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("date-desc")

  async function handleDeleteFile(id: string) {
    try {
      await deleteFile(id)
      onDeleteSuccess()
    } catch (error) {
      console.error("Failed to delete file:", error)
    }
  }

  async function handleDeleteFolder(id: string) {
    try {
      await deleteFolder(id)
      onDeleteSuccess()
    } catch (error) {
      console.error("Failed to delete folder:", error)
    }
  }

  function getFileCategory(type: string): string {
    if (type.startsWith("image/")) return "image"
    if (type.startsWith("video/")) return "video"
    if (type.startsWith("audio/")) return "audio"
    if (
      type.startsWith("text/") ||
      type.includes("document") ||
      type.includes("pdf") ||
      type.includes("sheet") ||
      type.includes("presentation")
    ) {
      return "document"
    }
    return "other"
  }

  const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = activeTypeFilters.length === 0 || activeTypeFilters.includes(getFileCategory(file.type))
    return matchesSearch && matchesType
  })

  const sortedFolders = [...filteredFolders].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name)
    if (sortOption === "name-desc") return b.name.localeCompare(a.name)
    if (sortOption === "date-asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    if (sortOption === "date-desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return 0
  })

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name)
    if (sortOption === "name-desc") return b.name.localeCompare(a.name)
    if (sortOption === "date-asc") return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
    if (sortOption === "date-desc") return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    if (sortOption === "size-asc") return a.size - b.size
    if (sortOption === "size-desc") return b.size - a.size
    return 0
  })

  const totalItems = sortedFolders.length + sortedFiles.length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-2">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search files and folders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Select value={sortOption} onValueChange={(value: string) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="size-desc">Size (Largest)</SelectItem>
              <SelectItem value="size-asc">Size (Smallest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : totalItems > 0 ? (
        <div className="space-y-6">
          {sortedFolders.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Folders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedFolders.map((folder) => (
                   <FolderCard
                     key={folder.id}
                     folder={folder}
                     onClick={() => onFolderClick(folder.id)}
                     onDelete={() => handleDeleteFolder(folder.id)}
                   />
                 ))}
              </div>
            </div>
          )}

          {sortedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {sortedFiles.map((file) => (
                  <FileCard key={file.id} file={file} onDelete={() => handleDeleteFile(file.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || activeTypeFilters.length > 0
              ? "No items match your search or filters"
              : "This folder is empty"}
          </p>
        </div>
      )}
    </div>
  )
}

