import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthHydration } from "@/components/AuthHydration";  // ← add this

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SplitEase",
  description: "Split expenses with ease, settle with clarity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0f] text-white antialiased`}>
        <AuthHydration />   {/* ← add this */}
        {children}
      </body>
    </html>
  );
}