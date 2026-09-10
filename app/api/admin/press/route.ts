import { NextRequest, NextResponse } from 'next/server';
import { getPressArticles, savePressArticles } from '@/lib/cms';
import { PressArticle } from '@/lib/types';

export async function GET() {
  try {
    const articles = await getPressArticles();
    return NextResponse.json({ success: true, articles });
  } catch (error) {
    console.error('Failed to get press articles:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve press articles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const article: PressArticle = await req.json();
    if (!article.title || !article.publication) {
      return NextResponse.json({ success: false, error: 'Title and publication are required' }, { status: 400 });
    }
    const current = await getPressArticles();
    const newArticle: PressArticle = {
      ...article,
      id: article.id || `press-${Date.now()}`,
      date: article.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    const updated = [newArticle, ...current];
    await savePressArticles(updated);
    return NextResponse.json({ success: true, articles: updated });
  } catch (error) {
    console.error('Failed to add press article:', error);
    return NextResponse.json({ success: false, error: 'Failed to add press article' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const article: PressArticle = await req.json();
    const current = await getPressArticles();
    const updated = current.map((a) => (a.id === article.id ? article : a));
    await savePressArticles(updated);
    return NextResponse.json({ success: true, articles: updated });
  } catch (error) {
    console.error('Failed to update press article:', error);
    return NextResponse.json({ success: false, error: 'Failed to update press article' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const current = await getPressArticles();
    const updated = current.filter((a) => a.id !== id);
    await savePressArticles(updated);
    return NextResponse.json({ success: true, articles: updated });
  } catch (error) {
    console.error('Failed to delete press article:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete press article' }, { status: 500 });
  }
}
