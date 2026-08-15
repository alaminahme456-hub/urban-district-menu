'use client';

import { useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/menu/LoadingScreen';
import CoverPage from '@/components/menu/CoverPage';
import BackCoverPage from '@/components/menu/BackCoverPage';
import MenuPage from '@/components/menu/MenuPage';
import OrderBasket from '@/components/menu/OrderBasket';
import CheckoutModal from '@/components/menu/CheckoutModal';
import { menuConfig } from '@/lib/restaurant-config';
import { MenuCategory } from '@/lib/types';
import { PageFlipBookRef } from '@/components/menu/PageFlipBook';

// Dynamically import PageFlipBook to avoid SSR issues
const PageFlipBook = dynamic(
  () => import('@/components/menu/PageFlipBook'),
  { ssr: false }
);

function MenuContent() {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table') || undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const bookRef = useRef<PageFlipBookRef>(null);
  const [mounted] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleOpenMenu = useCallback(() => {
    setIsMenuOpen(true);
    setTimeout(() => {
      bookRef.current?.flipNext();
    }, 200);
  }, []);

  // Split menu items into pages (max 3 items per page for good readability)
  const mainMeals = menuConfig.categories.find(c => c.id === 'main-meals');
  const drinks = menuConfig.categories.find(c => c.id === 'drinks');

  // Build a list of category arrays, one per page
  const menuPages: MenuCategory[][] = [];
  if (mainMeals) {
    const items = mainMeals.items;
    for (let i = 0; i < items.length; i += 3) {
      menuPages.push([{ ...mainMeals, items: items.slice(i, i + 3) }]);
    }
  }
  if (drinks) {
    menuPages.push([drinks]);
  }

  // Build pages
  const pages: React.ReactNode[] = [
    // Cover
    <CoverPage key="cover" onOpenMenu={handleOpenMenu} />,
  ];

  // Menu pages
  menuPages.forEach((pageCategories, i) => {
    pages.push(<MenuPage key={`menu-${i}`} categories={pageCategories} />);
  });

  // Back cover
  pages.push(<BackCoverPage key="back" />);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Main content */}
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        {/* Subtle ambient light effect */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.03) 0%, transparent 70%)',
          }}
        />

        {/* Table indicator */}
        {tableNumber && (
          <div
            className="fixed top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider backdrop-blur-md"
            style={{
              background: 'rgba(212, 175, 55, 0.15)',
              color: '#d4af37',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              fontFamily: 'Georgia, serif',
            }}
          >
            TABLE {tableNumber}
          </div>
        )}

        {/* Book container */}
        <div className="flex-1 w-full flex items-center justify-center px-2 py-2 sm:px-4 sm:py-4">
          <Suspense
            fallback={
              <div className="w-[300px] h-[400px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
              </div>
            }
          >
            <PageFlipBook ref={bookRef} startPage={0}>
              {pages}
            </PageFlipBook>
          </Suspense>
        </div>
      </div>

      {/* Order Basket */}
      <OrderBasket />

      {/* Checkout Modal */}
      <CheckoutModal tableNumber={tableNumber} />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#000000' }}
      >
        <div className="w-8 h-8 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
