'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Diamond, Maximize2, X } from 'lucide-react';
import { VideoBackground } from '@/components/video/VideoBackground';
import { GalleryItem } from '@/lib/types';

const INITIAL_ITEMS: GalleryItem[] = [
  { id: '1', image: '/images/im1.jpg', title: 'The Marquis Skyline Tower', category: 'Architecture' },
  { id: '2', image: '/images/im3.jpg', title: 'Grand Living Volume & Travertine Walls', category: 'Interiors' },
  { id: '3', image: '/images/im5.webp', title: 'Poliform & Calacatta Culinary Atelier', category: 'Interiors' },
  { id: '4', image: '/images/im13.jpg', title: 'Cantilevered Sky Pool & Biscayne Sunset', category: 'Amenities' },
  { id: '5', image: '/images/im6.webp', title: 'Master Sanctuary & Atlantic Sunrise Suite', category: 'Interiors' },
  { id: '6', image: '/images/im2.jpg', title: 'Aura Biscayne Waterfront Facade', category: 'Architecture' },
  { id: '7', image: '/images/im10.jpg', title: 'Edgewater Bayfront Glass Loggia', category: 'Architecture' },
  { id: '8', image: '/images/im12.jpg', title: 'Superyacht Private Marina Slip', category: 'Amenities' },
  { id: '9', image: '/images/im15.webp', title: 'The Palma Botanical Residence', category: 'Architecture' },
  { id: '10', image: '/images/im16.jpg', title: 'Art Collector Atrium & Gallery Hall', category: 'Interiors' },
  { id: '11', image: '/images/im17.jpg', title: 'Lush Banyan Courtyard & Water Basin', category: 'Landscape' },
  { id: '12', image: '/images/im18.jpg', title: 'Vela Star Island Compound Estate', category: 'Architecture' },
  { id: '13', image: '/images/im11.jpg', title: 'Vanishing Glass Corner Great Room', category: 'Interiors' },
  { id: '14', image: '/images/im8.jpg', title: 'Thermal Spa & Hydrotherapy Suite', category: 'Amenities' },
  { id: '15', image: '/images/im7.jpeg', title: 'Private Sommelier Wine Tasting Cellar', category: 'Amenities' },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_ITEMS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeModalImg, setActiveModalImg] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch('/api/admin/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (data?.items && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category || 'Architecture')))];

  const filteredItems = activeFilter === 'All'
    ? items
    : items.filter((item) => item.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#D9F9DF] text-[#1A1C3B] pb-24">
      {/* CINEMATIC VIDEO HERO */}
      <div className="relative h-[65vh] min-h-[480px] w-full mb-16 overflow-hidden">
        <VideoBackground
          srcMp4="/videos/ocean-view.mp4"
          poster="/images/im3.jpg"
          eager={true}
          overlayOpacity={0.45}
          className="h-full w-full"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-[#9FA1FF] backdrop-blur-md w-fit shadow-sm">
              <Diamond size={11} className="text-[#9FA1FF]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
                Visual Archives
              </span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl md:text-7xl text-white font-bold drop-shadow-md">
              Architectural <br />
              <span className="italic bg-gradient-to-r from-[#AEE2FF] via-[#B5BAFF] to-[#9FA1FF] bg-clip-text text-transparent font-normal">Gallery</span>
            </h1>

            <p className="text-sm md:text-base text-white/95 font-sans font-light leading-relaxed max-w-2xl drop-shadow-sm">
              A curated photographic exhibition highlighting monumental structural lines, bespoke Italian joinery, and private maritime sanctuaries.
            </p>
          </div>
        </VideoBackground>
      </div>

      {/* Header Controls */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-full cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#9FA1FF] text-[#1A1C3B] shadow-md'
                  : 'bg-white text-[#1A1C3B]/70 hover:text-[#1A1C3B] border border-[#9FA1FF]/40'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry / Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalImg(item)}
              className="group relative overflow-hidden bg-white/85 border border-[#9FA1FF]/40 hover:border-[#9FA1FF] transition-all duration-500 cursor-pointer rounded-3xl shadow-sm hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#AEE2FF]/40">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C3B]/70 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                {/* Corner Expand Icon */}
                <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-[#1A1C3B] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <Maximize2 size={14} />
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#AEE2FF] font-bold block">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-base text-white group-hover:text-[#AEE2FF] transition-colors leading-snug font-bold">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalImg && (
        <div
          onClick={() => setActiveModalImg(null)}
          className="fixed inset-0 z-50 bg-[#1A1C3B]/70 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 cursor-pointer"
        >
          <button
            onClick={() => setActiveModalImg(null)}
            className="absolute top-6 right-6 p-3 bg-white border border-[#9FA1FF] text-[#1A1C3B] rounded-full hover:bg-[#9FA1FF] transition-colors cursor-pointer z-10 shadow-lg"
          >
            <X size={20} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[85vh] aspect-[16/10] bg-white border border-[#9FA1FF] overflow-hidden cursor-default shadow-2xl rounded-3xl"
          >
            <Image
              src={activeModalImg.image}
              alt={activeModalImg.title}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1A1C3B]/90 via-[#1A1C3B]/50 to-transparent flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#AEE2FF] block font-bold">
                  {activeModalImg.category}
                </span>
                <h4 className="font-serif text-xl text-white font-bold">
                  {activeModalImg.title}
                </h4>
                {activeModalImg.caption && (
                  <p className="text-xs text-white/85 font-light max-w-xl mt-1">
                    {activeModalImg.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
