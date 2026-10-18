import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from '@/components/ScrollToTop';

const title = "Keerti Charantimath | Product Manager";
const description =
  "Product manager and former Microsoft software engineer, finishing a master's at Carnegie Mellon. Builds AI products end to end.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to the deployed URL so social cards resolve absolutely.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://keertipc7.github.io"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Keerti Charantimath",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-ground text-ink antialiased">
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
