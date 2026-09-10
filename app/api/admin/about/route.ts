import { NextResponse } from 'next/server';
import { getAboutContent, saveAboutContent } from '@/lib/cms';

export async function GET() {
  try {
    const data = await getAboutContent();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about content' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = await saveAboutContent(body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
  }
}
