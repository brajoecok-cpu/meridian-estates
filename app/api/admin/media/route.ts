import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    const videosDir = path.join(process.cwd(), 'public', 'videos');

    const images: string[] = [];
    const videos: string[] = [];

    if (fs.existsSync(imagesDir)) {
      const files = await fs.promises.readdir(imagesDir);
      files.forEach((file) => {
        if (/\.(jpg|jpeg|png|webp|avif)$/i.test(file)) {
          images.push(`/images/${file}`);
        }
      });
    }

    if (fs.existsSync(videosDir)) {
      const files = await fs.promises.readdir(videosDir);
      files.forEach((file) => {
        if (/\.(mp4|webm|mov)$/i.test(file)) {
          videos.push(`/videos/${file}`);
        }
      });
    }

    return NextResponse.json({ images, videos });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to scan media directory' }, { status: 500 });
  }
}

// POST: Upload Media File (Images / Videos) from Device
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in upload.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
    const ext = path.extname(originalName).toLowerCase();
    const isVideo = /\.(mp4|webm|mov)$/i.test(ext);
    const isImage = /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(ext);

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload JPG, PNG, WEBP, or MP4.' },
        { status: 400 }
      );
    }

    const targetDir = isVideo
      ? path.join(process.cwd(), 'public', 'videos')
      : path.join(process.cwd(), 'public', 'images');

    if (!fs.existsSync(targetDir)) {
      await fs.promises.mkdir(targetDir, { recursive: true });
    }

    // Unique filename timestamp prefix
    const timestamp = Date.now();
    const fileName = `${timestamp}_${originalName}`;
    const filePath = path.join(targetDir, fileName);

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = isVideo ? `/videos/${fileName}` : `/images/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
      type: isVideo ? 'video' : 'image',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to process file upload.' }, { status: 500 });
  }
}
