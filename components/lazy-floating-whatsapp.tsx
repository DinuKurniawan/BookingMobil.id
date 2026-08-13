"use client";

import { DelayedClientLoader } from "@/components/delayed-client-loader";

export function LazyFloatingWhatsApp() {
  return (
    <DelayedClientLoader
      load={() =>
        import("@/components/floating-whatsapp").then((m) => ({
          default: m.FloatingWhatsApp,
        }))
      }
    />
  );
}
