'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';
import { formatPrice } from '@/lib/restaurant-config';
import { useOrderStore } from '@/store/order-store';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
}

export default function FoodCard({ item }: FoodCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { items, addItem, updateQuantity } = useOrderStore();

  const orderItem = items.find((i) => i.menuItem.id === item.id);
  const quantity = orderItem?.quantity || 0;

  const handleAddToOrder = () => {
    if (!item.available) return;
    addItem(item);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (!item.available) return;
    addItem(item);
  };

  return (
    <div
      className={`relative flex flex-col rounded-xl overflow-hidden ${
        !item.available ? 'opacity-60' : ''
      }`}
      style={{
        background: item.available ? '#111111' : '#0a0a0a',
        border: item.available ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-xl">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 33vw"
          loading="lazy"
        />
        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Sold Out badge */}
        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span
              className="px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-sm"
              style={{
                background: '#8b0000',
                color: '#fff',
                fontFamily: 'Georgia, serif',
              }}
            >
              Sold Out
            </span>
          </div>
        )}

        {/* Price badge */}
        <div
          className="absolute top-2 right-2 px-2.5 py-1 rounded-sm text-xs font-bold"
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            color: '#d4af37',
            fontFamily: 'Georgia, serif',
            backdropFilter: 'blur(4px)',
          }}
        >
          {formatPrice(item.price)}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <h3
          className="text-xs sm:text-sm font-bold text-[#ffffff] leading-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {item.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Action button */}
      <div className="px-3 pb-3">
        {quantity === 0 ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToOrder}
            disabled={!item.available}
            className="w-full py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors duration-200"
            style={{
              background: item.available ? '#d4af37' : '#2a3654',
              color: item.available ? '#000000' : '#555',
              fontFamily: 'Georgia, serif',
            }}
          >
            <ShoppingCart size={13} />
            Add to Order
          </motion.button>
        ) : (
          <div className="flex items-center justify-between rounded-lg overflow-hidden" style={{ background: '#000000' }}>
            <button
              onClick={handleDecrease}
              className="w-10 h-10 flex items-center justify-center text-[#d4af37] hover:bg-white/5 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <AnimatePresence mode="wait">
              <motion.span
                key={quantity}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="text-sm font-bold text-[#d4af37] min-w-[20px] text-center"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {quantity}
              </motion.span>
            </AnimatePresence>
            <button
              onClick={handleIncrease}
              className="w-10 h-10 flex items-center justify-center text-[#d4af37] hover:bg-white/5 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Add feedback animation */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#d4af37', color: '#000000' }}>
              Added!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
