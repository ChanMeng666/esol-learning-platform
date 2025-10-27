import { useEffect, useState, useRef, RefObject } from 'react';

/**
 * Container size breakpoints
 */
export const CONTAINER_BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof CONTAINER_BREAKPOINTS;

/**
 * Container size information
 */
interface ContainerSize {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
  isSmUp: boolean;
  isMdUp: boolean;
  isLgUp: boolean;
  isXlUp: boolean;
  is2xlUp: boolean;
  isSmDown: boolean;
  isMdDown: boolean;
  isLgDown: boolean;
  isXlDown: boolean;
}

/**
 * Options for useContainerQuery hook
 */
interface UseContainerQueryOptions {
  /**
   * Enable observing width changes
   */
  observeWidth?: boolean;
  /**
   * Enable observing height changes
   */
  observeHeight?: boolean;
  /**
   * Debounce delay in milliseconds
   */
  debounce?: number;
  /**
   * Custom breakpoints
   */
  breakpoints?: Partial<Record<Breakpoint, number>>;
}

/**
 * Hook to observe container size changes and provide responsive utilities
 * @param ref - Reference to the container element
 * @param options - Configuration options
 * @returns Container size information and utilities
 */
export function useContainerQuery<T extends HTMLElement>(
  ref?: RefObject<T>,
  options: UseContainerQueryOptions = {}
): ContainerSize & {
  ref: RefObject<T | null>;
  cn: (...classes: Array<string | false | undefined | null>) => string;
  when: (breakpoint: Breakpoint | `${Breakpoint}-up` | `${Breakpoint}-down`, className: string) => string;
} {
  const {
    observeWidth = true,
    observeHeight = false,
    debounce = 0,
    breakpoints = CONTAINER_BREAKPOINTS,
  } = options;

  const internalRef = useRef<T | null>(null);
  const containerRef = ref || internalRef;
  const [size, setSize] = useState<ContainerSize>(() => getInitialSize());
  const timeoutRef = useRef<number>();

  /**
   * Get initial size state
   */
  function getInitialSize(): ContainerSize {
    return {
      width: 0,
      height: 0,
      breakpoint: 'xs',
      isXs: true,
      isSm: false,
      isMd: false,
      isLg: false,
      isXl: false,
      is2xl: false,
      isSmUp: false,
      isMdUp: false,
      isLgUp: false,
      isXlUp: false,
      is2xlUp: false,
      isSmDown: true,
      isMdDown: true,
      isLgDown: true,
      isXlDown: true,
    };
  }

  /**
   * Calculate breakpoint from width
   */
  function getBreakpoint(width: number): Breakpoint {
    const mergedBreakpoints = { ...CONTAINER_BREAKPOINTS, ...breakpoints };

    if (width >= mergedBreakpoints['2xl']) return '2xl';
    if (width >= mergedBreakpoints.xl) return 'xl';
    if (width >= mergedBreakpoints.lg) return 'lg';
    if (width >= mergedBreakpoints.md) return 'md';
    if (width >= mergedBreakpoints.sm) return 'sm';
    return 'xs';
  }

  /**
   * Calculate size information from dimensions
   */
  function calculateSize(width: number, height: number): ContainerSize {
    const mergedBreakpoints = { ...CONTAINER_BREAKPOINTS, ...breakpoints };
    const breakpoint = getBreakpoint(width);

    return {
      width,
      height,
      breakpoint,
      isXs: breakpoint === 'xs',
      isSm: breakpoint === 'sm',
      isMd: breakpoint === 'md',
      isLg: breakpoint === 'lg',
      isXl: breakpoint === 'xl',
      is2xl: breakpoint === '2xl',
      isSmUp: width >= mergedBreakpoints.sm,
      isMdUp: width >= mergedBreakpoints.md,
      isLgUp: width >= mergedBreakpoints.lg,
      isXlUp: width >= mergedBreakpoints.xl,
      is2xlUp: width >= mergedBreakpoints['2xl'],
      isSmDown: width < mergedBreakpoints.md,
      isMdDown: width < mergedBreakpoints.lg,
      isLgDown: width < mergedBreakpoints.xl,
      isXlDown: width < mergedBreakpoints['2xl'],
    };
  }

  /**
   * Update size with optional debouncing
   */
  function updateSize(width: number, height: number) {
    if (debounce > 0) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setSize(calculateSize(width, height));
      }, debounce);
    } else {
      setSize(calculateSize(width, height));
    }
  }

  /**
   * Conditional className utility
   */
  function cn(...classes: Array<string | false | undefined | null>): string {
    return classes.filter(Boolean).join(' ');
  }

  /**
   * Breakpoint-based className utility
   */
  function when(
    breakpoint: Breakpoint | `${Breakpoint}-up` | `${Breakpoint}-down`,
    className: string
  ): string {
    const [bp, direction] = breakpoint.includes('-')
      ? breakpoint.split('-') as [Breakpoint, 'up' | 'down']
      : [breakpoint as Breakpoint, undefined];

    if (direction === 'up') {
      const key = `is${bp.charAt(0).toUpperCase()}${bp.slice(1)}Up` as keyof ContainerSize;
      return size[key] ? className : '';
    } else if (direction === 'down') {
      const key = `is${bp.charAt(0).toUpperCase()}${bp.slice(1)}Down` as keyof ContainerSize;
      return size[key] ? className : '';
    } else {
      const key = `is${bp.charAt(0).toUpperCase()}${bp.slice(1)}` as keyof ContainerSize;
      return size[key] ? className : '';
    }
  }

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        if (observeWidth || observeHeight) {
          updateSize(
            observeWidth ? width : size.width,
            observeHeight ? height : size.height
          );
        }
      }
    });

    resizeObserver.observe(element);

    // Get initial size
    const rect = element.getBoundingClientRect();
    updateSize(rect.width, rect.height);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutRef.current);
    };
  }, [containerRef.current, observeWidth, observeHeight, debounce]);

  return {
    ...size,
    ref: containerRef,
    cn,
    when,
  };
}

