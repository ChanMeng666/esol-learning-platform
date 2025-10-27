"use client";

import { useCallback, useEffect, useMemo, useRef, useState, memo, ReactNode } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { debounce, throttle } from "@/lib/utils";

/**
 * Virtual List Component for rendering large datasets efficiently
 */
interface VirtualListProps<T> {
  items: T[];
  height: number; // Container height
  itemHeight: number | ((index: number) => number); // Fixed or dynamic item height
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number; // Number of items to render outside visible area
  onEndReached?: () => void; // Callback when end is reached (for infinite scroll)
  endReachedThreshold?: number; // Pixels from end to trigger onEndReached
  className?: string;
  loading?: boolean;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  onEndReached,
  endReachedThreshold = 100,
  className,
  loading = false
}: VirtualListProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Calculate item heights
  const getItemHeight = useCallback(
    (index: number) => {
      return typeof itemHeight === "function" ? itemHeight(index) : itemHeight;
    },
    [itemHeight]
  );

  // Calculate total height and item positions
  const { totalHeight, itemPositions } = useMemo(() => {
    let total = 0;
    const positions: number[] = [];

    for (let i = 0; i < items.length; i++) {
      positions.push(total);
      total += getItemHeight(i);
    }

    return { totalHeight: total, itemPositions: positions };
  }, [items, getItemHeight]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = itemPositions.findIndex((pos) => pos + getItemHeight(itemPositions.indexOf(pos)) > scrollTop);
    const end = itemPositions.findIndex((pos) => pos > scrollTop + height);

    return {
      start: Math.max(0, start - overscan),
      end: end === -1 ? items.length : Math.min(items.length, end + overscan)
    };
  }, [scrollTop, height, itemPositions, getItemHeight, overscan, items.length]);

  // Handle scroll with throttling
  const handleScroll = useCallback(
    throttle(() => {
      if (!scrollRef.current) return;

      const newScrollTop = scrollRef.current.scrollTop;
      setScrollTop(newScrollTop);
      setIsScrolling(true);

      // Check if end reached
      if (onEndReached && !loading) {
        const scrollBottom = newScrollTop + height;
        if (scrollBottom >= totalHeight - endReachedThreshold) {
          onEndReached();
        }
      }

      // Reset scrolling state after delay
      setTimeout(() => setIsScrolling(false), 150);
    }, 50),
    [height, totalHeight, endReachedThreshold, onEndReached, loading]
  );

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Visible items
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div
      ref={scrollRef}
      className={className}
      style={{ height, overflow: "auto" }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item, idx) => {
          const actualIndex = visibleRange.start + idx;
          const top = itemPositions[actualIndex];
          const height = getItemHeight(actualIndex);

          return (
            <div
              key={actualIndex}
              style={{
                position: "absolute",
                top,
                left: 0,
                right: 0,
                height
              }}
            >
              {isScrolling ? (
                <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-full rounded" />
              ) : (
                renderItem(item, actualIndex)
              )}
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      )}
    </div>
  );
}

/**
 * Lazy Load Component with Intersection Observer
 */
interface LazyLoadProps {
  children: ReactNode;
  height?: number;
  offset?: string;
  placeholder?: ReactNode;
  onVisible?: () => void;
}

export const LazyLoad = memo(({
  children,
  height = 200,
  offset = "100px",
  placeholder,
  onVisible
}: LazyLoadProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    target: ref,
    onIntersect: () => {
      setIsVisible(true);
      onVisible?.();
    },
    threshold: 0.1,
    rootMargin: offset
  });

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {isVisible ? children : placeholder || (
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-full rounded" />
      )}
    </div>
  );
});

LazyLoad.displayName = "LazyLoad";

/**
 * Data Pagination Hook
 */
interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  currentPage?: number;
}

export function usePagination({
  totalItems,
  itemsPerPage,
  currentPage: initialPage = 1
}: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
}

/**
 * Infinite Scroll Hook
 */
interface UseInfiniteScrollOptions<T> {
  fetchMore: (page: number) => Promise<T[]>;
  initialData?: T[];
  pageSize?: number;
}

