import './globals.css'
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOUR ALFY | Handmade Products',
    description: 'Premium handmade bags, wallets, perfumes, and custom designs by NOUR ALFY.',
  }
}

import { ThemeProvider } from '@/components/ThemeProvider'
import { CartProvider } from '@/components/CartContext'
import { ToastProvider } from '@/components/ToastContext'
import CartDrawer from '@/components/CartDrawer'
import ConditionalFooter from '@/components/ConditionalFooter'
import WhatsAppWidget from '@/components/WhatsAppWidget'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Great+Vibes&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <CartProvider>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {children}
                <ConditionalFooter />
              </div>
              <CartDrawer />
              <WhatsAppWidget />
            </CartProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
