'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteSettings } from '@/lib/site-settings-context';

export function Footer() {
  const pathname = usePathname();
  const siteSettings = useSiteSettings();
  const contact = siteSettings?.contact;

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#AEE2FF]/25 text-[#1A1C3B] border-t border-[#9FA1FF]/30 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.18em] font-bold uppercase text-[#1A1C3B]">
                Kings
              </span>
              <span className="block text-[9px] uppercase tracking-[0.45em] text-[#9FA1FF] font-bold mt-0.5">
                Real Estate • Miami Development Group
              </span>
            </Link>
            <p className="text-sm text-[#1A1C3B]/80 leading-relaxed max-w-md font-sans">
              Curating Miami’s most transcendent architectural landmarks. Defined by uncompromising engineering, panoramic bayfront horizons, and white-glove residential sovereignty.
            </p>
            <div className="pt-2 text-xs text-[#9FA1FF] font-bold tracking-wider uppercase">
              Sales Gallery: 1421 Brickell Avenue, 48th Floor, Miami, FL 33131
            </div>
          </div>

          {/* Column 2: Portfolios */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#1A1C3B] font-bold">
              Portfolio
            </h4>
            <ul className="space-y-2.5 text-sm text-[#1A1C3B]/75">
              <li>
                <Link href="/developments/the-marquis-brickell" className="hover:text-[#9FA1FF] transition-colors">
                  The Marquis Brickell
                </Link>
              </li>
              <li>
                <Link href="/developments/aura-biscayne" className="hover:text-[#9FA1FF] transition-colors">
                  Aura Biscayne
                </Link>
              </li>
              <li>
                <Link href="/developments/the-palma-grove" className="hover:text-[#9FA1FF] transition-colors">
                  The Palma Coconut Grove
                </Link>
              </li>
              <li>
                <Link href="/developments/vela-star-island" className="hover:text-[#9FA1FF] transition-colors">
                  Vela Star Island
                </Link>
              </li>
              <li>
                <Link href="/developments" className="text-[#9FA1FF] hover:text-[#1A1C3B] font-bold transition-colors inline-flex items-center gap-1 mt-1 text-xs uppercase tracking-wider">
                  View All Residences →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Exploration */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#1A1C3B] font-bold">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm text-[#1A1C3B]/75">
              <li>
                <Link href="/neighborhoods" className="hover:text-[#9FA1FF] transition-colors">
                  Neighborhoods
                </Link>
              </li>
              <li>
                <Link href="/amenities" className="hover:text-[#9FA1FF] transition-colors">
                  Signature Amenities
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#9FA1FF] transition-colors">
                  Architectural Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#9FA1FF] transition-colors">
                  The Developer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#9FA1FF] transition-colors">
                  Private Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Concierge */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#1A1C3B] font-bold">
              Concierge
            </h4>
            <p className="text-xs text-[#1A1C3B]/80 leading-relaxed">
              For discrete acquisition consultations or yacht slip inquiries:
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#1A1C3B]/60 font-medium">Phone:</span>{' '}
                <a href={`tel:${contact?.phone?.replace(/[^0-9+]/g, '')}`} className="text-[#1A1C3B] hover:text-[#9FA1FF] font-bold transition-colors">
                  {contact?.phone || '+233 200316267'}
                </a>
              </div>
              <div>
                <span className="text-[#1A1C3B]/60 font-medium">Email:</span>{' '}
                <a href={`mailto:${contact?.email || 'concierge@kings-realestate.com'}`} className="text-[#1A1C3B] hover:text-[#9FA1FF] font-bold transition-colors">
                  {contact?.email || 'concierge@kings-realestate.com'}
                </a>
              </div>
              <div>
                <span className="text-[#1A1C3B]/60 font-medium">WhatsApp:</span>{' '}
                <span className="text-[#25D366] font-bold">
                  {contact?.whatsapp || '+233 200316267'} (VIP Direct)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Legal */}
        <div className="pt-8 border-t border-[#9FA1FF]/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#1A1C3B]/70">
          <div className="flex items-center gap-6">
            <span>© 2026 Kings Real Estate Development LLC. All rights reserved.</span>
            <Link href="/legal" className="hover:text-[#1A1C3B] transition-colors underline underline-offset-4">
              Legal Disclaimer & Equal Housing Opportunity
            </Link>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#1A1C3B]/60">
            <span>Miami</span>
            <span>•</span>
            <span>New York</span>
            <span>•</span>
            <span>London</span>
            <span>•</span>
            <span>Monaco</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
