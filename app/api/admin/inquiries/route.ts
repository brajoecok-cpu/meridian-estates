import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const inquiriesFilePath = path.join(process.cwd(), 'content', 'inquiries.json');

async function getInquiriesData() {
  try {
    if (fs.existsSync(inquiriesFilePath)) {
      const content = await fs.promises.readFile(inquiriesFilePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading inquiries.json:', error);
  }
  return { inquiries: [] };
}

async function saveInquiriesData(data: { inquiries: any[] }) {
  await fs.promises.writeFile(inquiriesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET all inquiries
export async function GET() {
  try {
    const data = await getInquiriesData();
    return NextResponse.json({ inquiries: data.inquiries });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve inquiries' }, { status: 500 });
  }
}

// PUT update inquiry status
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required.' }, { status: 400 });
    }

    const data = await getInquiriesData();
    const index = data.inquiries.findIndex((i: any) => i.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    data.inquiries[index].status = status;
    data.inquiries[index].updatedAt = new Date().toISOString();
    await saveInquiriesData(data);

    return NextResponse.json({ success: true, inquiry: data.inquiries[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

// DELETE an inquiry
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const data = await getInquiriesData();
    data.inquiries = data.inquiries.filter((i: any) => i.id !== id);
    await saveInquiriesData(data);

    return NextResponse.json({ success: true, message: `Inquiry ${id} deleted.` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
