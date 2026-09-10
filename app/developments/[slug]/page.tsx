import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPropertyBySlug, getProperties } from '@/lib/cms';
import { VideoSection } from '@/components/video/VideoSection';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { FloorplateExplorer } from '@/components/property/FloorplateExplorer';
import { AtmosphereSwitcher } from '@/components/property/AtmosphereSwitcher';
import { PanoramaViewer360 } from '@/components/property/PanoramaViewer360';
import { DownloadBrochureButton } from '@/components/property/DownloadBrochureButton';
import { CompareButton } from '@/components/property/CompareButton';
import { formatPrice } from '@/lib/utils';
import { generateRealEstateListingJsonLd } from '@/lib/seo';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  Layers,
  Diamond,
  ShieldCheck,
  CheckCircle2,
  Compass,
  ArrowRight,
  ImageIcon,
  MessageCircle,
  Bed,
  Bath,
  ChefHat,
  Maximize,
} from 'lucide-react';
import Link from 'next/link';

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Property Not Found — Kings Real Estate',
    };
  }

  return {
    title: `${property.name} — Luxury Residences Miami | Kings Real Estate`,
    description: property.shortDescription,
    openGraph: {
      title: `${property.name} — Kings Real Estate`,
      description: property.tagline,
      images: [property.heroPoster],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const jsonLd = generateRealEstateListingJsonLd(property);

  return (
    <div className="w-full flex flex-col bg-[#D9F9DF] text-[#1A1C3B]">
      {/* Schema.org RealEstateListing Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* SECTION 1: HERO SECTION */}
      <VideoSection
        id="overview"
        eager={true}
        poster={property.heroPoster}
        srcMp4={property.heroVideoMp4}
        overlayOpacity={0.4}
        showScrollCue={true}
        align="center"
      >
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#9FA1FF] backdrop-blur-md shadow-sm">
            <MapPin size={13} className="text-[#9FA1FF]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
              {property.neighborhood}
            </span>
          </div>

          <h1 className="h-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight font-bold drop-shadow-md">
            {property.name}
          </h1>

          <p className="text-sm md:text-xl text-white/95 max-w-2xl mx-auto font-sans font-light leading-relaxed drop-shadow-sm">
            {property.tagline}
          </p>

          {/* Key Metric Highlights Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-[#9FA1FF]/30">
            <div className="p-4 bg-white/90 backdrop-blur-md border border-[#9FA1FF]/40 rounded-2xl shadow-sm">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">Starting From</span>
              <span className="font-serif text-lg text-[#1A1C3B] font-bold">{formatPrice(property.priceFrom)}</span>
            </div>
            <div className="p-4 bg-white/90 backdrop-blur-md border border-[#9FA1FF]/40 rounded-2xl shadow-sm">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">Delivery Date</span>
              <span className="text-sm text-[#1A1C3B] font-semibold">{property.completionDate}</span>
            </div>
            <div className="p-4 bg-white/90 backdrop-blur-md border border-[#9FA1FF]/40 rounded-2xl shadow-sm">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">Residences</span>
              <span className="text-sm text-[#1A1C3B] font-semibold">{property.totalResidences || 'Limited'} Units</span>
            </div>
            <div className="p-4 bg-white/90 backdrop-blur-md border border-[#9FA1FF]/40 rounded-2xl shadow-sm">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">Architect</span>
              <span className="text-xs text-[#1A1C3B] font-semibold truncate block">{property.architect || 'Master Architect'}</span>
            </div>
            
            {/* Unit Features */}
            {property.unitFeatures && (
              <>
                <div className="p-4 bg-white/90 backdrop-blur-md border border-[#9FA1FF]/40 rounded-2xl shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block mb-1">Bedrooms</span>
                  <div className="flex items-center gap-1.5">
                    <Bed size={14} className="text-[#9FA1FF] shrink-0" />
                    <span className="text-xs text-[#1A1C3B] font-semibold truncate block" title={property.unitFeatures.bedrooms}>{property.unitFeatures.bedrooms}</span>
                  </div>
                </div>
                <div className="p-4 bg-white/90 backdrop-blur-md border border-[#9FA1FF]/40 rounded-2xl shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block mb-1">Bathrooms</span>
                  <div className="flex items-center gap-1.5">
                    <Bath size={14} className="text-[#9FA1FF] shrink-0" />
                    <span className="text-xs text-[#1A1C3B] font-semibold truncate block" title={property.unitFeatures.bathrooms}>{property.unitFeatures.bathrooms}</span>
                  </div>
                </div>
                <div className="p-4 bg-white/90 backdrop-blur-md border border-[#9FA1FF]/40 rounded-2xl shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block mb-1">Kitchen</span>
                  <div className="flex items-center gap-1.5">
                    <ChefHat size={14} className="text-[#9FA1FF] shrink-0" />
                    <span className="text-xs text-[#1A1C3B] font-semibold truncate block" title={property.unitFeatures.kitchen}>{property.unitFeatures.kitchen}</span>
                  </div>
                </div>
                <div className="p-4 bg-white/90 backdrop-blur-md border border-[#9FA1FF]/40 rounded-2xl shadow-sm flex flex-col justify-center">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block mb-1">Square Footage</span>
                  <div className="flex items-center gap-1.5">
                    <Maximize size={14} className="text-[#9FA1FF] shrink-0" />
                    <span className="text-xs text-[#1A1C3B] font-semibold truncate block" title={property.unitFeatures.squareFootage}>{property.unitFeatures.squareFootage}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action CTAs: Brochure Download, Compare */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <DownloadBrochureButton property={property} />
            <CompareButton property={property} />
          </div>
        </div>
      </VideoSection>

      {/* STICKY ARCHITECTURAL SUB-NAV */}
      <div className="sticky top-[73px] z-30 bg-white/95 backdrop-blur-xl border-y border-[#9FA1FF]/30 py-3.5 px-6 hidden md:block text-[#1A1C3B] shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="font-serif text-sm text-[#1A1C3B] font-bold tracking-wider">
            {property.name}
          </div>

          <div className="flex items-center space-x-6 text-xs uppercase tracking-[0.18em] font-semibold">
            <a href="#overview" className="text-[#1A1C3B]/70 hover:text-[#1A1C3B] transition-colors">
              Overview
            </a>
            <a href="#spatial-360" className="text-[#1A1C3B]/70 hover:text-[#1A1C3B] transition-colors">
              360° Explorer
            </a>
            <a href="#atmosphere" className="text-[#1A1C3B]/70 hover:text-[#1A1C3B] transition-colors">
              Diurnal Lighting
            </a>
            {property.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-[#1A1C3B]/70 hover:text-[#1A1C3B] transition-colors"
              >
                {section.title}
              </a>
            ))}
            <a href="#floorplates" className="text-[#1A1C3B]/70 hover:text-[#1A1C3B] transition-colors">
              Floorplates
            </a>
            <a href="#amenities" className="text-[#1A1C3B]/70 hover:text-[#1A1C3B] transition-colors">
              Amenities
            </a>
            <a
              href="#inquire"
              className="text-[#1A1C3B] bg-[#9FA1FF] hover:bg-[#B5BAFF] border border-[#9FA1FF] px-4 py-1.5 font-bold transition-colors rounded-full shadow-sm"
            >
              Private Viewing
            </a>
          </div>
        </div>
      </div>

      {/* PROPERTY OVERVIEW / ARCHITECTURAL STATEMENT */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="space-y-6 text-center">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold">
            Architectural Philosophy
          </span>
          <h2 className="h-display text-3xl sm:text-5xl text-[#1A1C3B] font-bold">
            The Monument of Form & Light
          </h2>
          <p className="text-base sm:text-lg text-[#1A1C3B]/80 font-sans font-light leading-relaxed max-w-3xl mx-auto">
            {property.overview}
          </p>
        </div>
      </section>

      {/* ROOM-BY-ROOM REVEAL STACK (VideoSections) */}
      {property.sections.map((section, index) => {
        const align = index % 2 === 0 ? 'left' : 'right';
        return (
          <VideoSection
            key={section.id}
            id={section.id}
            poster={section.poster}
            srcMp4={section.videoMp4}
            overlayOpacity={0.42}
            align={align}
          >
            <div className={`space-y-6 max-w-2xl bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-[#9FA1FF]/60 shadow-xl ${align === 'right' ? 'text-right ml-auto' : 'text-left'}`}>
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold">
                  Room Reveal 0{index + 1}
                </span>
              </div>

              <h2 className="h-display text-3xl sm:text-5xl md:text-6xl text-[#1A1C3B] font-bold">
                {section.title}
              </h2>

              {section.subtitle && (
                <p className="h-caption text-base sm:text-lg text-[#9FA1FF] font-bold">
                  {section.subtitle}
                </p>
              )}

              <p className="text-sm md:text-base text-[#1A1C3B]/80 leading-relaxed font-sans font-light">
                {section.description}
              </p>

              {/* Specific Engineering Specifications Table */}
              {section.specs && section.specs.length > 0 && (
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#9FA1FF]/25 ${align === 'right' ? 'justify-items-end' : ''}`}>
                  {section.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold block">
                        {spec.label}
                      </span>
                      <span className="text-xs text-[#1A1C3B] font-bold block">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </VideoSection>
        );
      })}

      {/* ARCHITECTURAL PHOTO GALLERY */}
      {property.galleryImages && property.galleryImages.length > 0 && (
        <section id="gallery" className="py-24 px-6 md:px-12 bg-[#AEE2FF]/20 border-t border-[#9FA1FF]/30">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold">
                Visual Portfolio
              </span>
              <h2 className="h-display text-3xl sm:text-4xl text-[#1A1C3B] font-bold">
                Curated Architectural Photography
              </h2>
              <p className="text-xs sm:text-sm text-[#1A1C3B]/75 font-light">
                High-definition captures of bespoke finishes, private volumes, and coastal views.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {property.galleryImages.map((imgUrl, gIdx) => (
                <div
                  key={gIdx}
                  className="relative aspect-[16/10] overflow-hidden bg-[#AEE2FF]/40 border border-[#9FA1FF]/50 rounded-3xl group hover:border-[#9FA1FF] transition-all duration-500 shadow-md"
                >
                  <Image
                    src={imgUrl}
                    alt={`${property.name} - Gallery Plate 0${gIdx + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C3B]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-[10px] uppercase tracking-widest text-white font-bold">
                      Plate 0{gIdx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INTERACTIVE 360° SPATIAL EXPLORER */}
      <div id="spatial-360">
        <PanoramaViewer360 propertyName={property.name} />
      </div>

      {/* DIURNAL LIGHTING & 24-HOUR AMBIANCE SIMULATOR */}
      <div id="atmosphere">
        <AtmosphereSwitcher propertyName={property.name} />
      </div>

      {/* INTERACTIVE FLOORPLATE & PENTHOUSE EXPLORER */}
      <div id="floorplates">
        <FloorplateExplorer
          propertyName={property.name}
          propertySlug={property.slug}
        />
      </div>

      {/* AMENITIES HIGHLIGHT */}
      {property.amenitiesHighlight && (
        <section id="amenities" className="py-24 px-6 md:px-12 bg-[#AEE2FF]/20 border-t border-[#9FA1FF]/30">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold">
                Curated Privileges
              </span>
              <h2 className="h-display text-3xl sm:text-4xl text-[#1A1C3B] font-bold">
                Uncompromising Residential Services
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {property.amenitiesHighlight.map((amenity, idx) => (
                <div
                  key={idx}
                  className="p-8 bg-white/85 border border-[#9FA1FF]/40 rounded-3xl space-y-4 hover:border-[#9FA1FF] transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-[#AEE2FF]/50 text-[#1A1C3B] flex items-center justify-center font-bold">
                    <CheckCircle2 size={20} className="text-[#9FA1FF]" />
                  </div>
                  <h3 className="font-serif text-lg text-[#1A1C3B] font-bold">{amenity}</h3>
                  <p className="text-xs text-[#1A1C3B]/75 leading-relaxed">
                    Exclusive resident privileges with 24/7 on-demand concierge orchestration.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRIVATE VIEWING VIP CTA & EMBEDDED INQUIRY FORM */}
      <section id="inquire" className="py-24 px-6 md:px-12 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold">
            VIP Reservation
          </span>
          <h2 className="h-display text-3xl sm:text-5xl text-[#1A1C3B] font-bold">
            Inquire for {property.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1C3B]/75 font-sans max-w-md mx-auto">
            Schedule an on-site presentation or private yacht tour with our principal acquisitions partners.
          </p>
        </div>

        <InquiryForm
          defaultProperty={property.slug}
          defaultPropertyName={property.name}
          isCompact={false}
        />
      </section>
    </div>
  );
}
