"use client";

import { useState } from "react";

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  const waNumber = "6281234567890";

  const messages = [
    { text: "Halo, saya mau tanya harga sewa mobil", label: "💰 Tanya Harga" },
    { text: "Halo, saya mau cek ketersediaan mobil", label: "🚗 Cek Ketersediaan" },
    { text: "Halo, saya butuh bantuan dengan pemesanan saya", label: "🆘 Bantuan" },
  ];

  const handleChat = (message: string) => {
    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener noreferrer"
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat options popup */}
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-72 animate-[fadeIn_0.2s_ease-out] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
                💬
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">BookingMobil</p>
                <p className="text-xs text-gray-500">Balas dalam hitungan menit</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Tutup"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-xs text-gray-500 border-t border-gray-100 pt-3">
            Pilih topik atau tulis pertanyaan Anda:
          </p>

          <div className="space-y-1.5">
            {messages.map((msg) => (
              <button
                key={msg.label}
                onClick={() => handleChat(msg.text)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-green-50 text-sm text-gray-700 border border-gray-100 hover:border-green-200 transition-all font-medium"
              >
                {msg.label}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              handleChat("Halo BookingMobil, saya mau bertanya...")
            }
            className="w-full text-center px-3 py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-bold hover:bg-green-100 border border-green-200 transition-all"
          >
            ✏️ Tulis Pertanyaan Lain
          </button>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-all duration-300 ${
          open
            ? "bg-gray-800 text-white hover:bg-gray-700 rotate-45"
            : "bg-green-500 text-white hover:bg-green-400 hover:scale-105 shadow-green-500/40"
        }`}
        aria-label={open ? "Tutup chat WhatsApp" : "Chat via WhatsApp"}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>
    </div>
  );
}
