'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Columns3, X, ArrowRight, Diamond, Building2, MapPin, Check, Compass, Shield } from 'lucide-react';
import { useComparison } from '@/lib/comparison';
import { formatPrice } from '@/lib/utils';
import { useCurrency } from '@/lib/currency';

export function ComparisonTray() {
  const { selectedProperties, toggleProperty, clearComparison, isModalOpen, setIsModalOpen } = useComparison();
  const { formatPrice: formatCurrency } = useCurrency();

  if (selectedProperties.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Comparison Pill */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2.5 bg-white/95 border border-[#9FA1FF] backdrop-blur-2xl rounded-2xl shadow-xl flex items-center gap-3 text-[#1A1C3B]"
        >
          <div className="flex items-center gap-1.5 pl-2">
            <div className="w-2 h-2 rounded-full bg-[#9FA1FF] animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#1A1C3B]">
              Compare ({selectedProperties.length}/3)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {selectedProperties.map((p) => (
              <div
                key={p.slug}
                className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#AEE2FF]/40 border border-[#9FA1FF] group"
              >
                <Image src={p.heroPoster || '/images/im1.jpg'} alt={p.name} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => toggleProperty(p)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                  title={`Remove ${p.name}`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#9FA1FF] hover:bg-[#B5BAFF] text-[#1A1C3B] border border-[#9FA1FF] text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <Columns3 size={13} />
            <span>Open Matrix</span>
          </button>

          <button
            onClick={clearComparison}
            className="p-1.5 text-[#1A1C3B]/60 hover:text-[#1A1C3B] transition-colors cursor-pointer"
            title="Clear all"
          >
            <X size={14} />
          </button>
        </motion.div>
      </div>

      {/* Comparison Modal Matrix */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#1A1C3B]/60 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-6xl w-full bg-[#D9F9DF] border border-[#9FA1FF] rounded-3xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[90vh] text-[#1A1C3B]"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 bg-[#AEE2FF]/40 border-b border-[#9FA1FF]/40 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white border border-[#9FA1FF] text-[10px] uppercase tracking-[0.25em] text-[#1A1C3B] font-bold">
                    <Diamond size={11} className="text-[#9FA1FF]" />
                    <span>Portfolio Analysis</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-[#1A1C3B] font-bold">
                    Architectural Comparison Matrix
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearComparison}
                    className="px-4 py-2 bg-white/80 border border-[#9FA1FF]/60 text-xs text-[#1A1C3B]/70 hover:text-[#1A1C3B] rounded-xl transition-colors cursor-pointer font-bold"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2.5 bg-[#9FA1FF] hover:bg-[#B5BAFF] border border-[#9FA1FF] text-[#1A1C3B] rounded-full transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Matrix Table Columns */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 bg-[#D9F9DF]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedProperties.map((p) => (
                    <div
                      key={p.slug}
                      className="bg-white/85 border border-[#9FA1FF]/40 hover:border-[#9FA1FF] rounded-3xl p-6 space-y-6 flex flex-col justify-between shadow-sm"
                    >
                      <div className="space-y-4">
                        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#AEE2FF]/40">
                          <Image src={p.heroPoster || '/images/im1.jpg'} alt={p.name} fill className="object-cover" />
                          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] uppercase tracking-wider text-[#1A1C3B] font-bold border border-[#9FA1FF]">
                            {p.neighborhood}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-serif text-xl text-[#1A1C3B] font-bold leading-snug">{p.name}</h4>
                          <span className="font-serif text-2xl text-[#1A1C3B] font-bold block mt-1">
                            {formatCurrency(p.priceFrom)}
                          </span>
                        </div>

                        {/* Specs Grid */}
                        <div className="space-y-3 pt-3 border-t border-[#9FA1FF]/25 text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#1A1C3B]/70 font-medium">Architectural Master</span>
                            <span className="text-[#1A1C3B] font-bold text-right">{p.architect || 'Kings Atelier'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#1A1C3B]/70 font-medium">Residences / Scale</span>
                            <span className="text-[#1A1C3B] font-bold">{p.totalResidences || 'Bespoke Enclave'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#1A1C3B]/70 font-medium">Completion Timeline</span>
                            <span className="text-[#1A1C3B] font-bold">{p.completionDate || '2026/2027'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#1A1C3B]/70 font-medium">Status</span>
                            <span className="text-[#1A1C3B] font-bold">{p.status || 'Immediate Commission'}</span>
                          </div>
                        </div>

                        {/* Amenities / Features */}
                        {p.amenitiesHighlight && (
                          <div className="pt-3 border-t border-[#9FA1FF]/25 space-y-1.5 text-xs text-[#1A1C3B]/80">
                            <span className="text-[10px] uppercase tracking-wider text-[#1A1C3B] block font-bold">
                              Signature Highlights:
                            </span>
                            {p.amenitiesHighlight.slice(0, 3).map((a, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Check size={12} className="text-[#9FA1FF] font-bold" />
                                <span className="font-medium">{a}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#9FA1FF]/25 space-y-2">
                        <Link
                          href={`/developments/${p.slug}`}
                          onClick={() => setIsModalOpen(false)}
                          className="w-full py-3 bg-[#9FA1FF] hover:bg-[#B5BAFF] text-[#1A1C3B] border border-[#9FA1FF] text-xs uppercase tracking-wider font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <span>Explore Full Penthouse</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
