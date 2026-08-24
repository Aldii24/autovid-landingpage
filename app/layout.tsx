import type {Metadata} from 'next';
import './globals.css';
import '@fontsource-variable/manrope';
import '@fontsource-variable/newsreader/wght-italic.css';
import './v2.css';

export const metadata: Metadata = {
  title: {default: 'AutoVid — Desktop AI Video Studio', template: '%s · AutoVid'},
  description: 'Satu meja kerja untuk cerita, voice-over, visual AI konsisten, dan render video final.',
  metadataBase: new URL('https://autovid.my.id'),
  openGraph: {title: 'AutoVid — Satu meja kerja. Semua tahap produksi video.', description: 'Desktop AI video studio dengan pipeline yang aman dilanjutkan.', type: 'website', images: [{url: '/og.png', width: 1200, height: 630, alt: 'AutoVid — Satu meja kerja. Semua tahap produksi video.'}]},
  twitter: {card: 'summary_large_image', title: 'AutoVid — Desktop AI Video Studio', description: 'Satu meja kerja. Semua tahap produksi video.', images: ['/og.png']},
  icons: {icon: '/favicon.png'},
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="id"><body>{children}</body></html>;
}
