'use client';

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
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

    useImperativeHandle(ref, () => ({
      flipNext: () => bookRef.current?.flipNext(),
      flipPrev: () => bookRef.current?.flipPrev(),
      flipToPage: (page: number) => bookRef.current?.flip(page, 'top'),
      getCurrentPage: () => bookRef.current?.currentPageIndex() ?? 0,
      getPageCount: () => children.length,
    }));

    const handleResize = useCallback(() => {
      if (!bookRef.current || !containerRef.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      bookRef.current.update({ width: vw, height: vh });
    }, []);

    useEffect(() => {
      if (!containerRef.current) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const pageFlip = new PageFlip(containerRef.current, {
        width: vw,
        height: vh,
        size: 'stretch',
        minWidth: 260,
        maxWidth: 900,
        minHeight: 346,
        maxHeight: 1400,
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
            touchAction: 'none',
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flip-page"
              data-density="hard"
              style={{
                backgroundColor: '#111111',
                overflow: 'hidden',
              }}
            >
              {child}
            </div>
          ))}
        </div>


      </>
    );
  }
);

PageFlipBook.displayName = 'PageFlipBook';
export default PageFlipBook;
