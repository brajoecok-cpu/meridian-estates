import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { SiteNav } from '@/components/nav/SiteNav';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@/components/analytics/Analytics';
import { FloatingConciergePill } from '@/components/nav/FloatingConciergePill';
import { ComparisonTray } from '@/components/property/ComparisonTray';
import { CurrencyProvider } from '@/lib/currency';
import { ComparisonProvider } from '@/lib/comparison';
import { generateOrganizationJsonLd } from '@/lib/seo';
import { SiteSettingsProvider } from '@/lib/site-settings-context';
import { getSiteSettings } from '@/lib/cms';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kings-realestate.com'),
  title: 'Kings Real Estate — Ultra-Luxury Miami Property Developer',
  description:
    'Discover an unprecedented collection of trophy waterfront villas, sky penthouses, and private estates across Brickell, Coconut Grove, Edgewater, and Star Island.',
  keywords: [
    'Miami Luxury Real Estate',
    'Brickell Penthouses',
    'Star Island Mansions',
    'Coconut Grove Waterfront Estates',
    'Kings Real Estate',
  ],
  openGraph: {
    title: 'Kings Real Estate — Ultra-Luxury Miami Property Developer',
    description:
      'Curating Miami’s most transcendent architectural landmarks. Defined by uncompromising engineering and panoramic bayfront horizons.',
    type: 'website',
    images: ['/images/im1.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kings Real Estate — Ultra-Luxury Miami Property Developer',
    description: 'Trophy waterfront villas and sky penthouses across Miami.',
    images: ['/images/im1.jpg'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = generateOrganizationJsonLd();
  const siteSettings = await getSiteSettings();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#D9F9DF] text-[#1A1C3B] min-h-screen flex flex-col antialiased selection:bg-[#9FA1FF] selection:text-[#1A1C3B]"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SiteSettingsProvider settings={siteSettings}>
          <CurrencyProvider>
            <ComparisonProvider>
              <Analytics />
              <SiteNav />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
              <FloatingConciergePill />
              <ComparisonTray />
            </ComparisonProvider>
          </CurrencyProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
