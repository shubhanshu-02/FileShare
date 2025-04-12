import { Folder } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DrivePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center">
          <Folder className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-white px-2 py-3">FileShare</h1>
            </div>
            <p className="text-gray-400">Upload, download, and manage files without signing up</p>
          </div>
          <Link href="/landing" className="text-blue-600 hover:text-blue-100 font-medium transition-colors text-md">
            How does this work?↗
          </Link>
        </header>

        {/* <FileExplorer /> */}
      </div>
    </div>
  )
}
