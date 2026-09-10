import { NextResponse } from 'next/server';
import { getContentData, saveContentData } from '@/lib/cms';
import { Property } from '@/lib/types';

// GET all properties
export async function GET() {
  try {
    const data = await getContentData();
    return NextResponse.json({ properties: data.properties });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load properties' }, { status: 500 });
  }
}

// POST create a new property
export async function POST(request: Request) {
  try {
    const newProperty: Property = await request.json();

    if (!newProperty.name || !newProperty.slug) {
      return NextResponse.json({ error: 'Property name and slug are required.' }, { status: 400 });
    }

    const data = await getContentData();

    // Check if slug exists
    if (data.properties.some((p) => p.slug === newProperty.slug)) {
      return NextResponse.json({ error: 'A property with this slug already exists.' }, { status: 409 });
    }

    data.properties.unshift(newProperty);
    await saveContentData(data);

    return NextResponse.json({ success: true, property: newProperty });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}

// PUT update an existing property
export async function PUT(request: Request) {
  try {
    const updatedProperty: Property = await request.json();

    if (!updatedProperty.slug) {
      return NextResponse.json({ error: 'Property slug is required for updating.' }, { status: 400 });
    }

    const data = await getContentData();
    const index = data.properties.findIndex((p) => p.slug === updatedProperty.slug);

    if (index === -1) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    data.properties[index] = updatedProperty;
    await saveContentData(data);

    return NextResponse.json({ success: true, property: updatedProperty });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

// DELETE a property
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required.' }, { status: 400 });
    }

    const data = await getContentData();
    const initialLength = data.properties.length;
    data.properties = data.properties.filter((p) => p.slug !== slug);

    if (data.properties.length === initialLength) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    await saveContentData(data);
    return NextResponse.json({ success: true, message: `Property '${slug}' deleted successfully.` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
