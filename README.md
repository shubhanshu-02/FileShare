# FileShare - Open Source File Sharing Platform

FileShare is a modern, open-source file sharing platform that allows users to upload, organize, and share files without requiring account creation. Built with Next.js, TypeScript, and AWS S3, it provides a seamless and intuitive user experience for file management.

[File Share](https://fileshareio.vercel.app)

## 🚀 Features

- *No Account Required*: Instant file sharing without signup or login
- *Intuitive File Management*: Upload, download, preview, and organize files
- *Folder Organization*: Create folders and subfolders to organize content
- *File Preview*: Built-in preview for images, videos, PDFs, and text files
- *Multiple File Upload*: Upload multiple files at once with real-time progress tracking
- *File Filtering, Searching, Sorting*: Filter files by type (images, documents, videos, etc.) Quickly and Sort files by name, date, or size

## 🛠 Technology Stack

- *Frontend*: Next.js 14, React, TypeScript, Tailwind CSS
- *UI Components*: shadcn/ui, Radix UI
- *Backend*: Next.js API Routes, Server Actions
- *Database*: PostgreSQL with Prisma ORM
- *Storage*: AWS S3
- *Deployment*: Vercel

## 📋 Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- AWS account with S3 bucket

## ENV STRUCTURE
DATABASE_URL="postgresql://username:password@localhost:5432/FileShare?schema=public"<br>
AWS_REGION=your-region<br>
AWS_ACCESS_KEY_ID=your-access-key<br>
AWS_SECRET_ACCESS_KEY=your-secret-key<br>
S3_BUCKET_NAME=your-bucket-name<br>


## 📁 Project Structure

├── app/                    # Next.js App Router<br>
│   ├── api/                # API Routes<br>
│   └── page.tsx            # Landing page<br>
├── components/             # React components<br>
│   ├── ui/                 # UI components<br>
│   ├── file-card.tsx       # File card component<br>
│   ├── file-explorer.tsx   # Main file explorer<br>
│   └── ...                 # Other components<br>
├── lib/                    # Utility functions<br>
│   ├── file-actions.ts     # Server actions for file operations<br>
│   └── utils.ts            # Utility functions<br>
├── prisma/                 # Prisma schema and migrations<br>
│   └── schema.prisma       # Database schema<br>
├── public/                 # Static assets<br>
└── ...                     # Config files<br>


## 🔄 API Endpoints

- GET /api/files/:id - Get a specific file
- POST /api/upload - Upload files

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request
