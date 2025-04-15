import { FileExplorer } from "@/components/file-explorer";
import { Folder } from "lucide-react";
import Link from "next/link";

export default function DrivePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto py-8 px-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center">
          <Folder className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-extrabold text-white px-2 py-3 drop-shadow-[1px_0_6px_rgba(0,0,0,1)]">FileShare</h1>
            </div>
            <p className="text-gray-400 drop-shadow-[1px_0_6px_rgba(0,0,0,1)]">Upload, download, and manage files without signing up</p>
          </div>
          <Link href="/landing" className="text-blue-500 hover:text-blue-100 font-medium transition-colors text-lg drop-shadow-[1px_0_3px_rgba(0,0,0,1)]">
          ↗ How does this work?
          </Link>
        </header>

        <FileExplorer />
      </div>
    </div>
  )
}
