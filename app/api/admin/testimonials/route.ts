import { NextRequest, NextResponse } from 'next/server';
import { getTestimonials, saveTestimonials } from '@/lib/cms';
import { Testimonial } from '@/lib/types';

export async function GET() {
  try {
    const testimonials = await getTestimonials();
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error('Failed to get testimonials:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve testimonials' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const testimonial: Testimonial = await req.json();
    if (!testimonial.quote || !testimonial.author) {
      return NextResponse.json({ success: false, error: 'Quote and author are required' }, { status: 400 });
    }
    const current = await getTestimonials();
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: testimonial.id || `test-${Date.now()}`,
      category: testimonial.category || 'Private Buyer',
    };
    const updated = [newTestimonial, ...current];
    await saveTestimonials(updated);
    return NextResponse.json({ success: true, testimonials: updated });
  } catch (error) {
    console.error('Failed to add testimonial:', error);
    return NextResponse.json({ success: false, error: 'Failed to add testimonial' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const testimonial: Testimonial = await req.json();
    const current = await getTestimonials();
    const updated = current.map((t) => (t.id === testimonial.id ? testimonial : t));
    await saveTestimonials(updated);
    return NextResponse.json({ success: true, testimonials: updated });
  } catch (error) {
    console.error('Failed to update testimonial:', error);
    return NextResponse.json({ success: false, error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const current = await getTestimonials();
    const updated = current.filter((t) => t.id !== id);
    await saveTestimonials(updated);
    return NextResponse.json({ success: true, testimonials: updated });
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
