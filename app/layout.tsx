import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AutoVid — Reliable AI Video Production',
  description: 'Turn stories into finished faceless videos with a resilient desktop pipeline for script, voice, consistent visuals, and rendering.',
  metadataBase: new URL('https://autovid.my.id'),
  openGraph: {title: 'AutoVid — Reliable AI Video Production', description: 'Turn stories into finished videos without losing progress.', type: 'website', images: [{url: '/og.png', width: 1200, height: 630, alt: 'AutoVid — Reliable AI video production'}]},
  twitter: {card: 'summary_large_image', title: 'AutoVid — Reliable AI Video Production', description: 'Turn stories into finished videos without losing progress.', images: ['/og.png']},
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
