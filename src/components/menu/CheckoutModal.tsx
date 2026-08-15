'use client';

import { useState } from 'react';
import { useOrderStore } from '@/store/order-store';
import { formatPrice, generateWhatsAppMessage, getWhatsAppLink } from '@/lib/restaurant-config';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Edit2, User, Hash, MessageSquare } from 'lucide-react';

interface CheckoutModalProps {
  tableNumber?: string;
}

export default function CheckoutModal({ tableNumber }: CheckoutModalProps) {
  const {
    items,
    isCheckoutOpen,
    setCheckoutOpen,
    setBasketOpen,
    customerDetails,
    setCustomerDetails,
    clearOrder,
    getTotal,
  } = useOrderStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState(customerDetails.name);
  const [specialInstructions, setSpecialInstructions] = useState(customerDetails.specialInstructions);
  const [currentTable] = useState(tableNumber || customerDetails.tableNumber || '');

  const total = getTotal();

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    const details = {
      name: customerName,
      tableNumber: currentTable,
      specialInstructions,
    };

    setCustomerDetails(details);

    const orderItems = items.map((item) => ({
      name: item.menuItem.name,
      quantity: item.quantity,
      price: item.menuItem.price * item.quantity,
    }));

    const message = generateWhatsAppMessage(orderItems, total, details);
    const whatsappLink = getWhatsAppLink(message);

    // Small delay for UX
    setTimeout(() => {
      window.open(whatsappLink, '_blank');
      setIsProcessing(false);
      clearOrder();
      setCheckoutOpen(false);
    }, 500);
  };

  const handleEditOrder = () => {
    setCheckoutOpen(false);
    setTimeout(() => setBasketOpen(true), 300);
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCheckoutOpen(false)}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[90] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: '#000000',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            {/* Header */}
            <div className="relative px-5 pt-5 pb-3 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h2
                  className="text-lg font-bold text-[#d4af37] tracking-wider uppercase"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Confirm Order
                </h2>
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X size={16} className="text-white/60" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Order items */}
              <div className="mb-4">
                {items.map((orderItem) => (
                  <div
                    key={orderItem.menuItem.id}
                    className="flex items-center justify-between py-2 border-b border-white/5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate" style={{ fontFamily: 'Georgia, serif' }}>
                        {orderItem.menuItem.name}
                      </p>
                      <p className="text-xs text-white/40">
                        {orderItem.quantity} × {formatPrice(orderItem.menuItem.price)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#d4af37]" style={{ fontFamily: 'Georgia, serif' }}>
                      {formatPrice(orderItem.menuItem.price * orderItem.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-3 border-t border-[#d4af37]/20 mb-4">
                <span className="text-xs text-white/40 uppercase tracking-wider">Total</span>
                <span className="text-xl font-bold text-[#d4af37]" style={{ fontFamily: 'Georgia, serif' }}>
                  {formatPrice(total)}
                </span>
              </div>

              {/* Customer form */}
              <div className="space-y-3">
                {/* Customer Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                    <User size={12} />
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/20 outline-none focus:ring-1 focus:ring-[#d4af37]/50 transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  />
                </div>

                {/* Table Number */}
                {currentTable && (
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                      <Hash size={12} />
                      Table Number
                    </label>
                    <div
                      className="w-full px-3 py-2.5 rounded-lg text-sm text-[#d4af37] font-semibold"
                      style={{
                        background: 'rgba(212, 175, 55, 0.08)',
                        border: '1px solid rgba(212, 175, 55, 0.15)',
                        fontFamily: 'Georgia, serif',
                      }}
                    >
                      Table {currentTable}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                    <MessageSquare size={12} />
                    Special Instructions
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requests..."
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-white/20 outline-none focus:ring-1 focus:ring-[#d4af37]/50 transition-all resize-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 pt-2 flex gap-3">
              <button
                onClick={handleEditOrder}
                className="flex-1 py-3 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors duration-200 bg-white/5 hover:bg-white/10 text-white/60"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <Edit2 size={13} />
                Edit Order
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className="flex-[2] py-3 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#fff',
                  fontFamily: 'Georgia, serif',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                }}
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <MessageCircle size={14} />
                    Confirm & Order
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
