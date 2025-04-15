"use client"

import { FileRecord, FileTypeInfo, FolderRecord, getAllFolders, getFiles, getFileTypes } from "@/lib/file-actions";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { UploadForm } from "./uploadForm";
import { FolderPlus } from "lucide-react";
import { FolderCreationDialog } from "./folder-creation-dialog";
import { FileTypeFilter } from "./file-type-filter";
import { FolderNavigation } from "./folder-navigation";
import { FileList } from "./file-list";


export function FileExplorer() {
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [folders, setFolders] = useState<FolderRecord[]>([]);
    const [fileTypes, setFileTypes] = useState<FileTypeInfo[]>([]);
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [folderPath, setFolderPath] = useState<FolderRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showFolderDialog, setShowFolderDialog] = useState(false)
    const [activeTypeFilters, setActiveTypeFilters] = useState<string[]>([])

    useEffect(() => {
        loadFilesAndFolders()
    }, [currentFolder])

    useEffect(() => {
        loadFileTypes()
    }, [])

    async function loadFilesAndFolders() {
        setIsLoading(true)
        try {
            const [fileList, folderList] = await Promise.all([getFiles(currentFolder), getAllFolders()])

            setFiles(fileList)
            setFolders(folderList)

            if (currentFolder) {
                updateFolderPath(currentFolder, folderList)
            } else {
                setFolderPath([])
            }
        } catch (error) {
            console.error("Failed to load files and folders: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    async function loadFileTypes() {
        try {
            const types = await getFileTypes()
            setFileTypes(types)
        } catch (error) {
            console.error("Failed to load file types:", error)
        }
    }

    async function updateFolderPath(folderId:string, allFolders:FolderRecord[]) {
        const path: FolderRecord[] = []
        let currentId = folderId

        while(currentId){
            const folder = allFolders.find((f) => f.id === currentId)
            if(folder){
                path.unshift(folder)
                currentId = folder.parentId || ""
            }else{
                break
            }
        }
        setFolderPath(path)
    }

    function navigateToFolder(folderId : string | null){
        setCurrentFolder(folderId)
    }
    function handleFolderCreated(){
        loadFilesAndFolders()
        setShowFolderDialog(false)
    }
    function handleFileDeleted(){
        loadFilesAndFolders()
        loadFileTypes()
    }

    function handleTypeFilterChange(types: string[]) {
        setActiveTypeFilters(types)
      }

    return(
        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="bg-background p-6 rounded-lg shadow">
          <div className="mb-6">
            <UploadForm
              currentFolder={currentFolder}
              onUploadComplete={() => {
                loadFilesAndFolders()
                loadFileTypes()
              }}
            />
          </div>
          <div className="mt-8 space-y-2">
          <div className="flex items-center justify-between ">
            <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider ">Folders</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFolderDialog(true)} className="h-8 px-2 cursor-pointer">
              <FolderPlus className="h-4 w-4 " />
              New
            </Button>
          </div>

          <button
            onClick={() => navigateToFolder(null)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              currentFolder === null ? "bg-gray-200 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Files
          </button>

          {folders
            .filter((folder) => !folder.parentId) // Only show root folders in sidebar
            .map((folder) => (
              <button
                key={folder.id}
                onClick={() => navigateToFolder(folder.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  currentFolder === folder.id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-500 hover:bg-gray-400 hover:text-gray-900"
                }`}
              >
                {folder.name}
              </button>
            ))}
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">File Types</h3>
          <FileTypeFilter fileTypes={fileTypes} activeFilters={activeTypeFilters} onChange={handleTypeFilterChange} />
        </div>
      </div>

      <div className="bg-background p-4 rounded-lg shadow">
        <FolderNavigation folderPath={folderPath} onNavigate={navigateToFolder} />

        <FileList
          files={files}
          folders={folders.filter(folder => folder.parentId === currentFolder)}
          onFolderClick={navigateToFolder}
          onDeleteSuccess={handleFileDeleted}
          isLoading={isLoading}
          activeTypeFilters={activeTypeFilters}
        />
      </div>

      <FolderCreationDialog
        open={showFolderDialog}
        onOpenChange={setShowFolderDialog}
        currentFolder={currentFolder}
        onFolderCreated={handleFolderCreated}
      />
        </div>
    )
}