'use client';

import React, { useState } from 'react';
import { Plane, Compass, Navigation, Clock, Shield, MapPin, Diamond } from 'lucide-react';

interface TransitDestination {
  name: string;
  category: 'Aviation' | 'Maritime' | 'Executive & Dining';
  travelTimeHeli?: string;
  travelTimeBoat?: string;
  travelTimeCar?: string;
  distance: string;
  notes: string;
}

const DESTINATIONS: TransitDestination[] = [
  {
    name: 'Opa-locka Executive Jet Center (OPF)',
    category: 'Aviation',
    travelTimeHeli: '9 min',
    travelTimeCar: '24 min',
    distance: '14.2 miles',
    notes: 'Private FBO handling Gulfstream G650 / Bombardier Global 7500 private charters.',
  },
  {
    name: 'Miami International Airport (MIA)',
    category: 'Aviation',
    travelTimeHeli: '6 min',
    travelTimeCar: '16 min',
    distance: '8.5 miles',
    notes: 'Direct VIP private lounge transfer via luxury chauffeur.',
  },
  {
    name: 'Government Cut & Atlantic Deep-Water Ocean Access',
    category: 'Maritime',
    travelTimeBoat: '8 min',
    distance: '2.1 NM',
    notes: 'Direct deep-water channel without fixed bridge restrictions for 150ft+ superyachts.',
  },
  {
    name: 'Star Island Private Heliport & Tender Basin',
    category: 'Maritime',
    travelTimeBoat: '5 min',
    travelTimeHeli: '3 min',
    travelTimeCar: '12 min',
    distance: '3.4 miles',
    notes: 'Private resident water taxi and helicopter touch-and-go access.',
  },
  {
    name: 'Casa Tua & Miami Beach Private Club District',
    category: 'Executive & Dining',
    travelTimeBoat: '12 min',
    travelTimeCar: '15 min',
    distance: '6.1 miles',
    notes: 'Valet water-tender dockage available at Sunset Harbour and Biscayne Bay.',
  },
  {
    name: 'Miami Design District & Faena Arts Center',
    category: 'Executive & Dining',
    travelTimeBoat: '10 min',
    travelTimeCar: '14 min',
    distance: '5.8 miles',
    notes: 'World-class haute horlogerie, private art pavilions, and Michelin-starred dining.',
  },
];

export function TransitMatrix({ propertyName = 'Kings Residences' }: { propertyName?: string }) {
  const [activeTab, setActiveTab] = useState<'All' | 'Aviation' | 'Maritime' | 'Executive & Dining'>('All');

  const filtered = activeTab === 'All'
    ? DESTINATIONS
    : DESTINATIONS.filter((d) => d.category === activeTab);

  return (
    <section className="py-20 px-6 md:px-12 bg-[#16191E] border-t border-[#F7F5F0]/10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1C2027] border border-[#9E7B3B]/40">
            <Compass size={12} className="text-[#D8B26E]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D8B26E]">
              Multimodal Transit Sovereignty
            </span>
          </div>

          <h2 className="h-display text-3xl sm:text-4xl text-[#F7F5F0]">
            Aviation, Maritime & Executive Access
          </h2>

          <p className="text-sm text-[#9AA0A9] font-sans font-light leading-relaxed">
            Positioned along Miami’s primary navigational waterways with dedicated on-site helipad connections and private deep-water slips.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {['All', 'Aviation', 'Maritime', 'Executive & Dining'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 rounded-sm cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#9E7B3B] text-[#16191E] font-semibold shadow-md'
                  : 'bg-[#1C2027] text-[#9AA0A9] hover:text-[#F7F5F0] border border-[#F7F5F0]/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#1C2027]/90 border border-[#F7F5F0]/10 hover:border-[#9E7B3B]/50 transition-all duration-300 space-y-4 rounded-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#9E7B3B] font-semibold">
                    {dest.category}
                  </span>
                  <span className="text-[11px] font-mono text-[#9AA0A9]">{dest.distance}</span>
                </div>

                <h3 className="font-serif text-lg text-[#F7F5F0] leading-snug">
                  {dest.name}
                </h3>

                <p className="text-xs text-[#9AA0A9] leading-relaxed font-sans font-light">
                  {dest.notes}
                </p>
              </div>

              {/* Transit Times Row */}
              <div className="pt-4 border-t border-[#F7F5F0]/10 grid grid-cols-3 gap-2 text-center text-xs">
                {dest.travelTimeHeli && (
                  <div className="p-2 bg-[#16191E] border border-[#F7F5F0]/5">
                    <span className="text-[8px] uppercase tracking-wider text-[#9AA0A9] block">🚁 Heli</span>
                    <span className="font-serif text-[#D8B26E] text-sm font-medium">{dest.travelTimeHeli}</span>
                  </div>
                )}

                {dest.travelTimeBoat && (
                  <div className="p-2 bg-[#16191E] border border-[#F7F5F0]/5">
                    <span className="text-[8px] uppercase tracking-wider text-[#9AA0A9] block">🛥️ Tender</span>
                    <span className="font-serif text-[#D8B26E] text-sm font-medium">{dest.travelTimeBoat}</span>
                  </div>
                )}

                {dest.travelTimeCar && (
                  <div className="p-2 bg-[#16191E] border border-[#F7F5F0]/5">
                    <span className="text-[8px] uppercase tracking-wider text-[#9AA0A9] block">🏎️ Car</span>
                    <span className="font-serif text-[#F7F5F0] text-sm font-medium">{dest.travelTimeCar}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
