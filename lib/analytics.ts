/**
 * Meridian Estates Analytics & VIP Telemetry Engine
 */

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA4_ID;

// Log page views
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag && GA_TRACKING_ID) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
}

// Track VIP Inquiry Form submissions
export function trackLeadSubmission(data: {
  propertyName?: string;
  propertySlug?: string;
  budget?: string;
  timeframe?: string;
}) {
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'vip_lead_submitted', {
      event_category: 'Leads',
      event_label: data.propertyName || 'General Inquiry',
      property_name: data.propertyName,
      property_slug: data.propertySlug,
      budget_tier: data.budget,
      timeframe: data.timeframe,
    });
  }
}

// Track room-by-room reveal section impressions
export function trackRoomRevealView(propertySlug: string, sectionId: string, sectionTitle?: string) {
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'room_reveal_view', {
      event_category: 'Engagement',
      property_slug: propertySlug,
      section_id: sectionId,
      section_title: sectionTitle,
    });
  }
}

// Track scroll depth milestones (25%, 50%, 75%, 100%)
export function trackScrollDepth(percent: number, pageName: string) {
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'scroll_depth', {
      event_category: 'Scroll',
      event_label: `${pageName} - ${percent}%`,
      scroll_percentage: percent,
    });
  }
}
