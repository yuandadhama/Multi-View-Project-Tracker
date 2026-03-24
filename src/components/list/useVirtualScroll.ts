import { useState, useEffect, useRef, useCallback } from 'react';

const ROW_HEIGHT = 44;
const BUFFER = 5;

export function useVirtualScroll(totalCount: number) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setViewportHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(
    totalCount - 1,
    Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + BUFFER
  );

  return {
    viewportRef,
    handleScroll,
    startIndex,
    endIndex,
    totalHeight: totalCount * ROW_HEIGHT,
    ROW_HEIGHT,
  };
}
