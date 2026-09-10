import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const inquiriesFilePath = path.join(process.cwd(), 'content', 'inquiries.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    // Lead qualification score calculation
    let priorityTier = 'Standard VIP';
    if (body.budget?.includes('$20M+') || body.budget?.includes('$10M - $20M')) {
      priorityTier = 'Tier 1 Ultra-High-Net-Worth (UHNW)';
    } else if (body.budget?.includes('$5M - $10M')) {
      priorityTier = 'Tier 2 Qualified Acquirer';
    }

    const newInquiry = {
      id: `inq-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      fullName: body.name,
      email: body.email,
      phone: body.phone || 'Not Provided',
      propertyInterest: body.propertyName || 'General Portfolio',
      propertySlug: body.propertySlug || null,
      budgetRange: body.budget || 'Unspecified',
      acquisitionTimeframe: body.timeframe || 'Immediate',
      priorityTier,
      status: 'New',
      specialRequirements: body.message || 'None specified',
      ndaAcknowledged: Boolean(body.consent),
    };

    // Persist to content/inquiries.json
    try {
      let existingInquiries = [];
      if (fs.existsSync(inquiriesFilePath)) {
        const fileContent = await fs.promises.readFile(inquiriesFilePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        existingInquiries = parsed.inquiries || [];
      }
      existingInquiries.unshift(newInquiry);
      await fs.promises.writeFile(
        inquiriesFilePath,
        JSON.stringify({ inquiries: existingInquiries }, null, 2),
        'utf-8'
      );
    } catch (saveErr) {
      console.error('Failed to persist inquiry to inquiries.json:', saveErr);
    }

    // Forward to CRM Webhook if configured
    const webhookUrl = process.env.CRM_WEBHOOK_URL;
    let webhookStatus = 'not_configured';

    if (webhookUrl) {
      try {
        const crmResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Kings-Lead-Source': 'VIP-Web-Inquiry',
          },
          body: JSON.stringify(newInquiry),
        });
        webhookStatus = crmResponse.ok ? 'dispatched_successfully' : `failed_${crmResponse.status}`;
      } catch (crmErr) {
        console.error('Failed to forward lead to CRM Webhook:', crmErr);
        webhookStatus = 'error_connecting_to_webhook';
      }
    }

    console.log('🏛️ [VIP INQUIRY PERSISTED & DISPATCHED]', {
      id: newInquiry.id,
      fullName: newInquiry.fullName,
      priorityTier: newInquiry.priorityTier,
      webhookStatus,
    });

    return NextResponse.json({
      success: true,
      id: newInquiry.id,
      priorityTier,
      message: 'Inquiry received. The Senior Managing Director of Private Client Services will reach out discreetly.',
    });
  } catch (error) {
    console.error('Error processing inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error processing request.' },
      { status: 500 }
    );
  }
}
