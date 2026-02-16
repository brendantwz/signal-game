import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CRTOverlay from "@/components/shared/CRTOverlay";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "2050 — The Signal We Trusted",
  description: "A dystopian local-multiplayer simulation. Make choices that shape the future.",
  keywords: ["game", "multiplayer", "dystopian", "simulation", "choice-based"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased`}>
        {/* CRT Scanline Overlay - Client Component */}
        <CRTOverlay />
        {children}
      </body>
    </html>
  );
}
