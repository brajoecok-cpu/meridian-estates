import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAmenities } from '@/lib/cms';
import { Diamond, CheckCircle2, ArrowRight } from 'lucide-react';
import { VideoBackground } from '@/components/video/VideoBackground';

export const metadata = {
  title: 'Signature Amenities & Services — Kings Real Estate',
  description: 'Explore the bespoke private marinas, cantilevered sky pools, wellness spas, and sommelier vaults across Kings residences.',
};

export default async function AmenitiesPage() {
  const amenities = await getAmenities();

  return (
    <div className="min-h-screen bg-[#D9F9DF] text-[#1A1C3B] pb-24">
      {/* CINEMATIC VIDEO HERO */}
      <div className="relative h-[65vh] min-h-[480px] w-full mb-16 overflow-hidden">
        <VideoBackground
          srcMp4="/videos/amenity-tour.mp4"
          poster="/images/im5.webp"
          eager={true}
          overlayOpacity={0.45}
          className="h-full w-full"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-[#9FA1FF] backdrop-blur-md w-fit shadow-sm">
              <Diamond size={11} className="text-[#9FA1FF]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
                White-Glove Sovereignty
              </span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl md:text-7xl text-white font-bold drop-shadow-md">
              Signature <br />
              <span className="italic bg-gradient-to-r from-[#AEE2FF] via-[#B5BAFF] to-[#9FA1FF] bg-clip-text text-transparent font-normal">Amenities</span>
            </h1>

            <p className="text-sm md:text-base text-white/95 font-sans font-light leading-relaxed max-w-2xl drop-shadow-sm">
              From private deep-water superyacht slips to 50th-floor cantilevered infinity plunge pools, every amenity is an architectural centerpiece designed for effortless relaxation and discrete entertaining.
            </p>
          </div>
        </VideoBackground>
      </div>

      {/* Amenities Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        {amenities.map((amenity, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <div
              key={amenity.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12 bg-white/85 border border-[#9FA1FF]/40 items-center rounded-3xl shadow-sm hover:shadow-md transition-shadow ${
                isReversed ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div
                className={`lg:col-span-6 relative aspect-[16/10] w-full overflow-hidden bg-[#AEE2FF]/40 rounded-3xl ${
                  isReversed ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <Image
                  src={amenity.poster}
                  alt={amenity.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div
                className={`lg:col-span-6 space-y-6 ${
                  isReversed ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#9FA1FF] font-bold">
                    {amenity.category}
                  </span>
                  <h2 className="h-display text-3xl sm:text-4xl text-[#1A1C3B] font-bold">
                    {amenity.title}
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-[#9FA1FF] font-bold italic">
                    &ldquo;{amenity.tagline}&rdquo;
                  </p>
                </div>

                <p className="text-sm text-[#1A1C3B]/80 font-sans font-light leading-relaxed">
                  {amenity.description}
                </p>

                <div className="pt-4 border-t border-[#9FA1FF]/25 flex items-center justify-between">
                  <span className="text-xs text-[#1A1C3B]/65 font-medium">
                    Exclusive to residents and invited guests
                  </span>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#9FA1FF] hover:text-[#1A1C3B] font-bold transition-colors"
                  >
                    <span>Inquire</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
