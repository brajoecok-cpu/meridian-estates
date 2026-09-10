'use client';

import React, { useEffect, useState } from 'react';
import { Quote, Diamond, Star } from 'lucide-react';
import { Testimonial } from '@/lib/types';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (data?.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 bg-[#AEE2FF]/20 border-t border-[#9FA1FF]/30 text-[#1A1C3B]">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9F9DF] border border-[#9FA1FF] backdrop-blur-md shadow-sm">
            <Diamond size={11} className="text-[#9FA1FF]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
              Client Endorsements & Critical Acclaim
            </span>
          </div>
          <h2 className="h-display text-3xl sm:text-5xl text-[#1A1C3B] font-bold">
            The Sovereign Standard
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1C3B]/75 font-sans font-light">
            Insights from private collectors, trophy penthouse owners, and international architectural critics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-8 bg-white/80 backdrop-blur-md border border-[#9FA1FF]/40 rounded-3xl flex flex-col justify-between space-y-6 hover:border-[#9FA1FF] transition-colors shadow-sm hover:shadow-md group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#9FA1FF]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#9FA1FF" strokeWidth={0} />
                    ))}
                  </div>
                  {item.category && (
                    <span className="text-[9px] uppercase tracking-widest text-[#1A1C3B] font-bold bg-[#AEE2FF]/50 px-2.5 py-0.5 rounded-full border border-[#9FA1FF]/40">
                      {item.category}
                    </span>
                  )}
                </div>

                <Quote size={24} className="text-[#9FA1FF] group-hover:text-[#B5BAFF] transition-colors" />

                <p className="text-sm text-[#1A1C3B]/80 font-sans font-light leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#9FA1FF]/25">
                <div className="font-serif text-base text-[#1A1C3B] font-bold">
                  {item.author}
                </div>
                <div className="text-xs text-[#1A1C3B]/65 font-sans font-medium">
                  {item.titleOrResidence}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
