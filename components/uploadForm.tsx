"use client"

import { uploadFiles } from "@/lib/file-actions"
import { FileIcon, Upload, X } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { formatBytes } from "@/lib/utils"
import { Progress } from "./ui/progress"

interface UploadFormProps {
  currentFolder: string | null
  onUploadComplete: () => void
}

export function UploadForm({ currentFolder, onUploadComplete }: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])
    }
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()

      // Append all files to FormData
      selectedFiles.forEach((file, index) => {
        formData.append(`file-${index}`, file)
      })

      if (currentFolder) {
        formData.append("folderId", currentFolder)
      }
      const totalSize = selectedFiles.reduce((total, file) => total + file.size, 0)
      let loadedSize = 0

      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          loadedSize = event.loaded
          const percentComplete = Math.round((loadedSize / totalSize) * 100)
          setProgress(percentComplete)
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100)
          toast(
            <div className="grid gap-1">
              <p className="text-sm font-medium">Files uploaded successfully</p>
              <p className="text-sm text-muted-foreground">
                {selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"} uploaded.
              </p>
            </div>
          )
          setSelectedFiles([])
          onUploadComplete()
        } else {
          throw new Error(`Upload failed with status ${xhr.status}`)
        }
      })

      xhr.addEventListener("error", () => {
        throw new Error("Network error occurred during upload")
      })
      xhr.open("POST", "api/files", true)
      xhr.send(formData)

    } catch (error) {
      console.error("Upload failed:", error)
      toast(
        <div className="grid gap-1 text-red-600">
          <p className="text-sm font-semibold">Upload failed</p>
          <p className="text-sm text-red-500">
            There was an error uploading your files. Please try again.
          </p>
        </div>,
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space y-4">
      <h2 className="text-3xl font-semibold">Upload Files</h2>

      <div className={`border-2 border-dashed rounded-lg px-6 py-8 my-6 text-center cursor-pointer transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />

        <Upload className="mx-auto h-10 w-10 text-gray-200" />
        <p className="mt-2 text-sm text-gray-400 pt-2">Drag and drop files here <br></br> or click to select</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="rounded-lg">
          <div className="bg-gray-500 rounded-lg p-3 flex items-center justify-between">
            <span className="text-md font-medium">
              {selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"} selected
            </span>
            {!isUploading && (
              <Button variant="ghost"
                size="sm"
                className="h-6 text-sm cursor-pointer drop-shadow-[1px_0_1px_rgba(0,0,0,1)]"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedFiles([])
                }}>
                Clear all
              </Button>
            )}
          </div>


          <div className="max-h-40 overflow-y-auto space-y-2  px-1 py-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-accent p-2 rounded text-sm">
                <div className="flex items-center space-x-2 truncate">
                  <FileIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-gray-500 text-xs flex-shrink-0">({formatBytes(file.size)})</span>
                </div>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6  cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                  >
                    <X className="h-3 w-3 mx-2" />
                    <span className="sr-only ">Remove file</span>
                  </Button>
                )}
              </div>
            ))}
          </div>

          {isUploading && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      )}
      <Button className="w-full cursor-pointer" disabled={selectedFiles.length === 0 || isUploading} onClick={handleUpload}>
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  )
}