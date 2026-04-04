import type { Metadata } from "next";
import "./globals.css";
import { AuthHydration } from "@/components/AuthHydration";  // ← add this

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
      <body>
        <AuthHydration />
        {children}
      </body>
    </html>
  );
}