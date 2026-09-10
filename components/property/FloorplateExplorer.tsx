'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCurrency } from '@/lib/currency';
import { Layers, Maximize2, Compass, Check, ArrowRight, Diamond, Building2, ShieldCheck } from 'lucide-react';

interface TierData {
  id: string;
  name: string;
  level: string;
  priceFromUsd: number;
  interiorSqFt: number;
  exteriorSqFt: number;
  bedrooms: number;
  bathrooms: number;
  ceilingHeight: string;
  exposure: string;
  planImage: string;
  description: string;
  highlights: string[];
}

interface FloorplateExplorerProps {
  propertyName: string;
  propertySlug: string;
}

const DEFAULT_TIERS: Record<string, TierData[]> = {
  default: [
    {
      id: 'penthouse',
      name: 'The Sovereign Triplex Penthouse',
      level: 'Levels 56 – 58',
      priceFromUsd: 28500000,
      interiorSqFt: 8420,
      exteriorSqFt: 3150,
      bedrooms: 6,
      bathrooms: 7.5,
      ceilingHeight: '16 ft (4.87 m)',
      exposure: '360° Panoramic Bay, Ocean & Downtown Skyline',
      planImage: '/images/im1.jpg',
      description:
        'The apex of Miami architectural living. Occupying the uppermost three levels, featuring private rooftop cantilevered plunge pool, private internal pneumatic glass elevator, and helipad transit concierge.',
      highlights: [
        'Private 50-Foot Sky Plunge Pool & Summer Kitchen',
        'Direct Dual High-Speed Biometric Private Elevators',
        'Principal Suite with Dual Dressing Gallerias & Steam Spa',
        'Private 4-Car Climate-Controlled Sky Garage Vault',
      ],
    },
    {
      id: 'sky-villa',
      name: 'The Sky Villa Residence',
      level: 'Levels 38 – 52',
      priceFromUsd: 14800000,
      interiorSqFt: 5180,
      exteriorSqFt: 1450,
      bedrooms: 4,
      bathrooms: 4.5,
      ceilingHeight: '12 ft (3.65 m)',
      exposure: 'East-to-West Flow-Through (Sunrise & Sunset Terraces)',
      planImage: '/images/im5.webp',
      description:
        'Full flow-through architectural floorplates framing uninterrupted sunrises over Biscayne Bay and glowing sunsets over the skyline. Custom Poliform kitchens with Calacatta Borghini marble.',
      highlights: [
        'Dual Deep Terraces with 12ft Frameless Glass Balustrades',
        'Custom Boffi / Poliform Atelier Kitchen with Sub-Zero & Gaggenau',
        'Midnight Bar & Temperature-Controlled Sommelier Cellar',
        'Dedicated Staff / Nanny Quarters with Private Service Entry',
      ],
    },
    {
      id: 'tower-estate',
      name: 'The Tower Estate Residence',
      level: 'Levels 16 – 36',
      priceFromUsd: 7900000,
      interiorSqFt: 3840,
      exteriorSqFt: 860,
      bedrooms: 3,
      bathrooms: 3.5,
      ceilingHeight: '11.5 ft (3.50 m)',
      exposure: 'Direct East Bayfront & Ocean Horizon',
      planImage: '/images/im3.jpg',
      description:
        'Expansive corner sanctuaries crafted for seamless indoor-outdoor living, with direct deep-water bay views and artisan white-oak herringbone flooring throughout.',
      highlights: [
        'Expansive 35-Foot Great Room Opening to Bayfront Loggia',
        'Dornbracht Platinum Matte Fixtures & Italian Fluted Travertine',
        'Integrated Smart-Home Acoustic & Motorized Shade Automation',
        'Deeded 40ft Superyacht Marina Slip Allocation Option',
      ],
    },
  ],
};

