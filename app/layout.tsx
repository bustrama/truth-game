import type { Metadata, Viewport } from 'next';
import { Frank_Ruhl_Libre, Heebo, Playpen_Sans_Hebrew } from 'next/font/google';
import { BRAND } from '@/lib/brand';
import './globals.css';

// Self-hosted at build time by next/font (no runtime CDN request).
const frank = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['500', '700', '900'],
  variable: '--font-frank',
  display: 'swap',
});

// Card-prompt face — friendly handwritten Hebrew.
const playpen = Playpen_Sans_Hebrew({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-card',
  display: 'swap',
});

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heebo',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: BRAND.nameHe,
  description: BRAND.description,
  applicationName: BRAND.nameHe,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: BRAND.url,
    siteName: BRAND.nameHe,
    title: BRAND.nameHe,
    description: BRAND.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND.nameHe,
    description: BRAND.description,
  },
};

export const viewport: Viewport = {
  themeColor: '#0E0B1A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${frank.variable} ${heebo.variable} ${playpen.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
