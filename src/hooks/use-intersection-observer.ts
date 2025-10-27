import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  target: RefObject<Element>;
  onIntersect: (entry: IntersectionObserverEntry) => void;
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  enabled?: boolean;
}

/**
 * Custom hook for Intersection Observer API
 * Used for lazy loading, infinite scroll, and visibility detection
 */
export function useIntersectionObserver({
  target,
  onIntersect,
  threshold = 0,
  rootMargin = '0px',
  root = null,
  enabled = true
}: UseIntersectionObserverOptions) {
  const savedCallback = useRef(onIntersect);

  useEffect(() => {
    savedCallback.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled || !target.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            savedCallback.current(entry);
          }
        });
      },
      {
        root,
        rootMargin,
        threshold
      }
    );

    const element = target.current;
    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [target, threshold, rootMargin, root, enabled]);
}

/**
 * Hook for detecting when multiple elements are in viewport
 */
export function useIntersectionObserverMultiple({
  targets,
  onIntersect,
  threshold = 0,
  rootMargin = '0px',
  root = null,
  enabled = true
}: {
  targets: RefObject<Element>[];
  onIntersect: (entries: IntersectionObserverEntry[]) => void;
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  enabled?: boolean;
}) {
  const savedCallback = useRef(onIntersect);

  useEffect(() => {
    savedCallback.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled) return;

    const validTargets = targets
      .map(target => target.current)
      .filter(Boolean) as Element[];

    if (validTargets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        savedCallback.current(entries);
      },
      {
        root,
        rootMargin,
        threshold
      }
    );

    validTargets.forEach(element => {
      observer.observe(element);
    });

    return () => {
      validTargets.forEach(element => {
        observer.unobserve(element);
      });
      observer.disconnect();
    };
  }, [targets, threshold, rootMargin, root, enabled]);
}

/**
 * Hook for detecting if element is in viewport
 */
export function useIsInViewport(
  ref: RefObject<Element>,
  options?: {
    threshold?: number | number[];
    rootMargin?: string;
    root?: Element | null;
  }
): boolean {
  const [isInViewport, setIsInViewport] = useState(false);

  useIntersectionObserver({
    target: ref,
    onIntersect: (entry) => {
      setIsInViewport(entry.isIntersecting);
    },
    ...options
  });

  return isInViewport;
}