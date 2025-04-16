import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  const id = params.id

  try {
    const file = await prisma.file.findUnique({
      where: { id }
    })
    
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
    
    const isDownload = request.nextUrl.searchParams.get("download") === "true"
    
    const url = new URL(file.url)

    if (isDownload) {
      url.searchParams.set("response-content-disposition", 
        `attachment; filename="${encodeURIComponent(file.name)}"`)
    }
    
    return NextResponse.redirect(url)
  } catch (error) {
    console.error("Error serving file:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
