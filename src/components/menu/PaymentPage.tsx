'use client';

import { useState, useCallback } from 'react';
import { restaurantConfig, getWhatsAppLink, generateWhatsAppMessage } from '@/lib/restaurant-config';
import { useOrderStore } from '@/store/order-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ShieldAlert, MessageCircle, ArrowLeft } from 'lucide-react';

interface PaymentPageProps {
  tableNumber?: string;
}

export default function PaymentPage({ tableNumber }: PaymentPageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const items = useOrderStore((s) => s.items);
  const customerDetails = useOrderStore((s) => s.customerDetails);
  const getTotal = useOrderStore((s) => s.getTotal);

  const paymentConfig = restaurantConfig.paymentConfig;

  const handleCopy = useCallback(async (accountNumber: string, accountId: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedId(accountId);
      setShowCopiedNotification(true);
      setTimeout(() => {
        setCopiedId(null);
        setShowCopiedNotification(false);
      }, 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = accountNumber;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(accountId);
      setShowCopiedNotification(true);
      setTimeout(() => {
        setCopiedId(null);
        setShowCopiedNotification(false);
      }, 2000);
    }
  }, []);

  const handleSendPaymentProof = useCallback(() => {
    const total = getTotal();
    const orderItems = items.map((i) => ({
      name: i.menuItem.name,
      quantity: i.quantity,
      price: i.menuItem.price,
    }));

    let message = paymentConfig?.paymentProofMessage || '';

    if (orderItems.length > 0) {
      message += '\n\nOrder:\n';
      orderItems.forEach((item) => {
        message += `${item.quantity}\u00d7 ${item.name} \u2014 ${restaurantConfig.currency}${item.price.toLocaleString()}\n`;
      });
      message += `\nTotal: ${restaurantConfig.currency}${total.toLocaleString()}`;
    }

    if (customerDetails.name) {
      message += `\n\nName: ${customerDetails.name}`;
    }
    if (tableNumber) {
      message += `\nTable: ${tableNumber}`;
    }
    if (customerDetails.specialInstructions) {
      message += `\nSpecial Instructions: ${customerDetails.specialInstructions}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const link = getWhatsAppLink(encodedMessage);
    window.open(link, '_blank');
  }, [items, customerDetails, getTotal, tableNumber, paymentConfig]);

  return (
    <div
      className="w-full h-full overflow-y-auto custom-scrollbar"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
      }}
    >
      {/* Copied notification */}
      <AnimatePresence>
        {showCopiedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-md text-xs font-semibold tracking-wider"
            style={{
              background: '#d4af37',
              color: '#000000',
              fontFamily: 'Georgia, serif',
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
            }}
          >
            Account number copied!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation overlay */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center"
            style={{ background: 'rgba(0, 0, 0, 0.92)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="mx-6 p-6 rounded-xl text-center max-w-[300px]"
              style={{
                background: '#111111',
                border: '1px solid rgba(212, 175, 55, 0.25)',
              }}
            >
              <h3
                className="text-base font-bold tracking-wider text-[#d4af37] mb-3"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Payment Made?
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-6">
                Please ensure you have transferred to the correct Urban District account before continuing.
              </p>
              <div className="flex flex-col gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSendPaymentProof}
                  className="w-full py-3 rounded-lg text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: '#ffffff',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  <MessageCircle size={14} />
                  Yes, I Have Paid
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-3 rounded-lg text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2"
                  style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    color: '#d4af37',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  <ArrowLeft size={14} />
                  Go Back
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center pt-4 pb-2 px-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-8 h-[1px] bg-[#d4af37]/60" />
          <div className="w-1.5 h-1.5 rotate-45 border border-[#d4af37]/60" />
          <div className="w-8 h-[1px] bg-[#d4af37]/60" />
        </div>
        <h2
          className="text-sm tracking-[0.15em] uppercase text-[#d4af37]"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}
        >
          Payment Information
        </h2>
      </div>

      {/* Subtitle */}
      <div className="px-4 pb-3 text-center">
        <p className="text-[10px] text-white/40 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
          Kindly transfer only to the official Urban District accounts below.
        </p>
      </div>

      {/* Bank Account Cards */}
      <div className="px-3 pb-4 flex flex-col gap-3">
        {paymentConfig?.bankAccounts.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl overflow-hidden"
            style={{
              background: '#111111',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Card header */}
            <div
              className="px-4 py-2.5 flex items-center justify-between"
              style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(212, 175, 55, 0.05))',
                borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
              }}
            >
              <span
                className="text-[10px] tracking-[0.15em] uppercase text-[#d4af37]/60"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Bank
              </span>
              <span
                className="text-xs font-bold text-[#d4af37]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {account.bankName}
              </span>
            </div>

            {/* Card body */}
            <div className="px-4 py-3 flex flex-col gap-2.5">
              {/* Account Number */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] tracking-[0.1em] uppercase text-white/30"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Account Number
                </span>
                <span
                  className="text-base font-bold text-white tracking-widest"
                  style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.12em' }}
                >
                  {account.accountNumber}
                </span>
              </div>

              {/* Account Name */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] tracking-[0.1em] uppercase text-white/30"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Account Name
                </span>
                <span
                  className="text-xs font-semibold text-white/80"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {account.accountName}
                </span>
              </div>

              {/* Copy Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCopy(account.accountNumber, account.id)}
                className="w-full mt-1 py-2.5 rounded-lg text-[10px] font-bold tracking-[0.12em] uppercase flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: copiedId === account.id ? '#d4af37' : 'rgba(212, 175, 55, 0.08)',
                  color: copiedId === account.id ? '#000000' : '#d4af37',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  fontFamily: 'Georgia, serif',
                }}
              >
                {copiedId === account.id ? (
                  <>
                    <Check size={12} />
                    Copied &#10003;
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy Account Number
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Warning Section */}
      <div className="px-3 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-xl p-4"
          style={{
            background: 'rgba(180, 30, 30, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <div className="flex items-start gap-2.5">
            <ShieldAlert size={16} className="text-[#d4af37] mt-0.5 flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <h4
                className="text-xs font-bold tracking-wider uppercase text-[#d4af37]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Important
              </h4>
              <p className="text-[10px] text-white/50 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                {paymentConfig?.warningMessage}
              </p>
              <p className="text-[10px] text-[#d4af37]/60 leading-relaxed mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                {paymentConfig?.secondaryWarning}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Confirmation Button */}
      <div className="px-3 pb-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowConfirm(true)}
          className="w-full py-3.5 rounded-xl text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #d4af37, #b8962e)',
            color: '#000000',
            fontFamily: 'Georgia, serif',
            boxShadow: '0 4px 24px rgba(212, 175, 55, 0.25)',
          }}
        >
          I Have Made Payment
        </motion.button>
      </div>
    </div>
  );
}
