import type { MetadataRoute } from 'next';
import { BRAND } from '@/lib/brand';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.nameHe,
    short_name: BRAND.nameHe,
    description: BRAND.description,
    lang: 'he',
    dir: 'rtl',
    start_url: '/',
    display: 'standalone',
    theme_color: '#0E0B1A',
    background_color: '#0E0B1A',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
