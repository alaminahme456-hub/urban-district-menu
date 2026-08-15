'use client';

import { restaurantConfig } from '@/lib/restaurant-config';

export default function BackCoverPage() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative"
      style={{ background: '#000000' }}
    >
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 60%)`,
        }}
      />

      {/* Border frame */}
      <div className="absolute inset-3 sm:inset-4 border border-[#d4af37]/20 rounded-sm">
        <div className="absolute inset-1 border border-[#d4af37]/10 rounded-sm" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-6 text-center">
        {/* Top ornament */}
        <div className="flex items-center gap-3">
          <div className="w-10 sm:w-12 h-[1px] bg-[#d4af37]/40" />
          <div className="w-1.5 h-1.5 rotate-45 border border-[#d4af37]/40" />
          <div className="w-10 sm:w-12 h-[1px] bg-[#d4af37]/40" />
        </div>

        <h1
          className="text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#d4af37]/60"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {restaurantConfig.name}
        </h1>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />

        <p
          className="text-[10px] sm:text-xs tracking-[0.15em] text-white/25 uppercase"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {restaurantConfig.tagline}
        </p>

        <div className="flex flex-col items-center gap-1.5 mt-4">
          <p className="text-[10px] text-white/20">Follow us</p>
          <p className="text-xs text-[#d4af37]/50 font-semibold">{restaurantConfig.social}</p>
          <p className="text-[10px] text-white/20 mt-1">{restaurantConfig.email}</p>
        </div>

        {/* Bottom ornament */}
        <div className="flex items-center gap-3 mt-6">
          <div className="w-6 h-[1px] bg-[#d4af37]/30" />
          <div className="w-1 h-1 rotate-45 border border-[#d4af37]/30" />
          <div className="w-6 h-[1px] bg-[#d4af37]/30" />
        </div>
      </div>
    </div>
  );
}
