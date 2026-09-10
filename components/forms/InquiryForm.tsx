'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  CheckCircle2,
  Loader2,
  Send,
  ShieldCheck,
  ChevronDown,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  MessageSquare,
  Diamond,
} from 'lucide-react';
import { trackLeadSubmission } from '@/lib/analytics';

const inquirySchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  propertySlug: z.string().optional(),
  propertyName: z.string().optional(),
  timeframe: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Please acknowledge the privacy policy',
  }),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  defaultProperty?: string;
  defaultPropertyName?: string;
  isCompact?: boolean;
  className?: string;
}

export function InquiryForm({
  defaultProperty,
  defaultPropertyName,
  isCompact = false,
  className = '',
}: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      propertySlug: defaultProperty || '',
      propertyName: defaultPropertyName || '',
      timeframe: 'Immediate Occupancy',
      budget: '$5,000,000 – $10,000,000 USD',
      message: '',
      consent: true,
    },
  });

  const onSubmit = async (data: InquiryFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry. Please try again.');
      }

      setIsSubmitted(true);
      trackLeadSubmission({
        propertyName: data.propertyName,
        propertySlug: data.propertySlug,
        budget: data.budget,
        timeframe: data.timeframe,
      });
      reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please contact the concierge directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`p-10 md:p-14 bg-white/95 border border-[#9FA1FF] text-center flex flex-col items-center justify-center space-y-5 rounded-3xl relative overflow-hidden backdrop-blur-2xl shadow-2xl text-[#1A1C3B] ${className}`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#9FA1FF] to-transparent" />
        
        <div className="w-16 h-16 rounded-2xl bg-[#AEE2FF]/50 text-[#9FA1FF] border border-[#9FA1FF]/50 flex items-center justify-center mb-1 shadow-inner">
          <CheckCircle2 size={30} />
        </div>
        
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#9FA1FF] font-bold block">
            Handshake Confirmed
          </span>
          <h3 className="font-serif text-3xl text-[#1A1C3B] font-bold">
            Private Viewing Requested
          </h3>
          <p className="text-sm text-[#1A1C3B]/80 max-w-md mx-auto leading-relaxed font-sans font-light">
            Thank you. Our Senior Managing Director will contact you discreetly within 2 hours to coordinate your private preview.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-4 text-xs uppercase tracking-[0.2em] text-[#9FA1FF] hover:text-[#1A1C3B] underline underline-offset-8 transition-colors cursor-pointer font-bold"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={`bg-white/90 border border-[#9FA1FF]/50 p-8 sm:p-10 md:p-12 shadow-2xl rounded-3xl relative overflow-hidden backdrop-blur-2xl text-[#1A1C3B] ${className}`}
    >
      {/* Top Specular Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#9FA1FF] to-transparent" />

      <div className="mb-8 text-left space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AEE2FF]/40 border border-[#9FA1FF]/50 text-[10px] uppercase tracking-[0.25em] text-[#1A1C3B] mb-2 font-bold shadow-sm">
          <Diamond size={11} className="text-[#9FA1FF]" />
          <span>Confidential VIP Inquiries</span>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-[#1A1C3B] font-bold tracking-tight">
          {defaultPropertyName ? `Reserve at ${defaultPropertyName}` : 'Schedule a Private Viewing'}
        </h3>
        <p className="text-xs text-[#1A1C3B]/75 font-sans font-light">
          Direct liaison with the developer’s executive acquisitions team.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-xs text-red-800 rounded-xl">
          {errorMessage}
        </div>
      )}

      {/* Hidden property context */}
      <input type="hidden" {...register('propertySlug')} />
      <input type="hidden" {...register('propertyName')} />

      <div className="space-y-4">
        {/* Full Name Modern Input */}
        <div>
          <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1C3B]/70 mb-1.5 font-bold">
            Full Name *
          </label>
          <div className={`relative flex items-center bg-[#AEE2FF]/20 border rounded-xl transition-all duration-300 shadow-inner group ${
            errors.name ? 'border-red-500/80' : 'border-[#9FA1FF]/40 focus-within:border-[#9FA1FF] focus-within:ring-1 focus-within:ring-[#9FA1FF]/50 focus-within:bg-white'
          }`}>
            <div className="pl-4 pr-2 text-[#9FA1FF] group-focus-within:text-[#1A1C3B] transition-colors pointer-events-none">
              <User size={16} />
            </div>
            <input
              id="name"
              type="text"
              placeholder="Alexander Wright"
              {...register('name')}
              className="w-full py-3.5 pr-4 bg-transparent text-xs sm:text-sm text-[#1A1C3B] placeholder-[#1A1C3B]/35 focus:outline-none font-medium"
            />
          </div>
          {errors.name && <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">{errors.name.message}</p>}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Direct Email Modern Input */}
          <div>
            <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1C3B]/70 mb-1.5 font-bold">
              Direct Email *
            </label>
            <div className={`relative flex items-center bg-[#AEE2FF]/20 border rounded-xl transition-all duration-300 shadow-inner group ${
              errors.email ? 'border-red-500/80' : 'border-[#9FA1FF]/40 focus-within:border-[#9FA1FF] focus-within:ring-1 focus-within:ring-[#9FA1FF]/50 focus-within:bg-white'
            }`}>
              <div className="pl-4 pr-2 text-[#9FA1FF] group-focus-within:text-[#1A1C3B] transition-colors pointer-events-none">
                <Mail size={16} />
              </div>
              <input
                id="email"
                type="email"
                placeholder="alexander.wright@familyoffice.com"
                {...register('email')}
                className="w-full py-3.5 pr-4 bg-transparent text-xs sm:text-sm text-[#1A1C3B] placeholder-[#1A1C3B]/35 focus:outline-none font-medium"
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">{errors.email.message}</p>}
          </div>

          {/* Telephone Modern Input */}
          <div>
            <label htmlFor="phone" className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1C3B]/70 mb-1.5 font-bold">
              Telephone (Optional)
            </label>
            <div className="relative flex items-center bg-[#AEE2FF]/20 border border-[#9FA1FF]/40 focus-within:border-[#9FA1FF] focus-within:ring-1 focus-within:ring-[#9FA1FF]/50 focus-within:bg-white rounded-xl transition-all duration-300 shadow-inner group">
              <div className="pl-4 pr-2 text-[#9FA1FF] group-focus-within:text-[#1A1C3B] transition-colors pointer-events-none">
                <Phone size={16} />
              </div>
              <input
                id="phone"
                type="tel"
                placeholder="+233 200316267"
                {...register('phone')}
                className="w-full py-3.5 pr-4 bg-transparent text-xs sm:text-sm text-[#1A1C3B] placeholder-[#1A1C3B]/35 focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {!isCompact && (
          <>
            {/* Budget & Timeframe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Capital Range Modern Select */}
              <div>
                <label htmlFor="budget" className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1C3B]/70 mb-1.5 font-bold">
                  Anticipated Capital Range
                </label>
                <div className="relative flex items-center bg-[#AEE2FF]/20 border border-[#9FA1FF]/40 focus-within:border-[#9FA1FF] focus-within:ring-1 focus-within:ring-[#9FA1FF]/50 focus-within:bg-white rounded-xl transition-all duration-300 shadow-inner group">
                  <div className="pl-4 pr-2 text-[#9FA1FF] group-focus-within:text-[#1A1C3B] transition-colors pointer-events-none">
                    <DollarSign size={16} />
                  </div>
                  <select
                    id="budget"
                    {...register('budget')}
                    className="w-full appearance-none py-3.5 pr-10 bg-transparent text-xs sm:text-sm text-[#1A1C3B] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="$5,000,000 – $10,000,000 USD" className="bg-[#D9F9DF] text-[#1A1C3B]">$5,000,000 – $10,000,000 USD</option>
                    <option value="$10,000,000 – $20,000,000 USD" className="bg-[#D9F9DF] text-[#1A1C3B]">$10,000,000 – $20,000,000 USD</option>
                    <option value="$20,000,000+ USD (Penthouses & Estates)" className="bg-[#D9F9DF] text-[#1A1C3B]">$20,000,000+ USD (Penthouses & Estates)</option>
                    <option value="Confidential / Family Office Advisory" className="bg-[#D9F9DF] text-[#1A1C3B]">Confidential / Family Office Advisory</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A1C3B]/60 group-focus-within:text-[#1A1C3B] pointer-events-none transition-colors" />
                </div>
              </div>

              {/* Acquisition Timeline Modern Select */}
              <div>
                <label htmlFor="timeframe" className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1C3B]/70 mb-1.5 font-bold">
                  Acquisition Timeline
                </label>
                <div className="relative flex items-center bg-[#AEE2FF]/20 border border-[#9FA1FF]/40 focus-within:border-[#9FA1FF] focus-within:ring-1 focus-within:ring-[#9FA1FF]/50 focus-within:bg-white rounded-xl transition-all duration-300 shadow-inner group">
                  <div className="pl-4 pr-2 text-[#9FA1FF] group-focus-within:text-[#1A1C3B] transition-colors pointer-events-none">
                    <Calendar size={16} />
                  </div>
                  <select
                    id="timeframe"
                    {...register('timeframe')}
                    className="w-full appearance-none py-3.5 pr-10 bg-transparent text-xs sm:text-sm text-[#1A1C3B] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Immediate Occupancy" className="bg-[#D9F9DF] text-[#1A1C3B]">Immediate Occupancy</option>
                    <option value="3 – 6 Months" className="bg-[#D9F9DF] text-[#1A1C3B]">3 – 6 Months</option>
                    <option value="Pre-Construction (2026 / 2027)" className="bg-[#D9F9DF] text-[#1A1C3B]">Pre-Construction (2026 / 2027)</option>
                    <option value="Strategic Portfolio Allocation" className="bg-[#D9F9DF] text-[#1A1C3B]">Strategic Portfolio Allocation</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A1C3B]/60 group-focus-within:text-[#1A1C3B] pointer-events-none transition-colors" />
                </div>
              </div>
            </div>

            {/* Custom Notes Modern Textarea */}
            <div>
              <label htmlFor="message" className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1C3B]/70 mb-1.5 font-bold">
                Specific Architectural & Security Requirements
              </label>
              <div className="relative flex items-start bg-[#AEE2FF]/20 border border-[#9FA1FF]/40 focus-within:border-[#9FA1FF] focus-within:ring-1 focus-within:ring-[#9FA1FF]/50 focus-within:bg-white rounded-xl transition-all duration-300 shadow-inner group">
                <div className="pl-4 pt-3.5 pr-2 text-[#9FA1FF] group-focus-within:text-[#1A1C3B] transition-colors pointer-events-none">
                  <MessageSquare size={16} />
                </div>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Share preferred floor levels, yacht slip length requirements, private elevator access, or NDA preferences..."
                  {...register('message')}
                  className="w-full py-3.5 pr-4 bg-transparent text-xs sm:text-sm text-[#1A1C3B] placeholder-[#1A1C3B]/35 focus:outline-none resize-none font-medium"
                />
              </div>
            </div>
          </>
        )}

        {/* NDA Consent Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              {...register('consent')}
              className="mt-1 accent-[#9FA1FF] w-4 h-4 bg-white border-[#9FA1FF] rounded cursor-pointer"
            />
            <span className="text-xs text-[#1A1C3B]/75 group-hover:text-[#1A1C3B] leading-relaxed font-sans font-light transition-colors">
              I acknowledge that Kings Real Estate operates under strict Non-Disclosure Agreement (NDA) confidentiality standards.
            </span>
          </label>
          {errors.consent && (
            <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">{errors.consent.message}</p>
          )}
        </div>

        {/* Modern Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-4 px-8 bg-[#9FA1FF] hover:bg-[#B5BAFF] disabled:opacity-50 text-[#1A1C3B] border border-[#9FA1FF] text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer rounded-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin text-[#1A1C3B]" />
                <span>Transmitting Encrypted Request...</span>
              </>
            ) : (
              <>
                <span>Request Private Consultation</span>
                <Send size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
