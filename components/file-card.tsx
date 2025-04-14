"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { formatBytes } from "@/lib/utils"
import { Download, File, FileText, FileImage, FileAudio, FileVideo, MoreVertical, Trash2, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FilePreview } from "@/components/file-preview"
import { FileRecord } from "@/lib/file-actions"

interface FileCardProps {
  file: FileRecord
  onDelete: () => void
}

export function FileCard({ file, onDelete }: FileCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  function getFileIcon() {
    if (file.type.startsWith("image/")) {
      return <FileImage className="h-10 w-10 text-blue-500" />
    } else if (file.type.startsWith("video/")) {
      return <FileVideo className="h-10 w-10 text-purple-500" />
    } else if (file.type.startsWith("audio/")) {
      return <FileAudio className="h-10 w-10 text-green-500" />
    } else if (file.type.startsWith("text/") || file.type.includes("document") || file.type.includes("pdf")) {
      return <FileText className="h-10 w-10 text-yellow-500" />
    } else {
      return <File className="h-10 w-10 text-gray-500" />
    }
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/api/files/${file.id}`)
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  function handleCardClick() {
    setShowPreview(true)
  }

  function handleDeleteConfirm() {
    setShowDeleteDialog(false)
    onDelete()
  }

  return (
    <>
      <div
        className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="p-4 flex items-start space-x-3">
          {getFileIcon()}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg text-white truncate" title={file.name}>
              {file.name}
            </h3>
            <p className="text-sm text-gray-400">
              {formatBytes(file.size)} • {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={`/api/files/${file.id}`} download={file.name}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyShareLink}>
                <Share className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteDialog(true)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className=" text-white">{file.name}</span>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FilePreview
        file={file}
        open={showPreview}
        onOpenChange={setShowPreview}
        onDelete={() => {
          setShowPreview(false)
          setShowDeleteDialog(true)
        }}
      />
    </>
  )
}

