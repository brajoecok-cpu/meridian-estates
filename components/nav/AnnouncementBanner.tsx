'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Diamond, X } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

export function AnnouncementBanner() {
  const [banner, setBanner] = useState<SiteSettings['announcementBanner'] | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.announcementBanner?.enabled) {
          setBanner(data.settings.announcementBanner);
        }
      })
      .catch(() => {});
  }, []);

  if (!banner || !banner.enabled || dismissed) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-[#17462E] via-[#113523] to-[#17462E] text-white border-b border-[rgb(171,231,178)]/30 px-4 py-2 text-xs font-medium shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 mx-auto text-center truncate">
          {banner.badge && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 bg-[rgb(203,243,187)] text-[#17462E] text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm">
              <Diamond size={10} />
              <span>{banner.badge}</span>
            </span>
          )}
          <span className="text-[#F7F5F0] truncate font-light tracking-wide">
            {banner.text}
          </span>
          {banner.linkText && banner.linkUrl && (
            <Link
              href={banner.linkUrl}
              className="inline-flex items-center gap-1 text-[rgb(203,243,187)] hover:text-white underline underline-offset-4 font-semibold transition-colors flex-shrink-0 ml-1"
            >
              <span>{banner.linkText}</span>
              <ArrowRight size={12} />
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-white/70 hover:text-white p-1 rounded-md transition-colors cursor-pointer flex-shrink-0"
          title="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
