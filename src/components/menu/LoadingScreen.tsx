'use client';

import { useEffect, useState } from 'react';
import { restaurantConfig } from '@/lib/restaurant-config';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(onComplete, 800);
      }, 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#0a1628' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)`,
            }}
          />

          {/* Decorative lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6 px-8 text-center"
          >
            {/* Gold ornamental top */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-[1px] bg-[#d4af37]" />
              <div className="w-2 h-2 rotate-45 border border-[#d4af37]" />
              <div className="w-12 h-[1px] bg-[#d4af37]" />
            </div>

            {/* Restaurant name */}
            <div className="flex flex-col items-center gap-2">
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-[0.3em] text-[#d4af37]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {restaurantConfig.name}
              </h1>
              <div className="w-20 h-[1px] bg-[#d4af37] mt-1" />
              <p
                className="text-sm sm:text-base tracking-[0.2em] text-[#d4af37]/80 mt-1"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {restaurantConfig.tagline}
              </p>
            </div>

            {/* Gold ornamental bottom */}
            <div className="flex items-center gap-3 mt-2">
              <div className="w-8 h-[1px] bg-[#d4af37]/50" />
              <div className="w-1.5 h-1.5 rotate-45 border border-[#d4af37]/50" />
              <div className="w-8 h-[1px] bg-[#d4af37]/50" />
            </div>

            {/* Loading bar */}
            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden mt-6">
              <motion.div
                className="h-full bg-gradient-to-r from-[#d4af37] to-[#f0d060]"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <p className="text-xs text-white/30 tracking-widest uppercase mt-2">
              Loading menu
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
