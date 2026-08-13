"use client";

import { lazy, Suspense, useCallback, useEffect, useState } from "react";

export function DelayedClientLoader({
  load,
  fallback = null,
  idleTimeout = 1500,
}: {
  load: () => Promise<{ default: React.ComponentType }>;
  fallback?: React.ReactNode;
  idleTimeout?: number;
}) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const scheduleLoad = useCallback(() => {
    if (Component) return;
    void load().then((mod) => setComponent(() => mod.default));
  }, [Component, load]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let idleId: ReturnType<typeof requestIdleCallback> | undefined;

    const onInteraction = () => scheduleLoad();

    window.addEventListener("pointerdown", onInteraction, { once: true });
    window.addEventListener("keydown", onInteraction, { once: true });
    window.addEventListener("scroll", onInteraction, { once: true });

    const idle = window.requestIdleCallback;
    if (idle) {
      idleId = idle(() => scheduleLoad(), { timeout: idleTimeout });
    } else {
      const timeoutId = setTimeout(scheduleLoad, idleTimeout);
      return () => {
        window.removeEventListener("pointerdown", onInteraction);
        window.removeEventListener("keydown", onInteraction);
        window.removeEventListener("scroll", onInteraction);
        clearTimeout(timeoutId);
      };
    }

    return () => {
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
      window.removeEventListener("scroll", onInteraction);
      if (idleId) window.cancelIdleCallback(idleId);
    };
  }, [idleTimeout, scheduleLoad]);

  if (!Component) return fallback;

  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}
