import { NextResponse } from 'next/server';
import { getContentData, saveContentData } from '@/lib/cms';
import { Neighborhood } from '@/lib/types';

export async function GET() {
  try {
    const data = await getContentData();
    return NextResponse.json({ neighborhoods: data.neighborhoods });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load neighborhoods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newNeighborhood: Neighborhood = await request.json();
    const data = await getContentData();

    if (data.neighborhoods.some((n) => n.slug === newNeighborhood.slug)) {
      return NextResponse.json({ error: 'Neighborhood slug already exists.' }, { status: 409 });
    }

    data.neighborhoods.push(newNeighborhood);
    await saveContentData(data);
    return NextResponse.json({ success: true, neighborhood: newNeighborhood });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create neighborhood' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updated: Neighborhood = await request.json();
    const data = await getContentData();
    const idx = data.neighborhoods.findIndex((n) => n.slug === updated.slug);

    if (idx === -1) {
      return NextResponse.json({ error: 'Neighborhood not found.' }, { status: 404 });
    }

    data.neighborhoods[idx] = updated;
    await saveContentData(data);
    return NextResponse.json({ success: true, neighborhood: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update neighborhood' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const data = await getContentData();

    data.neighborhoods = data.neighborhoods.filter((n) => n.slug !== slug);
    await saveContentData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete neighborhood' }, { status: 500 });
  }
}
