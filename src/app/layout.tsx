import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Urban District - Grill and Drinks',
  description: 'Satisfy your cravings, urban district style. Browse our premium grill menu and order directly.',
  keywords: ['Urban District', 'restaurant', 'grill', 'drinks', 'Nigerian food', 'menu'],
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍖</text></svg>',
  },
  openGraph: {
    title: 'Urban District - Grill and Drinks',
    description: 'Premium Nigerian grill restaurant. Browse our menu and order directly.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
