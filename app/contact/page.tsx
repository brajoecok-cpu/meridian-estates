import React from 'react';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { Diamond, MapPin, Phone, Mail, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { VideoBackground } from '@/components/video/VideoBackground';

export const metadata = {
  title: 'Private Viewing & VIP Appointments — Kings Real Estate Miami',
  description: 'Schedule a confidential consultation or private helicopter/water-tender showing with the executive developer team.',
};

import { getSiteSettings } from '@/lib/cms';

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();
  const contact = siteSettings?.contact;

  return (
    <div className="min-h-screen bg-[#D9F9DF] text-[#1A1C3B] pb-24">
      {/* CINEMATIC VIDEO HERO */}
      <div className="relative h-[60vh] min-h-[440px] w-full mb-16 overflow-hidden">
        <VideoBackground
          srcMp4="/videos/sunset-estate.mp4"
          poster="/images/im2.jpg"
          eager={true}
          overlayOpacity={0.45}
          className="h-full w-full"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-[#9FA1FF] backdrop-blur-md w-fit shadow-sm">
              <Diamond size={11} className="text-[#9FA1FF]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
                Confidential Client Relations
              </span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl md:text-7xl text-white font-bold drop-shadow-md">
              Private <br />
              <span className="italic bg-gradient-to-r from-[#AEE2FF] via-[#B5BAFF] to-[#9FA1FF] bg-clip-text text-transparent font-normal">Appointments</span>
            </h1>

            <p className="text-sm md:text-base text-white/95 font-sans font-light leading-relaxed max-w-2xl drop-shadow-sm">
              All consultations, property walk-throughs, and yacht arrivals are coordinated with utmost discretion by our Senior Managing Directors.
            </p>
          </div>
        </VideoBackground>
      </div>

      {/* Main Grid: Info + Form */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contacts & Gallery Location */}
          <div className="lg:col-span-5 space-y-8">
            {/* Sales Gallery Card */}
            <div className="p-8 bg-white/85 border border-[#9FA1FF]/50 space-y-6 rounded-3xl shadow-sm">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#9FA1FF] font-bold block">
                Primary Sales Gallery
              </span>

              <h2 className="font-serif text-2xl text-[#1A1C3B] font-bold">
                Kings Executive Tower
              </h2>

              <div className="space-y-4 text-xs text-[#1A1C3B]/80">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#9FA1FF] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1A1C3B] block whitespace-pre-line">{contact?.address || '1000 Brickell Avenue\nMiami, FL 33131 USA'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-[#9FA1FF] flex-shrink-0" />
                  <span>{contact?.workingHours || 'Monday – Saturday: 9:00 AM – 7:00 PM (By Appointment Only)'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#9FA1FF] flex-shrink-0" />
                  <a href={`tel:${contact?.phone?.replace(/[^0-9+]/g, '')}`} className="hover:text-[#1A1C3B] font-bold transition-colors">
                    {contact?.phone || '+233 200316267'}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-[#25D366] flex-shrink-0" />
                  <span className="text-[#25D366] font-bold flex items-center gap-1.5">
                    <span>WhatsApp VIP Liaison ({contact?.whatsapp || '+233 200316267'})</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#9FA1FF] flex-shrink-0" />
                  <a href={`mailto:${contact?.email || 'acquisitions@kings-realestate.com'}`} className="hover:text-[#1A1C3B] font-bold transition-colors">
                    {contact?.email || 'acquisitions@kings-realestate.com'}
                  </a>
                </div>
              </div>
            </div>

            {/* Discretion Assurance Card */}
            <div className="p-8 bg-white/90 border border-[#9FA1FF] space-y-4 rounded-3xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#AEE2FF]/50 text-[#1A1C3B] flex items-center justify-center font-bold">
                <ShieldCheck size={20} className="text-[#9FA1FF]" />
              </div>
              <h3 className="font-serif text-lg text-[#1A1C3B] font-bold">
                Absolute Discretion Protocol
              </h3>
              <p className="text-xs text-[#1A1C3B]/75 leading-relaxed font-sans font-light">
                We accommodate private aircraft transfers into Opa-locka Executive Airport (OPF) and deep-water tender dockage at all sales presentation locations. Non-disclosure agreements provided upon request.
              </p>
            </div>
          </div>

          {/* Right Column: Confidential Form */}
          <div className="lg:col-span-7">
            <InquiryForm isCompact={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
