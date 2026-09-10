'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Diamond, Compass, ZoomIn, ZoomOut, RotateCcw, Info, Check, Eye } from 'lucide-react';

interface Hotspot {
  id: string;
  xPercent: number; // 0 to 100% horizontally
  yPercent: number; // 0 to 100% vertically
  title: string;
  description: string;
  spec: string;
}

interface PanoramaScene {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  hotspots: Hotspot[];
}

const SCENES: PanoramaScene[] = [
  {
    id: 'salon',
    name: 'Grand Living Salon & Volume',
    subtitle: 'Double-Height 22ft Glass Loggia',
    image: '/images/im3.jpg',
    hotspots: [
      {
        id: 'h1',
        xPercent: 32,
        yPercent: 55,
        title: 'Calacatta Paonazzo Monolith',
        description: 'Single-quarry Tuscan bookmatched marble island with integrated concealed Gaggenau induction atelier.',
        spec: 'Quarried Carrara, Italy • Sub-Zero Integrated Suite',
      },
      {
        id: 'h2',
        xPercent: 68,
        yPercent: 40,
        title: 'Vanishing Corner Glazing',
        description: 'Engineered hurricane-resistant structural glass corners with motorized vanishing slider systems.',
        spec: '22ft Continuous Height • 99% UV Marine Tint',
      },
      {
        id: 'h3',
        xPercent: 82,
        yPercent: 65,
        title: 'Bespoke Travertine Float',
        description: 'Navona cross-cut travertine flooring treated with acoustic isolation and micro-beveled seams.',
        spec: 'Acoustic Sound Insulation Rating IIC 72',
      },
    ],
  },
  {
    id: 'terrace',
    name: 'Cantilevered Sky Terrace & Pool',
    subtitle: 'Suspended Over Biscayne Bay',
    image: '/images/im13.jpg',
    hotspots: [
      {
        id: 'h4',
        xPercent: 48,
        yPercent: 62,
        title: 'Cantilevered Glass Infinity Edge',
        description: 'Hydrotherapy-jetted private sky pool with structural acrylic base suspended 500 feet in the air.',
        spec: 'Heated Ozone Filtration • Saltwater System',
      },
      {
        id: 'h5',
        xPercent: 22,
        yPercent: 38,
        title: 'Biscayne Bay Sunset Horizon',
        description: 'Unrestricted 270-degree western sunset exposures over Coconut Grove, Key Biscayne, and the open Atlantic.',
        spec: 'Permanent Maritime Navigational Easement',
      },
    ],
  },
  {
    id: 'master',
    name: 'Master Sanctuary & Dressing Suite',
    subtitle: 'Poliform Atelier & Bayfront Vista',
    image: '/images/im6.webp',
    hotspots: [
      {
        id: 'h6',
        xPercent: 40,
        yPercent: 50,
        title: 'Poliform Walk-in Dressing Suite',
        description: 'Bespoke Italian smoked glass cabinetry with biometric safe and integrated cashmere climate drawers.',
        spec: 'Poliform Milan Custom Commission',
      },
      {
        id: 'h7',
        xPercent: 70,
        yPercent: 45,
        title: 'Sunrise Atlantic Exposure',
        description: 'Wake up to panoramic dawn sunrises over the Atlantic Ocean barrier islands.',
        spec: 'Motorized Blackout & Sheer Lutron Drapes',
      },
    ],
  },
];

