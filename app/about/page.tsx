import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, ArrowUpRight, MapPin, Building2, Diamond } from 'lucide-react';
import { VideoBackground } from '@/components/video/VideoBackground';
import { getLeadershipMembers, getAboutContent } from '@/lib/cms';

export const metadata = {
  title: 'About the Developer — Kings Real Estate Miami',
  description: 'Explore the architectural legacy, delivered landmarks, and development philosophy of Kings Real Estate Miami.',
};

// Helper component to dynamically render Lucide icons
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <IconComponent className={className} size={22} />;
};

export default async function AboutPage() {
  const leadership = await getLeadershipMembers();
  const about = await getAboutContent();

  if (!about) return null;

  return (
    <div className="min-h-screen bg-[#D9F9DF] text-[#1A1C3B] pb-24">
      {/* 1. SINGLE CINEMATIC VIDEO BACKGROUND HERO */}
      <div className="relative h-[65vh] min-h-[480px] w-full mb-16 overflow-hidden">
        <VideoBackground
          srcMp4={about.heroVideoMp4}
          poster={about.heroPoster}
          eager={true}
          overlayOpacity={0.45}
          className="h-full w-full"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-[#9FA1FF] backdrop-blur-md w-fit shadow-sm">
              <Diamond size={11} className="text-[#9FA1FF]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
                {about.heroSubtitle}
              </span>
            </div>

            <h1 
              className="h-display text-4xl sm:text-6xl md:text-7xl text-white font-bold drop-shadow-md"
              dangerouslySetInnerHTML={{ __html: about.heroTitle }}
            />

            <p className="text-sm md:text-base text-white/95 font-sans font-light leading-relaxed max-w-2xl drop-shadow-sm">
              {about.heroDescription}
            </p>
          </div>
        </VideoBackground>
      </div>

      {/* 2. FOUNDING PHILOSOPHY WITH REAL PHOTOGRAPHY */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold">
              {about.philosophySubtitle}
            </span>
            <h2 
              className="h-display text-3xl sm:text-5xl text-[#1A1C3B] font-bold"
              dangerouslySetInnerHTML={{ __html: about.philosophyTitle }}
            />
            <p className="text-sm md:text-base text-[#1A1C3B]/80 leading-relaxed font-sans font-light">
              {about.philosophyParagraph1}
            </p>
            <p className="text-sm text-[#1A1C3B]/70 leading-relaxed font-sans font-light">
              {about.philosophyParagraph2}
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#9FA1FF]/25">
              <div>
                <span className="font-serif text-3xl text-[#1A1C3B] font-bold block">{about.philosophyStat1Value}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold">{about.philosophyStat1Label}</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#1A1C3B] font-bold block">{about.philosophyStat2Value}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1C3B]/60 font-bold">{about.philosophyStat2Label}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] w-full overflow-hidden bg-[#AEE2FF]/40 border border-[#9FA1FF]/50 rounded-3xl group shadow-md">
            <Image
              src={about.philosophyImage}
              alt="Kings Architectural Philosophy"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C3B]/70 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[9px] uppercase tracking-widest text-[#AEE2FF] font-bold block">
                Atelier Standards
              </span>
              <p className="text-xs text-white font-serif font-bold">
                Hand-cut Roman Travertine & Marine-Grade Structural Engineering
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. REAL ARCHITECTURAL PORTFOLIO OF DELIVERED DEVELOPMENTS */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center gap-2">
            <Building2 size={14} className="text-[#9FA1FF]" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold">
              {about.portfolioSubtitle}
            </span>
          </div>
          <h2 
            className="h-display text-3xl sm:text-5xl text-[#1A1C3B] font-bold"
            dangerouslySetInnerHTML={{ __html: about.portfolioTitle }}
          />
          <p className="text-sm text-[#1A1C3B]/75 font-sans font-light max-w-xl">
            {about.portfolioDescription}
          </p>
        </div>

        {/* Real Imagery Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {about.deliveredProjects.map((proj, idx) => (
            <Link
              key={proj.id || idx}
              href={`/developments/${proj.slug}`}
              className="group bg-white/85 border border-[#9FA1FF]/40 hover:border-[#9FA1FF] transition-all duration-500 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#AEE2FF]/40">
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C3B]/70 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-md border border-[#9FA1FF] text-[9px] uppercase tracking-[0.2em] text-[#1A1C3B] font-bold rounded-full shadow-sm">
                    {proj.status}
                  </span>
                </div>

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#9FA1FF] flex items-center justify-center text-[#1A1C3B] group-hover:bg-[#9FA1FF] transition-all duration-300 shadow-sm">
                  <ArrowUpRight size={16} />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#AEE2FF] font-bold mb-1">
                    <MapPin size={12} />
                    <span>{proj.neighborhood}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-white group-hover:text-[#AEE2FF] transition-colors font-bold">
                    {proj.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between bg-white/50 backdrop-blur-sm">
                <p className="text-xs md:text-sm text-[#1A1C3B]/80 font-sans font-light leading-relaxed">
                  {proj.description}
                </p>

                <div className="pt-4 border-t border-[#9FA1FF]/25 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#1A1C3B]/60 font-bold block">Architect</span>
                    <span className="text-[#1A1C3B] font-semibold">{proj.architect}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#1A1C3B]/60 font-bold block">Residences</span>
                    <span className="text-[#1A1C3B] font-semibold">{proj.units}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. LEADERSHIP PILLARS */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold">
            {about.tenetsSubtitle}
          </span>
          <h3 className="h-display text-3xl sm:text-4xl text-[#1A1C3B] font-bold">
            {about.tenetsTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.tenets.map((pillar, idx) => (
            <div key={pillar.id || idx} className="p-8 bg-white/85 border border-[#9FA1FF]/40 space-y-4 hover:border-[#9FA1FF] transition-colors rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#AEE2FF]/40 text-[#1A1C3B] flex items-center justify-center font-bold">
                <DynamicIcon name={pillar.iconName} className="text-[#9FA1FF]" />
              </div>
              <h4 className="font-serif text-lg text-[#1A1C3B] font-bold">{pillar.title}</h4>
              <p className="text-xs text-[#1A1C3B]/75 leading-relaxed font-sans font-light">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. EXECUTIVE ATELIER & LEADERSHIP (CMS Managed) */}
      {leadership && leadership.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#9FA1FF] backdrop-blur-md shadow-sm">
              <Diamond size={11} className="text-[#9FA1FF]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
                Executive Leadership
              </span>
            </div>
            <h3 className="h-display text-3xl sm:text-5xl text-[#1A1C3B] font-bold">
              The Atelier Masters
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1C3B]/75 font-sans font-light">
              Guided by visionary principals dedicated to generational architectural permanence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((member) => (
              <div
                key={member.id}
                className="group bg-white/85 border border-[#9FA1FF]/40 hover:border-[#9FA1FF] rounded-3xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full bg-[#AEE2FF]/40 overflow-hidden">
                  <Image
                    src={member.image || '/images/im7.jpeg'}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C3B]/60 via-transparent to-transparent opacity-40" />
                </div>

                <div className="p-6 md:p-8 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#9FA1FF] font-bold block">
                      {member.role}
                    </span>
                    <h4 className="font-serif text-2xl text-[#1A1C3B] font-bold">
                      {member.name}
                    </h4>
                    <p className="text-xs text-[#1A1C3B]/75 font-sans font-light leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. EXECUTIVE CONSULTATION CTA */}
      <div className="max-w-4xl mx-auto px-6 text-center space-y-6 p-12 bg-white/90 border border-[#9FA1FF] rounded-3xl shadow-xl mb-12">
        <h3 className="h-display text-3xl sm:text-4xl text-[#1A1C3B] font-bold">
          {about.ctaTitle}
        </h3>
        <p className="text-sm text-[#1A1C3B]/80 max-w-md mx-auto font-sans font-light">
          {about.ctaDescription}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#9FA1FF] hover:bg-[#B5BAFF] text-[#1A1C3B] border border-[#9FA1FF] text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-md rounded-full"
        >
          <span>Contact Acquisitions Team</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