export function FloorplateExplorer({ propertyName, propertySlug }: FloorplateExplorerProps) {
  const { formatPrice } = useCurrency();
  const tiers = DEFAULT_TIERS[propertySlug] || DEFAULT_TIERS.default;
  const [activeTierId, setActiveTierId] = useState<string>(tiers[0].id);

  const activeTier = tiers.find((t) => t.id === activeTierId) || tiers[0];

  const handleInquireOnTier = (tierName: string) => {
    const inquirySection = document.getElementById('inquire');
    if (inquirySection) {
      inquirySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-[#AEE2FF]/20 border-t border-[#9FA1FF]/30 text-[#1A1C3B]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#9FA1FF] shadow-sm">
            <Layers size={12} className="text-[#9FA1FF]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
              Architectural Blueprints
            </span>
          </div>

          <h2 className="h-display text-3xl sm:text-5xl text-[#1A1C3B] font-bold">
            Floorplates & Residence Tiers
          </h2>

          <p className="text-sm text-[#1A1C3B]/75 font-sans font-light leading-relaxed">
            Select a residence category below to review structural specifications, panoramic exposures, and private architectural plans for {propertyName}.
          </p>
        </div>

        {/* Level / Tier Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {tiers.map((tier) => {
            const isActive = activeTier.id === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setActiveTierId(tier.id)}
                className={`px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-full cursor-pointer flex items-center gap-2 shadow-sm ${
                  isActive
                    ? 'bg-[#9FA1FF] text-[#1A1C3B] shadow-md'
                    : 'bg-white text-[#1A1C3B]/70 hover:text-[#1A1C3B] border border-[#9FA1FF]/40'
                }`}
              >
                <span>{tier.level}</span>
                <span className="opacity-60">•</span>
                <span>{tier.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Interactive Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12 bg-white/90 border border-[#9FA1FF]/50 rounded-3xl shadow-md">
          {/* Left Column: Visual Architectural Rendering / Floor Plan */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#AEE2FF]/40 border border-[#9FA1FF]/40 rounded-3xl group">
              <Image
                src={activeTier.planImage}
                alt={activeTier.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C3B]/70 via-transparent to-transparent opacity-70" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/95 backdrop-blur-md border border-[#9FA1FF] text-[10px] uppercase tracking-[0.2em] text-[#1A1C3B] font-bold rounded-full shadow-sm">
                  {activeTier.level}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#AEE2FF] block font-bold">
                  Orientation & Exposure
                </span>
                <p className="text-xs text-white font-sans font-light">
                  {activeTier.exposure}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#AEE2FF]/25 border border-[#9FA1FF]/30 rounded-2xl flex items-center justify-between text-xs text-[#1A1C3B]/80">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck size={14} className="text-[#9FA1FF]" />
                <span>Custom Structural Modifications Permitted Pre-Pour</span>
              </span>
              <span className="font-mono text-[11px] text-[#9FA1FF] font-bold">Verified Floorplate</span>
            </div>
          </div>

          {/* Right Column: Key Specifications & Inquire Button */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#9FA1FF] font-bold block mb-1">
                  Residence Classification
                </span>
                <h3 className="font-serif text-3xl text-[#1A1C3B] font-bold">
                  {activeTier.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-xs uppercase tracking-wider text-[#1A1C3B]/60 font-bold">From</span>
                  <span className="font-serif text-2xl text-[#1A1C3B] font-bold" suppressHydrationWarning>
                    {formatPrice(activeTier.priceFromUsd)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#1A1C3B]/80 font-sans font-light leading-relaxed">
                {activeTier.description}
              </p>

              {/* Specs Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#9FA1FF]/25">
                <div className="p-3 bg-[#AEE2FF]/25 border border-[#9FA1FF]/30 rounded-2xl">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">Interior SF</span>
                  <span className="font-serif text-base text-[#1A1C3B] font-bold">{activeTier.interiorSqFt.toLocaleString()} sq ft</span>
                </div>

                <div className="p-3 bg-[#AEE2FF]/25 border border-[#9FA1FF]/30 rounded-2xl">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">Balcony / Loggia</span>
                  <span className="font-serif text-base text-[#1A1C3B] font-bold">{activeTier.exteriorSqFt.toLocaleString()} sq ft</span>
                </div>

                <div className="p-3 bg-[#AEE2FF]/25 border border-[#9FA1FF]/30 rounded-2xl">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">Bedrooms / Baths</span>
                  <span className="font-serif text-base text-[#1A1C3B] font-bold">{activeTier.bedrooms} Bed / {activeTier.bathrooms} Bath</span>
                </div>

                <div className="p-3 bg-[#AEE2FF]/25 border border-[#9FA1FF]/30 rounded-2xl">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">Ceiling Height</span>
                  <span className="font-serif text-base text-[#1A1C3B] font-bold">{activeTier.ceilingHeight}</span>
                </div>
              </div>

              {/* Architectural Highlights */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">
                  Signature Architectural Appointments:
                </span>
                <div className="space-y-2">
                  {activeTier.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-[#1A1C3B]/90">
                      <Check size={13} className="text-[#9FA1FF] flex-shrink-0 font-bold" />
                      <span className="font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inquire Action Button */}
            <div className="pt-6 border-t border-[#9FA1FF]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => handleInquireOnTier(activeTier.name)}
                className="w-full sm:w-auto px-8 py-4 bg-[#9FA1FF] hover:bg-[#B5BAFF] text-[#1A1C3B] border border-[#9FA1FF] text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer rounded-full"
              >
                <span>Inquire for {activeTier.name}</span>
                <ArrowRight size={14} />
              </button>

              <span className="text-[11px] text-[#1A1C3B]/70 font-sans">
                Confidential non-disclosure allocation protocol
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
