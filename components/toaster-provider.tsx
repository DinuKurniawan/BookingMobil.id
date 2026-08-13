"use client";

import { lazy, Suspense } from "react";

const LazyToaster = lazy(() =>
  import("sonner").then((mod) => ({ default: mod.Toaster })),
);

export function ToasterProvider() {
  return (
    <Suspense fallback={null}>
      <LazyToaster position="top-right" richColors closeButton />
    </Suspense>
  );
}
