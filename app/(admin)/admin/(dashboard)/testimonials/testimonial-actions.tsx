"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TestimonialActionsProps {
  testimonialId: string;
  approved?: boolean;
}

export function TestimonialActions({ testimonialId, approved = false }: TestimonialActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: "approve" | "reject" | "delete") => {
    setLoading(action);
    setError(null);

    try {
      const res = await fetch("/api/admin/testimonial-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal");
        setTimeout(() => setError(null), 3000);
        return;
      }

      router.refresh();
    } catch {
      setError("Gagal terhubung ke server");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {error && (
        <span className="text-[10px] text-red-500 mr-1">{error}</span>
      )}

      {!approved ? (
        <>
          <button
            onClick={() => handleAction("approve")}
            disabled={loading !== null}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading === "approve" ? "..." : "✅ Setuju"}
          </button>
          <button
            onClick={() => handleAction("reject")}
            disabled={loading !== null}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading === "reject" ? "..." : "❌ Tolak"}
          </button>
        </>
      ) : (
        <button
          onClick={() => handleAction("delete")}
          disabled={loading !== null}
          className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading === "delete" ? "..." : "🗑 Hapus"}
        </button>
      )}
    </div>
  );
}
