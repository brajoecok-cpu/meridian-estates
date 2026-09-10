'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';
import { useCurrency } from '@/lib/currency';
import { CompareButton } from '@/components/property/CompareButton';
import { ArrowUpRight, Calendar, MapPin, Diamond, Bed, Bath, ChefHat, Maximize } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { formatPrice } = useCurrency();

  return (
    <Link
      href={`/developments/${property.slug}`}
      className="group relative block w-full overflow-hidden bg-white/70 backdrop-blur-md border border-[#9FA1FF]/40 hover:border-[#9FA1FF] transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-[#9FA1FF]/20 flex flex-col rounded-3xl"
    >
      {/* Real High-Resolution Photographic Window */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#AEE2FF]/40">
        <Image
          src={property.heroPoster}
          alt={property.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Soft Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C3B]/50 via-transparent to-black/20 pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Status Badge & Compare Button */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          {property.status && (
            <span className="px-3 py-1 bg-[#D9F9DF]/95 backdrop-blur-md border border-[#9FA1FF] text-[10px] uppercase tracking-[0.2em] text-[#1A1C3B] font-bold rounded-full shadow-sm">
              {property.status}
            </span>
          )}
          <CompareButton property={property} />
        </div>

        {/* Explore Pill Button */}
        <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#D9F9DF]/90 backdrop-blur-md border border-[#9FA1FF] flex items-center justify-center text-[#1A1C3B] group-hover:bg-[#9FA1FF] group-hover:text-[#1A1C3B] transition-all duration-300 shadow-sm">
          <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* Information Area */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-white/50 backdrop-blur-sm">
        <div>
          {/* Location & Unit Type */}
          <div className="flex items-center justify-between text-xs text-[#1A1C3B]/70 mb-2 font-sans">
            <span className="flex items-center gap-1 font-semibold">
              <MapPin size={13} className="text-[#9FA1FF]" />
              {property.neighborhood}
            </span>
            <span className="uppercase tracking-wider text-[10px] text-[#1A1C3B]/60 font-bold">
              {property.unitType}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-2xl text-[#1A1C3B] group-hover:text-[#9FA1FF] transition-colors mb-2 font-bold">
            {property.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs md:text-sm text-[#1A1C3B]/75 line-clamp-2 leading-relaxed font-sans font-light mb-6">
            {property.tagline}
          </p>

          {/* Unit Features */}
          {property.unitFeatures && (
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pt-4 border-t border-[#9FA1FF]/20">
              <div className="flex items-center gap-2 text-xs text-[#1A1C3B]/80 font-sans" title={property.unitFeatures.bedrooms}>
                <Bed size={14} className="text-[#9FA1FF] shrink-0" />
                <span className="truncate">{property.unitFeatures.bedrooms}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1A1C3B]/80 font-sans" title={property.unitFeatures.bathrooms}>
                <Bath size={14} className="text-[#9FA1FF] shrink-0" />
                <span className="truncate">{property.unitFeatures.bathrooms}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1A1C3B]/80 font-sans" title={property.unitFeatures.kitchen}>
                <ChefHat size={14} className="text-[#9FA1FF] shrink-0" />
                <span className="truncate">{property.unitFeatures.kitchen}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1A1C3B]/80 font-sans" title={property.unitFeatures.squareFootage}>
                <Maximize size={14} className="text-[#9FA1FF] shrink-0" />
                <span className="truncate">{property.unitFeatures.squareFootage}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer info: Price & Completion */}
        <div className="pt-4 border-t border-[#9FA1FF]/30 flex items-center justify-between">
          <div>
            <span className="block text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold">
              Inquiries From
            </span>
            <span className="font-serif text-lg text-[#1A1C3B] font-bold" suppressHydrationWarning>
              {formatPrice(property.priceFrom)}
            </span>
          </div>

          <div className="text-right">
            <span className="block text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold">
              Delivery
            </span>
            <span className="text-xs text-[#1A1C3B] font-semibold flex items-center gap-1">
              <Calendar size={12} className="text-[#9FA1FF]" />
              {property.completionDate}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
