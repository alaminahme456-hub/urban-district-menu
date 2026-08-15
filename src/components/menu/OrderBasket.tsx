'use client';

import { useOrderStore } from '@/store/order-store';
import { formatPrice } from '@/lib/restaurant-config';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';

export default function OrderBasket() {
  const {
    items,
    isBasketOpen,
    setBasketOpen,
    updateQuantity,
    removeItem,
    getTotal,
    getItemCount,
    setCheckoutOpen,
  } = useOrderStore();

  const total = getTotal();
  const count = getItemCount();

  return (
    <>
      {/* Floating basket button */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBasketOpen(true)}
            className="fixed bottom-4 right-4 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #b8941e 100%)',
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
            }}
            aria-label="View order basket"
          >
            <ShoppingCart size={22} className="text-[#000000]" />
            {/* Badge */}
            <motion.span
              key={count}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold"
              style={{
                background: '#c0392b',
                color: '#fff',
                fontFamily: 'Georgia, serif',
              }}
            >
              {count}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mini total bar when basket has items */}
      <AnimatePresence>
        {items.length > 0 && !isBasketOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-20 sm:right-24 z-40"
          >
            <div
              className="px-4 py-3 rounded-xl flex items-center justify-between backdrop-blur-md shadow-lg"
              style={{
                background: 'rgba(0, 0, 0, 0.92)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}
            >
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Total</p>
                <p className="text-sm font-bold text-[#d4af37]" style={{ fontFamily: 'Georgia, serif' }}>
                  {formatPrice(total)}
                </p>
              </div>
              <p className="text-xs text-white/50">{count} item{count > 1 ? 's' : ''}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Basket drawer */}
      <AnimatePresence>
        {isBasketOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBasketOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-2xl overflow-hidden"
              style={{
                background: '#000000',
                maxHeight: '85vh',
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3">
                <h2
                  className="text-lg font-bold text-[#d4af37] tracking-wider uppercase"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Your Order
                </h2>
                <button
                  onClick={() => setBasketOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Close basket"
                >
                  <X size={16} className="text-white/60" />
                </button>
              </div>

              {/* Items list */}
              <div className="px-5 pb-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                {items.map((orderItem) => (
                  <div
                    key={orderItem.menuItem.id}
                    className="flex items-center gap-3 py-3 border-b border-white/5"
                  >
                    {/* Image thumbnail */}
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={orderItem.menuItem.image}
                        alt={orderItem.menuItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold text-white/90 truncate"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {orderItem.menuItem.name}
                      </p>
                      <p className="text-xs text-[#d4af37]" style={{ fontFamily: 'Georgia, serif' }}>
                        {formatPrice(orderItem.menuItem.price * orderItem.quantity)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(orderItem.menuItem.id, orderItem.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                        aria-label="Decrease"
                      >
                        {orderItem.quantity === 1 ? (
                          <Trash2 size={12} className="text-red-400" />
                        ) : (
                          <Minus size={12} className="text-white/60" />
                        )}
                      </button>
                      <span
                        className="text-sm font-bold text-white min-w-[16px] text-center"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {orderItem.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(orderItem.menuItem.id, orderItem.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                        aria-label="Increase"
                      >
                        <Plus size={12} className="text-white/60" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and checkout */}
              <div className="px-5 pb-6 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-white/40 uppercase tracking-wider">Total</span>
                  <span
                    className="text-xl font-bold text-[#d4af37]"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setBasketOpen(false);
                    setCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: '#fff',
                    fontFamily: 'Georgia, serif',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                  }}
                >
                  <MessageCircle size={18} />
                  Order on WhatsApp
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
