import { NextRequest, NextResponse } from 'next/server';
import { getGalleryItems, saveGalleryItems } from '@/lib/cms';
import { GalleryItem } from '@/lib/types';

export async function GET() {
  try {
    const items = await getGalleryItems();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Failed to get gallery items:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve gallery items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const item: GalleryItem = await req.json();
    if (!item.image) {
      return NextResponse.json({ success: false, error: 'Photo is required' }, { status: 400 });
    }
    const current = await getGalleryItems();
    const newItem: GalleryItem = {
      ...item,
      id: item.id || `gal-${Date.now()}`,
      title: item.title || 'Architectural Showcase',
      category: item.category || 'Architecture',
    };
    const updated = [newItem, ...current];
    await saveGalleryItems(updated);
    return NextResponse.json({ success: true, items: updated });
  } catch (error) {
    console.error('Failed to add gallery item:', error);
    return NextResponse.json({ success: false, error: 'Failed to add gallery item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const item: GalleryItem = await req.json();
    const current = await getGalleryItems();
    const updated = current.map((g) => (g.id === item.id ? item : g));
    await saveGalleryItems(updated);
    return NextResponse.json({ success: true, items: updated });
  } catch (error) {
    console.error('Failed to update gallery item:', error);
    return NextResponse.json({ success: false, error: 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const current = await getGalleryItems();
    const updated = current.filter((g) => g.id !== id);
    await saveGalleryItems(updated);
    return NextResponse.json({ success: true, items: updated });
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
