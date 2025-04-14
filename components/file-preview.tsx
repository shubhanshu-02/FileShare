"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { formatBytes } from "@/lib/utils"
import {
  Download,
  Share,
  Trash2,
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  FileIcon as FileIconGeneric,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { FileRecord } from "@/lib/file-actions"

interface FilePreviewProps {
  file: FileRecord
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}

export function FilePreview({ file, open, onOpenChange, onDelete }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("preview")
  const [textContent, setTextContent] = useState<string>("")
  const [isTextFile, setIsTextFile] = useState(false)

  useEffect(() => {
    if (file && open) {
      const url = `/api/files/${file.id}`
      setPreviewUrl(url)

      // Check if it's a text file to fetch content
      const isText =
        file.type.startsWith("text/") ||
        file.type.includes("json") ||
        file.type.includes("javascript") ||
        file.type.includes("css") ||
        file.type.includes("html") ||
        file.type.includes("xml")

      setIsTextFile(isText)

      if (isText) {
        fetch(url)
          .then((response) => response.text())
          .then((text) => setTextContent(text))
          .catch((err) => console.error("Failed to load text content:", err))
      }
    }
  }, [file, open])

  if (!file) return null

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
      return <FileIconGeneric className="h-10 w-10 text-gray-500" />
    }
  }

  function renderPreview() {
    if (!file) return null

    if (file.type.startsWith("image/")) {
      return (
        <div className="flex items-center justify-center h-[400px] bg-gray-800 rounded-md overflow-hidden">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )
    } else if (file.type.startsWith("video/")) {
      return (
        <div className="h-[400px] bg-gray-900 rounded-md overflow-hidden">
          <video src={previewUrl} controls className="w-full h-full">
            Your browser does not support the video tag.
          </video>
        </div>
      )
    } else if (file.type.startsWith("audio/")) {
      return (
        <div className="h-[120px] flex items-center justify-center bg-gray-100 rounded-md p-6">
          <audio src={previewUrl} controls className="w-full">
            Your browser does not support the audio tag.
          </audio>
        </div>
      )
    } else if (file.type.includes("pdf")) {
      return (
        <div className="h-[500px] bg-gray-100 rounded-md overflow-hidden">
          <iframe src={`${previewUrl}#view=FitH`} className="w-full h-full border-0" title={file.name} />
        </div>
      )
    } else if (isTextFile) {
      return (
        <div className="h-[400px] bg-gray-100 rounded-md overflow-auto p-4">
          <pre className="text-sm whitespace-pre-wrap">{textContent}</pre>
        </div>
      )
    } else {
      return (
        <div className="h-[300px] flex flex-col items-center justify-center bg-gray-800 rounded-md p-6 space-y-4">
          {getFileIcon()}
          <p className="text-gray-100 text-center">
            Preview not available for this file type.
            <br />
            Click the download button to view this file.
          </p>
        </div>
      )
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-3">
            {getFileIcon()}
            <div className="overflow-hidden">
              <div className="font-bold truncate pb-1" title={file.name}>
                {file.name}
              </div>
              <div className="text-sm font-normal text-gray-400 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                <span>{formatBytes(file.size)}</span>
                <span>•</span>
                <span>{file.type}</span>
                <span>•</span>
                <span>Uploaded {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="preview"
          className="flex-1 overflow-hidden flex flex-col"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mx-auto">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-auto mt-4">
            {renderPreview()}
          </TabsContent>

          <TabsContent value="details" className="flex-1 overflow-auto mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <div className="font-medium text-gray-500">Name</div>
                <div className="font-medium">{file.name}</div>

                <div className="font-medium text-gray-500">Type</div>
                <div>{file.type}</div>

                <div className="font-medium text-gray-500">Size</div>
                <div>{formatBytes(file.size)}</div>

                <div className="font-medium text-gray-500">Uploaded</div>
                <div>{new Date(file.uploadedAt).toLocaleString()}</div>

                <div className="font-medium text-gray-500">Location</div>
                <div>{file.folderId ? "In folder" : "Root directory"}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex sm:justify-between gap-2 flex-wrap">
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button variant="outline" size="sm" onClick={copyShareLink}>
              <Share className="h-4 w-4 mr-1" />
              Copy Link
            </Button>
          </div>
          <Button size="sm" asChild>
            <a href={previewUrl} download={file.name}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

