"use client"

import type React from "react"

import { useState } from "react"
import { createFolder } from "@/lib/file-actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"


interface FolderCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentFolder: string | null
  onFolderCreated: () => void
}

export function FolderCreationDialog({
  open,
  onOpenChange,
  currentFolder,
  onFolderCreated,
}: FolderCreationDialogProps) {
  const [folderName, setFolderName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!folderName.trim()) {
      setError("Folder name cannot be empty")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await createFolder({
        name: folderName.trim(),
        parentId: currentFolder,
      })

      setFolderName("")
      onFolderCreated()
    } catch (error) {
      console.error("Failed to create folder:", error)
      setError("Failed to create folder. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>Enter a name for your new folder.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="mb-4">
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="My Folder"
                autoFocus
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

