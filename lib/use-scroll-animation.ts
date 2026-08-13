"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

type Callback = (isIntersecting: boolean) => void;

let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, Callback>();

function getObserver(rootMargin: string, threshold: number) {
  if (sharedObserver) return sharedObserver;

  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const cb = callbacks.get(entry.target);
        cb?.(entry.isIntersecting);
      }
    },
    { rootMargin, threshold },
  );

  return sharedObserver;
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

    const observer = getObserver(rootMargin, threshold);
    callbacks.set(node, (intersecting) => {
      if (intersecting) {
        setIsVisible(true);
        if (once) observer.unobserve(node);
      } else if (!once) {
        setIsVisible(false);
      }
    });

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [once, rootMargin, threshold]);

  return { ref, isVisible };
}
