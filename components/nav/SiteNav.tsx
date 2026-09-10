'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, KeyRound } from 'lucide-react';
import { CurrencySelector } from '@/components/currency/CurrencySelector';
import { useSiteSettings } from '@/lib/site-settings-context';

const NAV_LINKS = [
  { href: '/developments', label: 'Developments' },
  { href: '/neighborhoods', label: 'Neighborhoods' },
  { href: '/amenities', label: 'Amenities' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const siteSettings = useSiteSettings();
  const contact = siteSettings?.contact;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handlePrivateViewingClick = (e: React.MouseEvent) => {
    const target = document.getElementById('inquire') || document.getElementById('private-viewing');
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
      setTimeout(() => {
        const nameInput = document.getElementById('name');
        if (nameInput) {
          nameInput.focus({ preventScroll: true });
        }
      }, 500);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled
            ? 'bg-[#D9F9DF]/95 backdrop-blur-md border-b border-[#9FA1FF]/40 py-4 shadow-lg shadow-[#9FA1FF]/10 text-[#1A1C3B]'
            : 'bg-gradient-to-b from-[#D9F9DF]/95 via-[#D9F9DF]/50 to-transparent py-6 text-[#1A1C3B]'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link
            href="/"
            className="group flex flex-col items-start transition-opacity hover:opacity-90"
          >
            <span className="font-serif text-2xl md:text-3xl tracking-[0.15em] font-bold uppercase text-[#1A1C3B]">
              Kings
            </span>
            <span className="text-[9px] uppercase tracking-[0.45em] text-[#9FA1FF] font-bold -mt-1 group-hover:text-[#1A1C3B] transition-colors">
              Real Estate • Miami
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 relative py-1 ${isActive
                      ? 'text-[#1A1C3B] font-bold'
                      : 'text-[#1A1C3B]/75 hover:text-[#1A1C3B]'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#9FA1FF]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Currency Toggle */}
          <div className="hidden lg:flex items-center space-x-4">
            <CurrencySelector />
            <Link
              href="/contact"
              onClick={handlePrivateViewingClick}
              className="relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-bold text-[#1A1C3B] bg-[#9FA1FF] hover:bg-[#B5BAFF] border border-[#9FA1FF] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer rounded-full"
            >
              <KeyRound size={13} />
              <span>Private Viewing</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle & Currency */}
          <div className="lg:hidden flex items-center gap-3">
            <CurrencySelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              className="p-2 text-[#1A1C3B] hover:text-[#9FA1FF] transition-colors"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-40 lg:hidden bg-[#D9F9DF]/98 backdrop-blur-2xl flex flex-col justify-between px-8 pt-32 pb-12 overflow-y-auto border-b border-[#9FA1FF]/40 text-[#1A1C3B]"
          >
            {/* Ambient periwinkle/aqua glow */}
            <div className="absolute top-1/4 right-0 w-72 h-72 bg-[#AEE2FF]/50 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col space-y-6">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold">
                Navigation Menu
              </span>

              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-3xl text-[#1A1C3B] hover:text-[#9FA1FF] transition-colors flex items-center justify-between group font-bold"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight
                      size={20}
                      className="text-[#9FA1FF] opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-[#9FA1FF]/30 flex flex-col space-y-4">
              <Link
                href="/contact"
                onClick={handlePrivateViewingClick}
                className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#9FA1FF] hover:bg-[#B5BAFF] text-[#1A1C3B] border border-[#9FA1FF] text-xs uppercase tracking-[0.25em] font-bold transition-colors cursor-pointer rounded-full shadow-md"
              >
                <KeyRound size={15} />
                <span>Schedule Private Viewing</span>
              </Link>
              <div className="text-center text-[11px] text-[#1A1C3B]/70 tracking-wider space-y-1">
                <div>WhatsApp: <span className="text-[#25D366] font-bold">{contact?.whatsapp || '+233 200316267'}</span></div>
                <div>{contact?.email || 'concierge@kings-realestate.com'}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