/**
 * Hook for using multiple container queries
 */
export function useContainerQueries<T extends HTMLElement>(
  refs: RefObject<T>[],
  options?: UseContainerQueryOptions
): Array<ReturnType<typeof useContainerQuery>> {
  return refs.map((ref) => useContainerQuery(ref, options));
}

/**
 * Utility to create container query classes
 */
export function cq(
  size: ContainerSize,
  classes: Partial<Record<Breakpoint | `${Breakpoint}-up` | `${Breakpoint}-down`, string>>
): string {
  const classList: string[] = [];

  for (const [key, className] of Object.entries(classes)) {
    if (!className) continue;

    const [bp, direction] = key.includes('-')
      ? key.split('-') as [Breakpoint, 'up' | 'down']
      : [key as Breakpoint, undefined];

    if (direction === 'up') {
      const sizeKey = `is${bp.charAt(0).toUpperCase()}${bp.slice(1)}Up` as keyof ContainerSize;
      if (size[sizeKey]) classList.push(className);
    } else if (direction === 'down') {
      const sizeKey = `is${bp.charAt(0).toUpperCase()}${bp.slice(1)}Down` as keyof ContainerSize;
      if (size[sizeKey]) classList.push(className);
    } else {
      const sizeKey = `is${bp.charAt(0).toUpperCase()}${bp.slice(1)}` as keyof ContainerSize;
      if (size[sizeKey]) classList.push(className);
    }
  }

  return classList.join(' ');
}

/**
 * Create responsive value based on container size
 */
export function responsiveValue<T>(
  size: ContainerSize,
  values: Partial<Record<Breakpoint, T>>,
  defaultValue: T
): T {
  // Check from largest to smallest
  const breakpoints: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];

  for (const bp of breakpoints) {
    const sizeKey = `is${bp.charAt(0).toUpperCase()}${bp.slice(1)}` as keyof ContainerSize;
    if (size[sizeKey] && values[bp] !== undefined) {
      return values[bp]!;
    }
  }

  return defaultValue;
}