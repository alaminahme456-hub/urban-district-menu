'use client';

import { restaurantConfig } from '@/lib/restaurant-config';
import { motion } from 'framer-motion';

interface CoverPageProps {
  onOpenMenu: () => void;
}

export default function CoverPage({ onOpenMenu }: CoverPageProps) {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#000000' }}
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/menu-images/cover-bg.png)' }}
      />

      {/* Radial gold glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Border frame */}
      <div className="absolute inset-3 sm:inset-4 border border-[#d4af37]/30 rounded-sm">
        <div className="absolute inset-1 border border-[#d4af37]/15 rounded-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:gap-6 px-6 text-center">
        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 sm:w-16 h-[1px] bg-[#d4af37]" />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="sm:w-5 sm:h-5">
            <path d="M8 0L16 8L8 16L0 8L8 0Z" stroke="#d4af37" strokeWidth="1" />
            <path d="M8 3L13 8L8 13L3 8L8 3Z" stroke="#d4af37" strokeWidth="0.5" />
          </svg>
          <div className="w-10 sm:w-16 h-[1px] bg-[#d4af37]" />
        </motion.div>

        {/* Restaurant name */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.25em] sm:tracking-[0.3em] text-[#d4af37]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {restaurantConfig.coverTitle}
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-24 sm:w-32 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base sm:text-lg md:text-xl tracking-[0.15em] sm:tracking-[0.2em] text-[#d4af37]/80 uppercase"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {restaurantConfig.coverSubtitle}
        </motion.p>

        {/* Tagline quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-xs sm:text-sm text-white/40 italic max-w-[200px] sm:max-w-[280px] leading-relaxed mt-1"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          &ldquo;{restaurantConfig.coverTagline}&rdquo;
        </motion.p>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex items-center gap-3 mt-2"
        >
          <div className="w-8 h-[1px] bg-[#d4af37]/50" />
          <div className="w-1.5 h-1.5 rotate-45 border border-[#d4af37]/50" />
          <div className="w-8 h-[1px] bg-[#d4af37]/50" />
        </motion.div>

        {/* Open Menu Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenMenu}
          className="mt-6 sm:mt-8 px-8 sm:px-12 py-3 sm:py-4 bg-[#d4af37] text-[#000000] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-[#e8c94a] transition-colors duration-300 shadow-lg shadow-[#d4af37]/20"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          OPEN MENU
        </motion.button>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex flex-col items-center gap-1 mt-4 sm:mt-6"
        >
          <a
            href={restaurantConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] sm:text-xs text-white/25 tracking-wider hover:text-[#d4af37]/50 transition-colors"
          >
            {restaurantConfig.instagramUrl}
          </a>
          <p className="text-[10px] sm:text-xs text-white/25 tracking-wider">
            {restaurantConfig.email}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
