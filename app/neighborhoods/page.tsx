import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getNeighborhoods, getProperties } from '@/lib/cms';
import { Diamond, MapPin, ArrowRight, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { VideoBackground } from '@/components/video/VideoBackground';

export const metadata = {
  title: 'Miami Neighborhoods & Enclaves — Kings Real Estate',
  description: 'Explore the coveted luxury districts of Brickell, Edgewater, Coconut Grove, and Star Island.',
};

export default async function NeighborhoodsPage() {
  const neighborhoods = await getNeighborhoods();
  const properties = await getProperties();

  return (
    <div className="min-h-screen bg-[#D9F9DF] text-[#1A1C3B] pb-24">
      {/* CINEMATIC VIDEO HERO */}
      <div className="relative h-[65vh] min-h-[480px] w-full mb-16 overflow-hidden">
        <VideoBackground
          srcMp4="/videos/neighborhoods-aerial.mp4"
          poster="/images/im6.jpg"
          eager={true}
          overlayOpacity={0.45}
          className="h-full w-full"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-[#9FA1FF] backdrop-blur-md w-fit shadow-sm">
              <Diamond size={11} className="text-[#9FA1FF]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
                Geographic Curations
              </span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl md:text-7xl text-white font-bold drop-shadow-md">
              Miami’s Prime <br />
              <span className="italic bg-gradient-to-r from-[#AEE2FF] via-[#B5BAFF] to-[#9FA1FF] bg-clip-text text-transparent font-normal">Enclaves</span>
            </h1>

            <p className="text-sm md:text-base text-white/95 font-sans font-light leading-relaxed max-w-2xl drop-shadow-sm">
              Every neighborhood in our portfolio offers a distinct cadence of living — from soaring financial aeries with 360-degree ocean views to secluded tropical island sanctuaries.
            </p>
          </div>
        </VideoBackground>
      </div>

      {/* Neighborhood Showcase List */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        {neighborhoods.map((neighborhood, index) => {
          const matchingProperties = properties.filter((p) =>
            neighborhood.propertySlugs.includes(p.slug)
          );

          return (
            <div
              key={neighborhood.slug}
              id={neighborhood.slug}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12 bg-white/85 border border-[#9FA1FF]/40 hover:border-[#9FA1FF] transition-colors rounded-3xl shadow-sm hover:shadow-md"
            >
              {/* Media Aspect */}
              <div className="lg:col-span-6 relative aspect-[16/11] w-full overflow-hidden bg-[#AEE2FF]/40 rounded-3xl">
                <Image
                  src={neighborhood.heroPoster}
                  alt={neighborhood.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Information Column */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#9FA1FF]" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#9FA1FF] font-bold">
                      District {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                  </div>

                  <h2 className="h-display text-3xl sm:text-4xl text-[#1A1C3B] font-bold">
                    {neighborhood.name}
                  </h2>

                  <p className="text-xs uppercase tracking-widest text-[#9FA1FF] font-bold">
                    {neighborhood.tagline}
                  </p>

                  <p className="text-sm text-[#1A1C3B]/80 font-sans font-light leading-relaxed">
                    {neighborhood.description}
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">
                      Enclave Hallmarks:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1A1C3B]">
                      {neighborhood.keyFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check size={12} className="text-[#9FA1FF] flex-shrink-0 font-bold" />
                          <span className="font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Matching Developments in this Neighborhood */}
                {matchingProperties.length > 0 && (
                  <div className="pt-6 border-t border-[#9FA1FF]/25">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block mb-3">
                      Kings Developments in {neighborhood.name}:
                    </span>
                    <div className="flex flex-wrap gap-4">
                      {matchingProperties.map((prop) => (
                        <Link
                          key={prop.slug}
                          href={`/developments/${prop.slug}`}
                          className="inline-flex items-center justify-between gap-4 px-4 py-2.5 bg-[#AEE2FF]/40 hover:bg-[#9FA1FF] border border-[#9FA1FF]/50 text-xs text-[#1A1C3B] group transition-colors rounded-full shadow-sm"
                        >
                          <span className="font-serif text-sm font-bold">{prop.name}</span>
                          <span className="font-bold text-[#1A1C3B]">{formatPrice(prop.priceFrom)}</span>
                          <ArrowRight size={13} className="text-[#9FA1FF] group-hover:text-[#1A1C3B] group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
