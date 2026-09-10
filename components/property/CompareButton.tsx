'use client';

import React from 'react';
import { Columns3, Check } from 'lucide-react';
import { Property } from '@/lib/types';
import { useComparison } from '@/lib/comparison';

export function CompareButton({ property }: { property: Property }) {
  const { toggleProperty, isInComparison } = useComparison();
  const active = isInComparison(property.slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleProperty(property);
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
        active
          ? 'bg-[#9E7B3B] text-[#16191E] shadow-md shadow-[#9E7B3B]/30'
          : 'bg-[#16191E]/80 hover:bg-[#1C2027] border border-[#F7F5F0]/20 text-[#C5CBD5] hover:text-white backdrop-blur-md'
      }`}
      title={active ? 'Remove from comparison' : 'Add to side-by-side comparison matrix'}
    >
      {active ? <Check size={12} /> : <Columns3 size={12} />}
      <span>{active ? 'Comparing' : 'Compare'}</span>
    </button>
  );
}
