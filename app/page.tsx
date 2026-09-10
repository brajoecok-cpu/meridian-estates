import Link from 'next/link';
import { VideoSection } from '@/components/video/VideoSection';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { TestimonialsSection } from '@/components/property/TestimonialsSection';
import { PressSection } from '@/components/property/PressSection';
import { getProperties, getNeighborhoods, getSiteSettings } from '@/lib/cms';
import { ArrowRight, Compass, ShieldCheck, Diamond, Building2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default async function HomePage() {
  const properties = await getProperties();
  const neighborhoods = await getNeighborhoods();
  const siteSettings = await getSiteSettings();
  const flagship = properties[0]; // The Marquis Brickell

  const hero = siteSettings?.hero || {
    badge: 'Miami’s New Architectural Era',
    titleLine1: 'Transcendental',
    titleLine2: 'Living',
    subtitle: 'An unprecedented portfolio of waterfront estates and sky sanctuaries, sculpted along Miami’s most coveted coastlines.',
    videoMp4: '/videos/hero-waterfront.mp4',
    poster: '/images/im14.jpg',
    primaryCtaText: 'Explore Portfolio',
    primaryCtaLink: '/developments',
    secondaryCtaText: 'Private Viewing',
    secondaryCtaLink: '#private-viewing',
  };

  const philosophy = siteSettings?.philosophy || {
    badge: 'The Kings Standard',
    title: 'Architecture as an',
    subtitle: 'Emotional Art',
    description: 'We do not simply build residences; we orchestrate light, volume, and horizon. Every Kings Real Estate development is born from radical collaboration between world-master architects, landscape artists, and private-client craftsmen.',
    videoMp4: '/videos/details-montage.mp4',
    poster: '/images/im18.jpg',
    stat1Value: '$2.4B+',
    stat1Label: 'Active Development Portfolio',
    stat2Value: '100%',
    stat2Label: 'Waterfront & Sky Exposure',
    ctaText: 'Our Vision & Leadership',
    ctaLink: '/about',
  };

  return (
    <div className="w-full flex flex-col bg-[#D9F9DF] text-[#1A1C3B]">
      {/* SECTION 1: HERO (Full Viewport, Eager Load) */}
      <VideoSection
        id="hero"
        eager={true}
        poster={hero.poster}
        srcMp4={hero.videoMp4}
        overlayOpacity={0.35}
        showScrollCue={true}
        align="center"
      >
        <div className="flex flex-col items-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#9FA1FF] backdrop-blur-md shadow-sm">
            <Diamond size={11} className="text-[#9FA1FF]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
              {hero.badge}
            </span>
          </div>

          <h1 className="h-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight font-serif text-balance font-bold drop-shadow-md">
            {hero.titleLine1} <br />
            <span className="bg-gradient-to-r from-[#AEE2FF] via-[#B5BAFF] to-[#9FA1FF] bg-clip-text text-transparent italic font-normal">{hero.titleLine2}</span>
          </h1>

          <p className="text-sm md:text-lg text-white/95 max-w-2xl font-sans font-light tracking-wide leading-relaxed drop-shadow-sm">
            {hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href={hero.primaryCtaLink || '/developments'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#9FA1FF] hover:bg-[#B5BAFF] text-[#1A1C3B] border border-[#9FA1FF] text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 shadow-md hover:shadow-lg rounded-full"
            >
              <span>{hero.primaryCtaText || 'Explore Portfolio'}</span>
              <ArrowRight size={14} />
            </Link>

            <a
              href={hero.secondaryCtaLink || '#private-viewing'}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/90 hover:bg-white border border-[#9FA1FF] text-[#1A1C3B] text-xs uppercase tracking-[0.25em] font-bold backdrop-blur-md transition-all duration-300 cursor-pointer rounded-full shadow-sm"
            >
              {hero.secondaryCtaText || 'Private Viewing'}
            </a>
          </div>
        </div>
      </VideoSection>

      {/* SECTION 2: BRAND PHILOSOPHY */}
      <VideoSection
        id="philosophy"
        poster={philosophy.poster}
        srcMp4={philosophy.videoMp4}
        overlayOpacity={0.45}
        align="left"
      >
        <div className="space-y-6 max-w-2xl bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-[#9FA1FF]/60 shadow-xl">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#9FA1FF]" />
            {philosophy.badge}
          </span>

          <h2 className="h-display text-3xl sm:text-5xl md:text-6xl text-[#1A1C3B] font-bold">
            {philosophy.title} <br />
            <span className="italic gold-gradient-text font-normal">{philosophy.subtitle}</span>
          </h2>

          <p className="text-sm md:text-base text-[#1A1C3B]/80 leading-relaxed font-sans font-light">
            {philosophy.description}
          </p>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#9FA1FF]/25">
            <div>
              <span className="h-display text-3xl md:text-4xl text-[#1A1C3B] font-bold block">
                {philosophy.stat1Value}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1C3B]/65 font-bold">
                {philosophy.stat1Label}
              </span>
            </div>
            <div>
              <span className="h-display text-3xl md:text-4xl text-[#1A1C3B] font-bold block">
                {philosophy.stat2Value}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1C3B]/65 font-bold">
                {philosophy.stat2Label}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href={philosophy.ctaLink || '/about'}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#9FA1FF] hover:text-[#1A1C3B] font-bold transition-colors"
            >
              <span>{philosophy.ctaText || 'Our Vision & Leadership'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </VideoSection>

      {/* SECTION 3: FEATURED DEVELOPMENT PREVIEW (Flagship Reveal) */}
      <VideoSection
        id="flagship"
        poster="/images/im5.webp"
        srcMp4="/videos/living-volume.mp4"
        overlayOpacity={0.42}
        align="right"
      >
        <div className="space-y-6 max-w-2xl text-right bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-[#9FA1FF]/60 shadow-xl ml-auto">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold inline-flex items-center gap-2">
            Featured Luxury Property
            <span className="w-8 h-[2px] bg-[#9FA1FF]" />
          </span>

          <h2 className="h-display text-3xl sm:text-5xl md:text-6xl text-[#1A1C3B] font-bold">
            {flagship.name}
          </h2>

          <p className="text-sm md:text-base text-[#1A1C3B]/80 leading-relaxed font-sans font-light">
            {flagship.overview}
          </p>

          <div className="flex items-center justify-end gap-6 pt-4 text-xs">
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">Location</span>
              <span className="text-[#1A1C3B] font-semibold">{flagship.neighborhood}</span>
            </div>
            <div className="text-right border-l border-[#9FA1FF]/30 pl-6">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">From</span>
              <span className="text-[#1A1C3B] font-serif text-base font-bold">{formatPrice(flagship.priceFrom)}</span>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href={`/developments/${flagship.slug}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#9FA1FF] hover:bg-[#B5BAFF] text-[#1A1C3B] border border-[#9FA1FF] text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 shadow-md rounded-full"
            >
              <span>View Property Details</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </VideoSection>

      {/* SECTION 4: NEIGHBORHOODS TEASER */}
      <VideoSection
        id="neighborhoods"
        poster="/images/im10.jpg"
        srcMp4="/videos/neighborhoods-aerial.mp4"
        overlayOpacity={0.45}
        align="split"
      >
        <div className="w-full space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3 bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-[#9FA1FF]/50 shadow-md">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold">
              Prime Geographies
            </span>
            <h2 className="h-display text-3xl sm:text-5xl text-[#1A1C3B] font-bold">
              Miami’s Most Revered Enclaves
            </h2>
            <p className="text-xs sm:text-sm text-[#1A1C3B]/75 font-sans font-light">
              From the vibrant cosmopolitan energy of Brickell to the botanical sanctuaries of Coconut Grove.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {neighborhoods.slice(0, 3).map((n) => (
              <Link
                key={n.slug}
                href="/neighborhoods"
                className="group relative h-80 overflow-hidden border border-[#9FA1FF]/40 bg-white/80 p-8 flex flex-col justify-end transition-all duration-500 hover:border-[#9FA1FF] rounded-3xl shadow-md hover:shadow-xl"
              >
                <Image
                  src={n.heroPoster}
                  alt={n.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C3B]/80 via-[#1A1C3B]/30 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#AEE2FF] font-bold">
                    District
                  </span>
                  <h3 className="font-serif text-2xl text-white group-hover:text-[#AEE2FF] transition-colors font-bold">
                    {n.name}
                  </h3>
                  <p className="text-xs text-white/85 line-clamp-2 font-sans font-light">
                    {n.description}
                  </p>
                  <div className="pt-2 flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-[#AEE2FF] font-bold group-hover:translate-x-1 transition-transform">
                    <span>Discover</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/neighborhoods"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1A1C3B] hover:text-[#9FA1FF] font-bold transition-colors underline underline-offset-8"
            >
              <span>View All Miami Neighborhoods & Guides</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </VideoSection>

      {/* SECTION 5: CLIENT TESTIMONIALS & CRITICAL ACCLAIM */}
      <TestimonialsSection />

      {/* SECTION 6: GLOBAL PRESS & MEDIA RECOGNITION */}
      <PressSection />

      {/* SECTION 7: PRIVATE VIEWING VIP CTA */}
      <div id="inquire">
        <VideoSection
          id="private-viewing"
          poster="/images/im13.jpg"
          srcMp4="/videos/sunset-dusk.mp4"
          overlayOpacity={0.4}
          align="split"
        >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <div className="lg:col-span-6 space-y-6 text-left bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-[#9FA1FF]/60 shadow-xl">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold">
              Direct Agent Access
            </span>
            <h2 className="h-display text-3xl sm:text-5xl md:text-6xl text-[#1A1C3B] font-bold">
              Schedule a <br />
              <span className="italic gold-gradient-text font-normal">Private Property Tour</span>
            </h2>
            <p className="text-sm text-[#1A1C3B]/80 leading-relaxed font-sans font-light">
              Experience our luxury residences firsthand with one of our premier agents. Schedule an exclusive showing today to view our available real estate portfolio.
            </p>

            <div className="space-y-4 pt-4 text-xs text-[#1A1C3B]/75">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-[#9FA1FF]" />
                <span className="font-semibold">Confidential Non-Disclosure Guarantees</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 size={16} className="text-[#9FA1FF]" />
                <span className="font-semibold">On-Site Sales Gallery & Full-Scale Penthouse Mockups</span>
              </div>
              <div className="flex items-center gap-3">
                <Compass size={16} className="text-[#9FA1FF]" />
                <span className="font-semibold">Private Yacht & Helicopter Transit Options</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <InquiryForm isCompact={false} />
          </div>
        </div>
      </VideoSection>
      </div>
    </div>
  );
}
