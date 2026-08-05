"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  /** Trigger once and never re-hide */
  once?: boolean;
  /** Margin before the element enters viewport (CSS margin string) */
  rootMargin?: string;
  /** 0 to 1 — how much of the element must be visible */
  threshold?: number;
}

export function useScrollAnimation({
  once = true,
  rootMargin = "0px 0px -80px 0px",
  threshold = 0.1,
}: UseScrollAnimationOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, isVisible };
}
