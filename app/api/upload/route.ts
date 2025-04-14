import { uploadFiles } from "@/lib/file-actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try{
        const formData = await request.formData()
        const result = await uploadFiles(formData)

        return NextResponse.json({
            success: true,
            files:result
        })
    }catch(error){
        console.error("Upload error: ",error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        )
    }
}