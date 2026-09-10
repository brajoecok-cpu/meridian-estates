import { NextRequest, NextResponse } from 'next/server';
import { getLeadershipMembers, saveLeadershipMembers } from '@/lib/cms';
import { LeadershipMember } from '@/lib/types';

export async function GET() {
  try {
    const members = await getLeadershipMembers();
    return NextResponse.json({ success: true, members });
  } catch (error) {
    console.error('Failed to get leadership members:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve leadership team' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const member: LeadershipMember = await req.json();
    if (!member.name || !member.role) {
      return NextResponse.json({ success: false, error: 'Name and role are required' }, { status: 400 });
    }
    const current = await getLeadershipMembers();
    const newMember: LeadershipMember = {
      ...member,
      id: member.id || `lead-${Date.now()}`,
      image: member.image || '/images/im7.jpeg',
      order: current.length + 1,
    };
    const updated = [...current, newMember];
    await saveLeadershipMembers(updated);
    return NextResponse.json({ success: true, members: updated });
  } catch (error) {
    console.error('Failed to add leadership member:', error);
    return NextResponse.json({ success: false, error: 'Failed to add leadership member' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const member: LeadershipMember = await req.json();
    const current = await getLeadershipMembers();
    const updated = current.map((m) => (m.id === member.id ? member : m));
    await saveLeadershipMembers(updated);
    return NextResponse.json({ success: true, members: updated });
  } catch (error) {
    console.error('Failed to update leadership member:', error);
    return NextResponse.json({ success: false, error: 'Failed to update leadership member' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const current = await getLeadershipMembers();
    const updated = current.filter((m) => m.id !== id);
    await saveLeadershipMembers(updated);
    return NextResponse.json({ success: true, members: updated });
  } catch (error) {
    console.error('Failed to delete leadership member:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete leadership member' }, { status: 500 });
  }
}
