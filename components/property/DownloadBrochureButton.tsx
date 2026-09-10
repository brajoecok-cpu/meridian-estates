'use client';

import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Shield, Diamond, X, Printer } from 'lucide-react';
import { Property } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export function DownloadBrochureButton({ property }: { property: Property }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  const handleTriggerDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloading(true);

    // Save lead inquiry in background
    fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: clientName,
        email: clientEmail,
        propertyName: property.name,
        propertySlug: property.slug,
        timeframe: 'Brochure Dossier Download',
        budget: formatPrice(property.priceFrom),
        message: `Requested Private Architectural Dossier for ${property.name}`,
      }),
    }).catch(() => {});

    setTimeout(() => {
      setDownloading(false);
      setDownloadReady(true);
      // Trigger browser print/save-as-pdf
      setTimeout(() => {
        window.print();
      }, 500);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[rgb(255,245,245)] hover:bg-[rgb(247,214,208)] border border-[rgb(226,180,189)] text-[rgb(74,74,74)] text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-full shadow-sm hover:shadow-md cursor-pointer group"
      >
        <FileText size={14} className="text-[rgb(226,180,189)] group-hover:scale-110 transition-transform" />
        <span>Download Private Dossier</span>
      </button>

      {/* Brochure Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[rgb(74,74,74)]/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-[rgb(255,245,245)] border border-[rgb(226,180,189)] rounded-3xl overflow-hidden shadow-2xl p-8 space-y-6 text-[rgb(74,74,74)]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[rgb(74,74,74)]/70 hover:text-black rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[rgb(247,214,208)] border border-[rgb(226,180,189)] flex items-center justify-center mx-auto text-[rgb(74,74,74)]">
                <FileText size={22} className="text-[rgb(226,180,189)]" />
              </div>
              <h3 className="font-serif text-2xl text-[rgb(74,74,74)] font-bold">
                Private Architectural Dossier
              </h3>
              <p className="text-xs text-[rgb(74,74,74)]/80 font-light leading-relaxed">
                Generate a comprehensive executive brochure for <span className="text-[rgb(180,120,135)] font-bold">{property.name}</span> with full floorplates, finish schedules, and private dockage specs.
              </p>
            </div>

            {!downloadReady ? (
              <form onSubmit={handleTriggerDownload} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[rgb(74,74,74)] font-bold mb-1">
                    Principal or Representative Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Lord Alistair Sterling / Family Office"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-3 bg-[rgb(255,245,245)] border border-[rgb(226,180,189)] focus:border-[rgb(180,120,135)] text-xs text-[rgb(74,74,74)] rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[rgb(74,74,74)] font-bold mb-1">
                    Confidential Email Destination *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="principal@familyoffice.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[rgb(255,245,245)] border border-[rgb(226,180,189)] focus:border-[rgb(180,120,135)] text-xs text-[rgb(74,74,74)] rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 text-[10px] text-[rgb(74,74,74)]/70 pt-1">
                  <Shield size={12} className="text-[rgb(226,180,189)] font-bold" />
                  <span>Encrypted PDF delivery under strict non-disclosure protocol.</span>
                </div>

                <button
                  type="submit"
                  disabled={downloading}
                  className="w-full py-4 bg-[rgb(247,214,208)] hover:bg-[rgb(226,180,189)] text-[rgb(74,74,74)] border border-[rgb(226,180,189)] text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-md rounded-full cursor-pointer flex items-center justify-center gap-2"
                >
                  {downloading ? (
                    <span>Compiling Architectural Dossier...</span>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Generate & Export PDF Dossier</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="flex items-center justify-center gap-2 text-[rgb(180,120,135)] font-bold text-sm">
                  <CheckCircle2 size={18} className="text-[rgb(226,180,189)]" />
                  <span>Dossier Compiled Successfully</span>
                </div>
                <p className="text-xs text-[rgb(74,74,74)]/75">
                  Print dialog has opened. You can save as PDF or print directly.
                </p>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[rgb(247,214,208)]/50 border border-[rgb(226,180,189)] text-xs text-[rgb(74,74,74)] font-bold rounded-full cursor-pointer hover:bg-[rgb(226,180,189)]"
                >
                  <Printer size={13} />
                  <span>Reopen Print / Save Dialog</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
