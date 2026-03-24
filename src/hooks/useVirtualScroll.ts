import { useState, useRef, useEffect, useCallback } from 'react';

const ROW_HEIGHT = 44;
const BUFFER = 5;

export function useVirtualScroll(totalCount: number) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewHeight, setViewHeight] = useState(600);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setViewHeight(entries[0].contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = totalCount * ROW_HEIGHT;
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIdx = Math.min(
    totalCount - 1,
    Math.ceil((scrollTop + viewHeight) / ROW_HEIGHT) + BUFFER
  );

  return {
    viewportRef,
    handleScroll,
    totalHeight,
    startIdx,
    endIdx,
    rowHeight: ROW_HEIGHT,
    visibleCount: endIdx - startIdx + 1,
  };
}
