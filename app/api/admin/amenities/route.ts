import { NextResponse } from 'next/server';
import { getContentData, saveContentData } from '@/lib/cms';
import { Amenity } from '@/lib/types';

export async function GET() {
  try {
    const data = await getContentData();
    return NextResponse.json({ amenities: data.amenities });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load amenities' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newAmenity: Amenity = await request.json();
    const data = await getContentData();

    data.amenities.push(newAmenity);
    await saveContentData(data);
    return NextResponse.json({ success: true, amenity: newAmenity });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create amenity' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updated: Amenity = await request.json();
    const data = await getContentData();
    const idx = data.amenities.findIndex((a) => a.id === updated.id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Amenity not found.' }, { status: 404 });
    }

    data.amenities[idx] = updated;
    await saveContentData(data);
    return NextResponse.json({ success: true, amenity: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update amenity' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await getContentData();

    data.amenities = data.amenities.filter((a) => a.id !== id);
    await saveContentData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete amenity' }, { status: 500 });
  }
}
