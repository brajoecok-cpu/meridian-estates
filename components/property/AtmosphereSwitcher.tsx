'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Sunset, Moon, Diamond, Eye } from 'lucide-react';

interface AtmosphereOption {
  id: 'day' | 'golden' | 'night';
  label: string;
  sublabel: string;
  icon: typeof Sun;
  color: string;
  image: string;
  ambientDescription: string;
  lightingSpec: string;
  solarAngle: string;
}

const ATMOSPHERE_MODES: AtmosphereOption[] = [
  {
    id: 'day',
    label: 'High Noon Brilliance',
    sublabel: 'Natural Atlantic Sunlight',
    icon: Sun,
    color: '#F4DE9C',
    image: '/images/im3.jpg',
    ambientDescription: 'Floor-to-ceiling glass floods the double-height travertine salon with crisp, natural marine light.',
    lightingSpec: '5,500K True Daylight Spectrum • 98 CRI Ultra-Clarity Glass',
    solarAngle: 'Solar Noon 68° Elevation',
  },
  {
    id: 'golden',
    label: 'Golden Hour & Sunset',
    sublabel: 'Biscayne Sunset Illumination',
    icon: Sunset,
    color: '#E89C57',
    image: '/images/im13.jpg',
    ambientDescription: 'Rich amber and copper reflections wash across the cantilevered infinity pool and vanishing loggia corners.',
    lightingSpec: '2,700K Warm Architectural Cove LED & Sunset Glow',
    solarAngle: 'Sunset Horizon 12° Azimuth',
  },
  {
    id: 'night',
    label: 'Midnight Skyline Luminescence',
    sublabel: 'Nocturnal Harbor Reflection',
    icon: Moon,
    color: '#89A9D8',
    image: '/images/im1.jpg',
    ambientDescription: 'Curated Lutron architectural dimming showcases the illuminated Miami skyline against deep Biscayne waters.',
    lightingSpec: '2,200K Intimate Candlelight Dimming • Perimeter Accent Linear Light',
    solarAngle: 'Nocturnal Sky Exposure',
  },
];

export function AtmosphereSwitcher({ propertyName = 'The Penthouse Sanctuary' }: { propertyName?: string }) {
  const [activeMode, setActiveMode] = useState<'day' | 'golden' | 'night'>('golden');
  const current = ATMOSPHERE_MODES.find((m) => m.id === activeMode) || ATMOSPHERE_MODES[1];

  return (
    <section className="py-20 px-6 md:px-12 bg-[#D9F9DF] border-t border-[#9FA1FF]/30 text-[#1A1C3B] overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header with Switcher Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#9FA1FF]/30 pb-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#9FA1FF] backdrop-blur-md shadow-sm">
              <Diamond size={11} className="text-[#9FA1FF]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
                Lighting & Diurnal Ambiance
              </span>
            </div>
            <h2 className="h-display text-3xl sm:text-5xl text-[#1A1C3B] font-bold">
              The 24-Hour Horizon
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1C3B]/75 font-sans font-light leading-relaxed">
              Experience how natural sunlight, golden hour sunset, and nocturnal skyline illumination transform {propertyName}.
            </p>
          </div>

          {/* Mode Selector Segmented Controls */}
          <div className="p-1.5 bg-[#AEE2FF]/40 border border-[#9FA1FF]/50 rounded-2xl flex items-center gap-1.5 shadow-sm">
            {ATMOSPHERE_MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#9FA1FF] text-[#1A1C3B] shadow-sm scale-[1.02]'
                      : 'text-[#1A1C3B]/70 hover:text-[#1A1C3B] hover:bg-white/40'
                  }`}
                >
                  <Icon size={14} style={{ color: isActive ? '#1A1C3B' : mode.color }} />
                  <span>{mode.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Visual Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Framed Image Transition Viewport */}
          <div className="lg:col-span-8 relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-black border border-[#9FA1FF]/40 shadow-xl group">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image}
                  alt={current.label}
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C3B]/60 via-transparent to-black/20 opacity-60" />
              </motion.div>
            </AnimatePresence>

            {/* Floating Top Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/95 backdrop-blur-md border border-[#9FA1FF] rounded-full text-xs text-[#1A1C3B] shadow-sm">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: current.color }} />
                <span className="font-serif font-bold">{current.label}</span>
              </div>
            </div>

            {/* Bottom Floating Stats Pill */}
            <div className="absolute bottom-4 left-4 right-4 z-10 p-4 bg-white/90 backdrop-blur-md border border-[#9FA1FF]/40 rounded-2xl flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-2 text-[#1A1C3B] font-semibold">
                <Eye size={14} className="text-[#9FA1FF]" />
                <span className="font-mono text-[11px]">{current.solarAngle}</span>
              </div>
              <span className="text-[10px] text-[#1A1C3B]/70 uppercase tracking-wider font-mono font-bold">
                Lutron Smart Horizon Lighting
              </span>
            </div>
          </div>

          {/* Right Specification Dossier */}
          <div className="lg:col-span-4 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-8 bg-white/80 backdrop-blur-md border border-[#9FA1FF]/40 rounded-3xl space-y-6 shadow-sm"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#9FA1FF] font-bold block">
                    {current.sublabel}
                  </span>
                  <h3 className="font-serif text-2xl text-[#1A1C3B] font-bold">
                    {current.label}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#1A1C3B]/80 font-sans font-light leading-relaxed">
                  {current.ambientDescription}
                </p>

                <div className="pt-4 border-t border-[#9FA1FF]/25 space-y-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#1A1C3B]/60 font-bold block">
                      Architectural Lighting Specification
                    </span>
                    <span className="text-xs text-[#1A1C3B] font-mono mt-0.5 block font-bold">
                      {current.lightingSpec}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#1A1C3B]/60 font-bold block">
                      Glazing & Thermal Exposure
                    </span>
                    <span className="text-xs text-[#1A1C3B] font-mono mt-0.5 block font-bold">
                      Low-E Acoustic Hurricane Laminate (Miami-Dade Certified)
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
