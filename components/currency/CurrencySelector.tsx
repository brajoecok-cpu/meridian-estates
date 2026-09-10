'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CURRENCY_RATES, CurrencyCode } from '@/lib/currency';
import { Globe, ChevronDown } from 'lucide-react';

export function CurrencySelector({ className = '' }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`} suppressHydrationWarning>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white border border-[#9FA1FF]/50 hover:border-[#9FA1FF] text-xs text-[#1A1C3B] transition-all rounded-full cursor-pointer shadow-sm"
        aria-label="Select Currency"
        suppressHydrationWarning
      >
        <Globe size={13} className="text-[#9FA1FF]" />
        <span className="font-mono text-[11px] uppercase tracking-wider font-bold" suppressHydrationWarning>
          {mounted ? currency : 'USD'}
        </span>
        <ChevronDown size={12} className={`text-[#1A1C3B]/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white/95 border border-[#9FA1FF] shadow-xl z-50 py-1.5 rounded-2xl backdrop-blur-2xl">
          <div className="px-3 py-1 text-[9px] uppercase tracking-widest text-[#1A1C3B]/60 font-bold border-b border-[#9FA1FF]/20">
            Global Currencies
          </div>
          {Object.values(CURRENCY_RATES).map((rate) => (
            <button
              key={rate.code}
              onClick={() => {
                setCurrency(rate.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer rounded-xl mx-auto ${
                currency === rate.code
                  ? 'bg-[#9FA1FF]/25 text-[#1A1C3B] font-bold'
                  : 'text-[#1A1C3B]/80 hover:bg-[#AEE2FF]/30 hover:text-[#1A1C3B]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{rate.flag}</span>
                <span className="font-semibold">{rate.code}</span>
              </span>
              <span className="font-mono text-[11px] text-[#1A1C3B]/60 font-bold">{rate.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
