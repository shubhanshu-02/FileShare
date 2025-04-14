"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FileTypeInfo } from "@/lib/file-actions"

interface FileTypeFilterProps {
  fileTypes: FileTypeInfo[]
  activeFilters: string[]
  onChange: (types: string[]) => void
}

export function FileTypeFilter({ fileTypes, activeFilters, onChange }: FileTypeFilterProps) {
  function handleCheckboxChange(type: string) {
    if (activeFilters.includes(type)) {
      onChange(activeFilters.filter((t) => t !== type))
    } else {
      onChange([...activeFilters, type])
    }
  }

  if (fileTypes.length === 0) {
    return <div className="text-sm text-gray-500 italic">No files uploaded yet</div>
  }

  return (
    <div className="space-y-2">
      {fileTypes.map((fileType) => (
        <div key={fileType.type} className="flex items-center space-x-2">
          <Checkbox
            id={`filter-${fileType.type}`}
            checked={activeFilters.includes(fileType.type)}
            onCheckedChange={() => handleCheckboxChange(fileType.type)}
          />
          <Label
            htmlFor={`filter-${fileType.type}`}
            className="text-sm cursor-pointer flex items-center justify-between w-full"
          >
            <span>{fileType.label}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{fileType.count}</span>
          </Label>
        </div>
      ))}
    </div>
  )
}

