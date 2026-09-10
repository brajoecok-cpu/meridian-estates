'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ArrowUpRight, MessageCircle } from 'lucide-react';

export function FloatingConciergePill() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleViewingAction = () => {
    const target = document.getElementById('inquire') || document.getElementById('private-viewing');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const nameInput = document.getElementById('name');
        if (nameInput) {
          nameInput.focus({ preventScroll: true });
        }
      }, 500);
    } else {
      window.location.href = '/contact';
    }
  };



  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5"
        >


          {/* Schedule Private Viewing Pill */}
          <button
            onClick={handleViewingAction}
            className="group flex items-center gap-3 px-5 py-3.5 bg-white/95 hover:bg-[#AEE2FF]/40 border border-[#9FA1FF] text-[#1A1C3B] rounded-full shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            aria-label="Schedule Private Viewing"
          >
            <div className="w-2 h-2 rounded-full bg-[#9FA1FF] animate-pulse" />
            
            <div className="flex items-center gap-2">
              <KeyRound size={13} className="text-[#9FA1FF]" />
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#1A1C3B]">
                Private Viewing
              </span>
            </div>

            <div className="w-6 h-6 rounded-full bg-[#9FA1FF] group-hover:bg-[#B5BAFF] text-[#1A1C3B] flex items-center justify-center transition-colors ml-1 font-bold">
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