export function PanoramaViewer360({ propertyName = 'The Marquis Brickell' }: { propertyName?: string }) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [offsetPercent, setOffsetPercent] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentOffsetRef = useRef(0);

  const scene = SCENES[activeSceneIndex];

  // Mouse & Touch Drag Handlers for 360 Panning
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentOffsetRef.current = offsetPercent;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    // Map pixels to offset percentage
    const sensitivity = 0.12;
    const newOffset = currentOffsetRef.current - deltaX * sensitivity;
    setOffsetPercent(newOffset);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-20 px-6 md:px-12 bg-[#D9F9DF] border-t border-[#9FA1FF]/30 text-[#1A1C3B] select-none">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header and Scene Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#9FA1FF]/30 pb-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#9FA1FF] shadow-sm">
              <Compass size={12} className="text-[#9FA1FF] animate-spin-slow" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
                Interactive 360° Great Room Exploration
              </span>
            </div>
            <h2 className="h-display text-3xl sm:text-5xl text-[#1A1C3B] font-bold">
              Architectural Spatial Explorer
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1C3B]/75 font-sans font-light leading-relaxed">
              Drag horizontally to pan through {propertyName}&apos;s grand living volume, cantilevered pool loggias, and master suite.
            </p>
          </div>

          {/* Viewpoint Selector Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-[#AEE2FF]/30 border border-[#9FA1FF]/40 rounded-2xl">
            {SCENES.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveSceneIndex(idx);
                  setActiveHotspot(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  activeSceneIndex === idx
                    ? 'bg-[#9FA1FF] text-[#1A1C3B] shadow-md'
                    : 'text-[#1A1C3B]/70 hover:text-[#1A1C3B] hover:bg-white/40'
                }`}
              >
                {sc.name.split(' ')[0]} {sc.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* 360 Interactive Panorama Canvas */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-[#AEE2FF]/30 border border-[#9FA1FF] shadow-xl ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Panoramic Image Layer with Horizontal Pan Translation */}
          <div
            className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform"
            style={{
              transform: `scale(${zoomLevel}) translateX(${((offsetPercent % 100) + 100) % 100 - 50}px)`,
            }}
          >
            <Image
              src={scene.image}
              alt={scene.name}
              fill
              className="object-cover object-center pointer-events-none scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C3B]/60 via-transparent to-[#1A1C3B]/30 pointer-events-none" />
          </div>

          {/* Interactive Architectural Hotspot Pins */}
          {scene.hotspots.map((hotspot) => {
            const isSelected = activeHotspot?.id === hotspot.id;
            return (
              <div
                key={hotspot.id}
                style={{
                  left: `${hotspot.xPercent}%`,
                  top: `${hotspot.yPercent}%`,
                }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(isSelected ? null : hotspot);
                  }}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#9FA1FF] text-[#1A1C3B] border-white scale-125 shadow-xl font-bold'
                      : 'bg-white/95 text-[#1A1C3B] border-[#9FA1FF] hover:scale-110 shadow-lg'
                  }`}
                  title={hotspot.title}
                >
                  <Diamond size={12} className="animate-pulse text-[#9FA1FF]" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9FA1FF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9FA1FF]" />
                  </span>
                </button>
              </div>
            );
          })}

          {/* Active Hotspot Info Overlay Card */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md z-30 p-6 bg-white/95 backdrop-blur-2xl border border-[#9FA1FF] rounded-3xl shadow-2xl space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#9FA1FF] font-bold">
                    Architectural Specification
                  </span>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-[#1A1C3B]/70 hover:text-[#1A1C3B] text-xs cursor-pointer font-bold"
                  >
                    Dismiss
                  </button>
                </div>
                <h4 className="font-serif text-lg text-[#1A1C3B] font-bold">
                  {activeHotspot.title}
                </h4>
                <p className="text-xs text-[#1A1C3B]/80 font-sans font-light leading-relaxed">
                  {activeHotspot.description}
                </p>
                <div className="pt-2 border-t border-[#9FA1FF]/25 flex items-center gap-2 text-[10px] font-mono text-[#9FA1FF] font-bold">
                  <Check size={12} className="text-[#9FA1FF]" />
                  <span>{activeHotspot.spec}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Compass & View Controls */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <div className="px-3.5 py-1.5 bg-white/90 backdrop-blur-md border border-[#9FA1FF] rounded-full text-xs text-[#1A1C3B] flex items-center gap-2 shadow-md">
              <Compass size={14} className="text-[#9FA1FF]" />
              <span className="font-serif font-bold">{scene.name}</span>
            </div>
          </div>

          {/* Top Right Zoom Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md border border-[#9FA1FF] rounded-xl shadow-md">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((z) => Math.min(z + 0.15, 1.4));
              }}
              className="p-1.5 text-[#1A1C3B] hover:text-black rounded-lg hover:bg-[#AEE2FF]/40 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((z) => Math.max(z - 0.15, 0.9));
              }}
              className="p-1.5 text-[#1A1C3B] hover:text-black rounded-lg hover:bg-[#AEE2FF]/40 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel(1);
                setOffsetPercent(0);
              }}
              className="p-1.5 text-[#1A1C3B] hover:text-black rounded-lg hover:bg-[#AEE2FF]/40 cursor-pointer"
              title="Reset View"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Bottom Drag Guidance Cue */}
          <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-md border border-[#9FA1FF]/40 rounded-full text-[10px] uppercase tracking-wider text-[#1A1C3B] font-mono shadow-sm font-bold">
            <Eye size={12} className="text-[#9FA1FF]" />
            <span>Drag horizontally • Click pins for specs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
