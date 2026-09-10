'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { PropertyCard } from '@/components/property/PropertyCard';
import propertiesData from '@/content/properties.json';
import { Property } from '@/lib/types';
import { SlidersHorizontal, Diamond, Building } from 'lucide-react';

export default function DevelopmentsPage() {
  const allProperties: Property[] = propertiesData.properties as Property[];

  // Filter states
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedUnitType, setSelectedUnitType] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

  const filteredProperties = useMemo(() => {
    return allProperties.filter((p) => {
      // Filter by neighborhood
      if (selectedNeighborhood !== 'all' && p.neighborhoodSlug !== selectedNeighborhood) {
        return false;
      }

      // Filter by price
      if (selectedPriceRange === 'under-7m' && p.priceFrom >= 7000000) return false;
      if (selectedPriceRange === '7m-12m' && (p.priceFrom < 7000000 || p.priceFrom > 12000000)) return false;
      if (selectedPriceRange === 'over-12m' && p.priceFrom <= 12000000) return false;

      return true;
    });
  }, [selectedNeighborhood, selectedUnitType, selectedPriceRange]);

  return (
    <div className="min-h-screen bg-[#D9F9DF] text-[#1A1C3B] pb-24">
      {/* STATIC IMAGE HERO BANNER */}
      <div className="relative h-[65vh] min-h-[480px] w-full mb-16 overflow-hidden">
        <Image
          src="/images/im1.jpg"
          alt="Development Portfolio"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1A1C3B]/45 pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-[#9FA1FF] backdrop-blur-md w-fit shadow-sm">
            <Diamond size={11} className="text-[#9FA1FF]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
              Current Development Portfolio
            </span>
          </div>

          <h1 className="h-display text-4xl sm:text-6xl md:text-7xl text-white font-bold drop-shadow-md">
            The Landmark <br />
            <span className="italic bg-gradient-to-r from-[#AEE2FF] via-[#B5BAFF] to-[#9FA1FF] bg-clip-text text-transparent font-normal">Residences</span>
          </h1>

          <p className="text-sm md:text-base text-white/95 font-sans font-light leading-relaxed max-w-2xl drop-shadow-sm">
            Explore our limited edition architectural offerings across South Florida. Each development is crafted with custom structural volumes, private deep-water access, and bespoke European appointments.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        {/* Filter Controls Bar */}
        <div className="p-6 bg-[#AEE2FF]/30 backdrop-blur-md border border-[#9FA1FF]/40 flex flex-wrap items-center justify-between gap-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#1A1C3B] font-bold">
            <SlidersHorizontal size={14} className="text-[#9FA1FF]" />
            <span>Refine Portfolio ({filteredProperties.length})</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Neighborhood Filter */}
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-[#1A1C3B]/70 uppercase tracking-wider font-bold">
                Location:
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="px-3.5 py-2 bg-white border border-[#9FA1FF] text-[#1A1C3B] text-xs focus:border-[#9FA1FF] focus:outline-none rounded-xl font-medium"
              >
                <option value="all">All Locations</option>
                <option value="brickell">Brickell</option>
                <option value="edgewater">Edgewater</option>
                <option value="coconut-grove">Coconut Grove</option>
                <option value="miami-beach">Miami Beach / Star Island</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-[#1A1C3B]/70 uppercase tracking-wider font-bold">
                Price:
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="px-3.5 py-2 bg-white border border-[#9FA1FF] text-[#1A1C3B] text-xs focus:border-[#9FA1FF] focus:outline-none rounded-xl font-medium"
              >
                <option value="all">All Price Tiers</option>
                <option value="under-7m">Under $7M</option>
                <option value="7m-12m">$7M – $12M</option>
                <option value="over-12m">$12M+ (Trophy Estates)</option>
              </select>
            </div>

            {/* Reset */}
            {(selectedNeighborhood !== 'all' || selectedPriceRange !== 'all') && (
              <button
                onClick={() => {
                  setSelectedNeighborhood('all');
                  setSelectedPriceRange('all');
                }}
                className="text-xs text-[#9FA1FF] hover:text-[#1A1C3B] font-bold underline underline-offset-4 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4 bg-white/70 rounded-3xl border border-[#9FA1FF]/40">
            <Building size={36} className="mx-auto text-[#9FA1FF]" />
            <h3 className="font-serif text-2xl text-[#1A1C3B] font-bold">No residences match your current criteria</h3>
            <p className="text-xs text-[#1A1C3B]/70 max-w-md mx-auto">
              Please adjust your search parameters or speak directly with our private acquisition concierge.
            </p>
            <button
              onClick={() => {
                setSelectedNeighborhood('all');
                setSelectedPriceRange('all');
              }}
              className="mt-4 px-6 py-2.5 bg-[#9FA1FF] hover:bg-[#B5BAFF] text-[#1A1C3B] border border-[#9FA1FF] text-xs uppercase tracking-wider font-bold rounded-full cursor-pointer shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
