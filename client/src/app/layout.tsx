import type { Metadata } from "next";
import "./globals.css";
import { AuthHydration } from "@/components/AuthHydration";

export const metadata: Metadata = {
  title: "Settlix - Simplify Group Expenses",
  description: "Split expenses with ease, settle with clarity",
  metadataBase: new URL("https://settlix.vercel.app"),

  openGraph: {
    title: "Settlix - Expense Splitting, Simplified",
    description:
      "Add expenses, split with friends, and settle up instantly. No spreadsheets, no drama - just clear balances.",
    type: "website",
    images: [
      {
        url: "https://settlix.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Settlix — Expense Splitting App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@settlix",
    images: ["https://settlix.vercel.app/og-image.png"],
  },
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
