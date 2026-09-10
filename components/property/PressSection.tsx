'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Newspaper, Diamond } from 'lucide-react';
import { PressArticle } from '@/lib/types';

export function PressSection() {
  const [articles, setArticles] = useState<PressArticle[]>([]);

  useEffect(() => {
    fetch('/api/admin/press')
      .then((res) => res.json())
      .then((data) => {
        if (data?.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});
  }, []);

  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 bg-[#D9F9DF] border-t border-[#9FA1FF]/30 text-[#1A1C3B]">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#9FA1FF] backdrop-blur-md shadow-sm">
            <Newspaper size={12} className="text-[#9FA1FF]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A1C3B] font-bold">
              Press, Honors & Critical Recognition
            </span>
          </div>
          <h2 className="h-display text-3xl sm:text-5xl text-[#1A1C3B] font-bold">
            In the Global Press
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1C3B]/75 font-sans font-light">
            International architectural features, developer awards, and industry milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((item) => (
            <div
              key={item.id}
              className="group bg-white/80 border border-[#9FA1FF]/40 hover:border-[#9FA1FF] rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md cursor-default"
            >
              {item.image && (
                <div className="relative aspect-[16/10] w-full bg-[#AEE2FF]/40 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md border border-[#9FA1FF] text-[10px] uppercase tracking-widest text-[#1A1C3B] font-bold rounded-full shadow-sm">
                    {item.publication}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#1A1C3B]/60 font-semibold block">
                    {item.date}
                  </span>
                  <h3 className="font-serif text-lg text-[#1A1C3B] group-hover:text-[#9FA1FF] transition-colors leading-snug line-clamp-2 font-bold">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#1A1C3B]/75 line-clamp-3 font-sans font-light leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#9FA1FF]/25 flex items-center justify-between text-xs text-[#9FA1FF] group-hover:text-[#1A1C3B] transition-colors font-bold">
                  <span className="uppercase tracking-widest text-[10px]">Read Feature</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
