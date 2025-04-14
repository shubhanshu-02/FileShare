"use client"

import { Home, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolderRecord } from "@/lib/file-actions"

interface FolderNavigationProps {
  folderPath: FolderRecord[]
  onNavigate: (folderId: string | null) => void
}

export function FolderNavigation({ folderPath, onNavigate }: FolderNavigationProps) {
  return (
    <div className="flex items-center space-x-1 text-sm pb-4 overflow-x-auto">
      <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => onNavigate(null)}>
        <Home className="h-4 w-4" />
        <span className="ml-1 text-lg">Home</span>
      </Button>

      {folderPath.length > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}

      {folderPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => onNavigate(folder.id)}>
            {folder.name}
          </Button>
          {index < folderPath.length - 1 && <ChevronRight className="h-4 w-4 text-gray-400" />}
        </div>
      ))}
    </div>
  )
}

