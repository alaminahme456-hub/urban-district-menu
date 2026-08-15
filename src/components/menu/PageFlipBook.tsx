'use client';

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import { PageFlip } from 'page-flip';

interface PageFlipBookProps {
  children: React.ReactNode[];
  onFlip?: (e: number) => void;
  startPage?: number;
}

export interface PageFlipBookRef {
  flipNext: () => void;
  flipPrev: () => void;
  flipToPage: (page: number) => void;
  getCurrentPage: () => number;
  getPageCount: () => number;
}

const PageFlipBook = forwardRef<PageFlipBookRef, PageFlipBookProps>(
  ({ children, onFlip, startPage = 0 }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<PageFlip | null>(null);
    const [currentPage, setCurrentPage] = useState(startPage);
    const totalPages = useMemo(() => children.length, [children.length]);

    useImperativeHandle(ref, () => ({
      flipNext: () => bookRef.current?.flipNext(),
      flipPrev: () => bookRef.current?.flipPrev(),
      flipToPage: (page: number) => bookRef.current?.flip(page, 'top'),
      getCurrentPage: () => bookRef.current?.currentPageIndex() ?? 0,
      getPageCount: () => children.length,
    }));

    const handleResize = useCallback(() => {
      if (!bookRef.current || !containerRef.current) return;
      const container = containerRef.current;
      const parent = container.parentElement;
      if (!parent) return;

      const maxW = Math.min(parent.clientWidth - 16, 520);
      const maxH = Math.min(parent.clientHeight - 100, 700);
      const ratio = 3 / 4; // portrait book ratio

      let width = maxW;
      let height = width / ratio;

      if (height > maxH) {
        height = maxH;
        width = height * ratio;
      }

      width = Math.max(width, 260);
      height = Math.max(height, 346);

      bookRef.current.update({ width, height });
    }, []);

    useEffect(() => {
      if (!containerRef.current) return;

      const parent = containerRef.current.parentElement;
      if (!parent) return;

      const maxW = Math.min(parent.clientWidth - 16, 520);
      const maxH = Math.min(parent.clientHeight - 100, 700);
      const ratio = 3 / 4;

      let width = maxW;
      let height = width / ratio;

      if (height > maxH) {
        height = maxH;
        width = height * ratio;
      }

      width = Math.max(width, 260);
      height = Math.max(height, 346);

      const pageFlip = new PageFlip(containerRef.current, {
        width,
        height,
        size: 'stretch',
        minWidth: 260,
        maxWidth: 520,
        minHeight: 346,
        maxHeight: 700,
        showCover: true,
        maxShadowOpacity: 0.5,
        mobileScrollSupport: false,
        swipeDistance: 30,
        showPageCorners: true,
        disableFlipByClick: false,
        useMouseEvents: true,
        useTouchEvents: true,
        flippingTime: 800,
        usePortrait: true,
        startZIndex: 0,
        autoSize: true,
        drawShadow: true,
      });

      pageFlip.loadFromHTML(document.querySelectorAll('.flip-page'));

      pageFlip.on('flip', (e: number) => {
        setCurrentPage(e);
        onFlip?.(e);
      });

      if (startPage > 0) {
        setTimeout(() => pageFlip.flip(startPage, 'top'), 100);
      }

      bookRef.current = pageFlip;

      const handleResizeDebounced = () => {
        requestAnimationFrame(handleResize);
      };

      window.addEventListener('resize', handleResizeDebounced);

      return () => {
        window.removeEventListener('resize', handleResizeDebounced);
        pageFlip.destroy();
        bookRef.current = null;
      };
    }, []);

    return (
      <>
        <div
          ref={containerRef}
          className="page-flip-container"
          style={{
            margin: '0 auto',
            touchAction: 'none',
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flip-page"
              data-density={index === 0 || index === children.length - 1 ? 'hard' : 'soft'}
              style={{
                backgroundColor: '#f8f5ef',
                overflow: 'hidden',
              }}
            >
              {child}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-4 sm:mt-6 px-4">
          <button
            onClick={() => bookRef.current?.flipPrev()}
            disabled={currentPage === 0}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-[10px] sm:text-xs uppercase tracking-wider font-medium transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              color: '#d4af37',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              fontFamily: 'Georgia, serif',
            }}
            aria-label="Previous page"
          >
            ← Prev
          </button>

          <span
            className="text-[10px] sm:text-xs text-white/30 tracking-wider"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={() => bookRef.current?.flipNext()}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-[10px] sm:text-xs uppercase tracking-wider font-medium transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              color: '#d4af37',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              fontFamily: 'Georgia, serif',
            }}
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      </>
    );
  }
);

PageFlipBook.displayName = 'PageFlipBook';
export default PageFlipBook;
