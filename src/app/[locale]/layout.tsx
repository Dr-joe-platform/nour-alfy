import '../globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NOUR ALFY | Premium Handmade Leather Bags & Accessories',
  description: 'Discover NOUR ALFY\'s exquisite collection of handmade leather bags, wallets, perfumes, and custom bespoke designs. Craftsmanship meets luxury in every piece.',
  keywords: 'handmade, leather bags, wallets, perfumes, custom design, NOUR ALFY, luxury accessories, Egypt',
  openGraph: {
    title: 'NOUR ALFY | Handmade Products',
    description: 'Premium handmade bags, wallets, perfumes, and custom designs by NOUR ALFY.',
    type: 'website',
    locale: 'en_EG',
    images: [{ url: '/icon.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOUR ALFY | Handmade Products',
    description: 'Premium handmade bags, wallets, perfumes, and custom designs by NOUR ALFY.',
    images: ['/icon.png'],
  },
  verification: {
    google: '_SEzDShIhgeGVoTBG8ayyAYAcoyXDudzfOMY-_tYx7I',
  }
}

import { ThemeProvider } from '@/components/ThemeProvider'
import { CartProvider } from '@/components/CartContext'
import { ToastProvider } from '@/components/ToastContext'
import { WishlistProvider } from '@/components/WishlistContext'
import { AudioProvider } from '@/components/AudioContext'
import CartDrawer from '@/components/CartDrawer'
import ConditionalFooter from '@/components/ConditionalFooter'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import CustomCursor from '@/components/CustomCursor'

import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import Script from 'next/script';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const isArabic = locale === 'ar';

  return (
    <html lang={locale} dir={isArabic ? 'rtl' : 'ltr'}>
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-GRKY18266C"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GRKY18266C');
          `}
        </Script>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Great+Vibes&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet" />
        {isArabic && (
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />
        )}
      </head>
      <body className={isArabic ? 'font-arabic' : ''}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <AudioProvider>
              <ToastProvider>
                <WishlistProvider>
                  <CartProvider>
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                      {children}
                      <ConditionalFooter />
                    </div>
                    <CartDrawer />
                    <WhatsAppWidget />
                    <CustomCursor />
                  </CartProvider>
                </WishlistProvider>
              </ToastProvider>
            </AudioProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
