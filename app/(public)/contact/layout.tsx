import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami - BookingMobil.id",
  description:
    "Hubungi BookingMobil.id untuk informasi sewa mobil, pertanyaan, atau bantuan. Tim kami siap membantu 24/7 via WhatsApp, telepon, atau email.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
