'use client';

import { MenuCategory } from '@/lib/types';
import FoodCard from './FoodCard';

interface MenuPageProps {
  categories: MenuCategory[];
}

export default function MenuPage({ categories }: MenuPageProps) {
  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
      }}
    >
      {/* Header */}
      <div className="text-center pt-4 sm:pt-6 pb-2 sm:pb-3 px-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-8 h-[1px] bg-[#d4af37]/60" />
          <div className="w-1.5 h-1.5 rotate-45 border border-[#d4af37]/60" />
          <div className="w-8 h-[1px] bg-[#d4af37]/60" />
        </div>
        <h2
          className="text-sm sm:text-base tracking-[0.15em] uppercase text-[#d4af37]"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}
        >
          Our Menu
        </h2>
      </div>

      {/* Categories */}
      <div className="px-3 sm:px-4 pb-6">
        {categories.map((category) => (
          <div key={category.id} className="mb-4 sm:mb-5">
            {/* Category title */}
            <div className="flex items-center gap-3 mb-2.5 sm:mb-3 px-1">
              <div className="w-6 h-[1px] bg-[#d4af37]" />
              <h3
                className="text-xs sm:text-sm font-bold tracking-[0.12em] uppercase text-[#d4af37]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {category.name}
              </h3>
              <div className="flex-1 h-[1px] bg-[#d4af37]/20" />
            </div>

            {/* Food grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {category.items.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
