import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToasterProvider } from "@/components/toaster-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookingMobil.id - Rental Mobil Terpercaya",
  description: "Platform penyewaan mobil terbaik, mudah, cepat, dan terpercaya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