export function useInfiniteScroll<T>({
  fetchMore,
  initialData = [],
  pageSize = 20
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchMore(page);

      if (newItems.length < pageSize) {
        setHasMore(false);
      }

      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to fetch more items:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchMore, page, pageSize, loading, hasMore]);

  const reset = useCallback(() => {
    setItems(initialData);
    setPage(1);
    setHasMore(true);
    setLoading(false);
  }, [initialData]);

  return {
    items,
    loading,
    hasMore,
    loadMore,
    reset
  };
}

/**
 * Memoized List Item Component
 */
interface MemoizedListItemProps<T> {
  item: T;
  renderItem: (item: T) => ReactNode;
  isSelected?: boolean;
  onClick?: (item: T) => void;
}

export const MemoizedListItem = memo(
  <T extends any>({
    item,
    renderItem,
    isSelected = false,
    onClick
  }: MemoizedListItemProps<T>) => {
    const handleClick = useCallback(() => {
      onClick?.(item);
    }, [item, onClick]);

    return (
      <div
        className={`transition-colors ${isSelected ? "bg-primary/10" : ""}`}
        onClick={handleClick}
      >
        {renderItem(item)}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for re-rendering optimization
    return (
      prevProps.item === nextProps.item &&
      prevProps.isSelected === nextProps.isSelected
    );
  }
);

MemoizedListItem.displayName = "MemoizedListItem";

/**
 * Batch Update Hook for optimizing multiple state updates
 */
export function useBatchUpdate<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<Partial<T>[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((update: Partial<T>) => {
    pendingUpdates.current.push(update);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to batch updates
    timeoutRef.current = setTimeout(() => {
      if (pendingUpdates.current.length > 0) {
        setState((prevState) => {
          const merged = pendingUpdates.current.reduce(
            (acc, update) => ({ ...acc, ...update }),
            {}
          );
          pendingUpdates.current = [];
          return { ...prevState, ...merged };
        });
      }
    }, 50);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, batchUpdate] as const;
}

/**
 * Web Worker for heavy computations
 */
export class DataProcessor {
  private worker: Worker | null = null;

  constructor() {
    if (typeof window !== "undefined" && window.Worker) {
      // Create worker from string to avoid separate file
      const workerScript = `
        self.onmessage = function(e) {
          const { type, data } = e.data;

          switch(type) {
            case 'sort':
              const sorted = data.items.sort((a, b) => {
                const aVal = a[data.key];
                const bVal = b[data.key];
                return data.ascending ?
                  (aVal > bVal ? 1 : -1) :
                  (aVal < bVal ? 1 : -1);
              });
              self.postMessage({ type: 'sorted', data: sorted });
              break;

            case 'filter':
              const filtered = data.items.filter(item => {
                return data.filters.every(filter => {
                  const value = item[filter.field];
                  switch(filter.operator) {
                    case 'equals':
                      return value === filter.value;
                    case 'contains':
                      return value?.toLowerCase().includes(filter.value?.toLowerCase());
                    case 'gt':
                      return value > filter.value;
                    case 'lt':
                      return value < filter.value;
                    default:
                      return true;
                  }
                });
              });
              self.postMessage({ type: 'filtered', data: filtered });
              break;

            case 'aggregate':
              const aggregated = data.items.reduce((acc, item) => {
                const key = item[data.groupBy];
                if (!acc[key]) {
                  acc[key] = { count: 0, sum: 0, items: [] };
                }
                acc[key].count++;
                acc[key].sum += item[data.sumField] || 0;
                acc[key].items.push(item);
                return acc;
              }, {});
              self.postMessage({ type: 'aggregated', data: aggregated });
              break;
          }
        };
      `;

      const blob = new Blob([workerScript], { type: "application/javascript" });
      this.worker = new Worker(URL.createObjectURL(blob));
    }
  }

  async process<T>(type: string, data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error("Web Worker not supported"));
        return;
      }

      const handleMessage = (e: MessageEvent) => {
        this.worker?.removeEventListener("message", handleMessage);
        resolve(e.data.data);
      };

      const handleError = (e: ErrorEvent) => {
        this.worker?.removeEventListener("error", handleError);
        reject(e.error);
      };

      this.worker.addEventListener("message", handleMessage);
      this.worker.addEventListener("error", handleError);
      this.worker.postMessage({ type, data });
    });
  }

  terminate() {
    this.worker?.terminate();
  }
}

/**
 * Cache Manager for frequently accessed data
 */
export class CacheManager<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}