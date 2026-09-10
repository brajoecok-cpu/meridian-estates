import React from 'react';
import { ShieldCheck, Scale, Home } from 'lucide-react';

export const metadata = {
  title: 'Legal & Equal Housing Opportunity — Kings Real Estate',
  description: 'Legal notices, privacy policies, disclaimers, and Fair Housing statements for Kings Real Estate.',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#D9F9DF] text-[#1A1C3B] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-[#9FA1FF]/30 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#9FA1FF] text-[10px] uppercase tracking-[0.2em] text-[#1A1C3B] font-bold shadow-xs">
            <Scale size={12} className="text-[#9FA1FF]" />
            <span>Legal Notices & Regulatory Compliance</span>
          </div>
          <h1 className="h-display text-4xl sm:text-5xl text-[#1A1C3B] font-bold">
            Disclaimers & Terms of Offering
          </h1>
          <p className="text-xs text-[#1A1C3B]/60 font-semibold">
            Last Updated: September 2026 • Kings Real Estate Development LLC
          </p>
        </div>

        {/* Section 1: Equal Housing Opportunity */}
        <div className="p-8 bg-white/90 border border-[#9FA1FF]/50 rounded-3xl space-y-3 shadow-sm">
          <div className="flex items-center gap-3 text-[#9FA1FF]">
            <Home size={20} />
            <h2 className="font-serif text-lg text-[#1A1C3B] font-bold">Equal Housing Opportunity</h2>
          </div>
          <p className="text-xs text-[#1A1C3B]/80 leading-relaxed font-sans font-light">
            We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the Nation. We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing because of race, color, religion, sex, handicap, familial status, or national origin.
          </p>
        </div>

        {/* Section 2: Developer Disclaimer */}
        <div className="space-y-4 text-xs text-[#1A1C3B]/80 leading-relaxed font-sans font-light">
          <h3 className="font-serif text-xl text-[#1A1C3B] font-bold">1. Offering & Representation Disclaimer</h3>
          <p>
            Oral representations cannot be relied upon as correctly stating the representations of the developer. For correct representations, make reference to the documents required by section 718.503, Florida Statutes, to be furnished by a developer to a buyer or lessee.
          </p>
          <p>
            This is not intended to be an offer to sell, or solicitation to buy, condominium units to residents of any jurisdiction where prohibited by law, and your eligibility for purchase will depend upon your state or country of residency.
          </p>
        </div>

        {/* Section 3: Architectural Renderings */}
        <div className="space-y-4 text-xs text-[#1A1C3B]/80 leading-relaxed font-sans font-light">
          <h3 className="font-serif text-xl text-[#1A1C3B] font-bold">2. Architectural Renderings & Specifications</h3>
          <p>
            All artist renderings, finishes, fixtures, and interior designs depicted on this website are conceptual approximations subject to architectural refinement, local municipal permitting, and developer discretion. Actual completed residences may vary in dimension, structural column placement, balcony depth, and window configuration.
          </p>
        </div>

        {/* Section 4: Privacy & Data Protection */}
        <div className="space-y-4 text-xs text-[#1A1C3B]/80 leading-relaxed font-sans font-light">
          <h3 className="font-serif text-xl text-[#1A1C3B] font-bold">3. VIP Privacy & Information Confidentiality</h3>
          <p>
            Information provided through our Private Viewing scheduling portal is collected solely by Kings Real Estate Development LLC and authorized sales partners. We do not license, sell, or disclose client identity or financial ranges to third-party marketing entities.
          </p>
        </div>
      </div>
    </div>
  );
}
