import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const inquiriesFilePath = path.join(process.cwd(), 'content', 'inquiries.json');

export async function GET() {
  try {
    let inquiries: any[] = [];
    if (fs.existsSync(inquiriesFilePath)) {
      const content = await fs.promises.readFile(inquiriesFilePath, 'utf-8');
      inquiries = JSON.parse(content).inquiries || [];
    }

    const headers = [
      'Inquiry ID',
      'Timestamp',
      'Full Name',
      'Email',
      'Phone',
      'Property Interest',
      'Budget Tier',
      'Priority Tier',
      'Acquisition Timeframe',
      'Status',
      'Special Requirements',
    ];

    const rows = inquiries.map((i) => [
      `"${i.id || ''}"`,
      `"${i.timestamp || ''}"`,
      `"${(i.fullName || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.propertyInterest || '').replace(/"/g, '""')}"`,
      `"${(i.budgetRange || '').replace(/"/g, '""')}"`,
      `"${(i.priorityTier || '').replace(/"/g, '""')}"`,
      `"${(i.acquisitionTimeframe || '').replace(/"/g, '""')}"`,
      `"${(i.status || '').replace(/"/g, '""')}"`,
      `"${(i.specialRequirements || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="kings_vip_inquiries_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 });
  }
}
