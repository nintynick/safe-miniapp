import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

const appUrl = 'https://safe.prolific43.com';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Safe MultiSig',
  description: 'A secure multisignature wallet for Farcaster',
  openGraph: {
    title: 'Safe MultiSig',
    description: 'A secure multisignature wallet for Farcaster',
    images: [`${appUrl}/og-image.png`],
  },
  other: {
    'fc:frame': JSON.stringify({
      version: 'next',
      imageUrl: `${appUrl}/og-image.png`,
      button: {
        title: 'Open MultiSig',
        action: {
          type: 'launch_frame',
          name: 'Safe MultiSig',
          splashImageUrl: `${appUrl}/splash.png`,
          splashBackgroundColor: '#1A1A2E',
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
