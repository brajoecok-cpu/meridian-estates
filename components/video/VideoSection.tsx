'use client';

import React, { useEffect, useRef } from 'react';
import { VideoBackground, VideoBackgroundProps } from './VideoBackground';
import { motion } from 'framer-motion';
import { trackRoomRevealView } from '@/lib/analytics';

export interface VideoSectionProps extends VideoBackgroundProps {
  id?: string;
  minHeight?: string;
  align?: 'center' | 'left' | 'right' | 'split';
  contentClassName?: string;
  showScrollCue?: boolean;
  propertySlug?: string;
}

export function VideoSection({
  id,
  minHeight = 'min-h-screen',
  align = 'center',
  contentClassName = '',
  showScrollCue = false,
  propertySlug,
  children,
  ...videoProps
}: VideoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!id || !propertySlug) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackRoomRevealView(propertySlug, id);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [id, propertySlug]);
  const getAlignmentClasses = () => {
    switch (align) {
      case 'left':
        return 'justify-center items-start text-left max-w-2xl px-6 md:px-16 lg:px-24';
      case 'right':
        return 'justify-center items-end text-right max-w-2xl ml-auto px-6 md:px-16 lg:px-24';
      case 'split':
        return 'justify-center items-center px-6 md:px-12 max-w-7xl mx-auto';
      case 'center':
      default:
        return 'justify-center items-center text-center max-w-4xl mx-auto px-6';
    }
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative w-full ${minHeight} flex flex-col justify-between overflow-hidden`}
    >
      <VideoBackground {...videoProps} className="absolute inset-0 w-full h-full">
        <div
          className={`w-full flex-1 flex flex-col ${getAlignmentClasses()} ${contentClassName} py-24 md:py-32`}
        >
          {children}
        </div>

        {/* Optional Architectural Scroll Indicator */}
        {showScrollCue && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-30"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/80 font-bold">
              Explore Residence
            </span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-[#9FA1FF] to-transparent" />
          </motion.div>
        )}
      </VideoBackground>
    </section>
  );
}
