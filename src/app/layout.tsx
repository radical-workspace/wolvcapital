import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/hooks/useAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WolvCapital - Smart Investment Platform',
  description: 'Invest smarter with WolvCapital - A comprehensive investment platform built with modern web technologies.',
  keywords: ['investment', 'platform', 'finance', 'portfolio', 'returns'],
  authors: [{ name: 'WolvCapital Team' }],
  creator: 'WolvCapital',
  publisher: 'WolvCapital',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'WolvCapital - Smart Investment Platform',
    description: 'Invest smarter with WolvCapital - A comprehensive investment platform.',
    url: 'https://wolvcapital.com',
    siteName: 'WolvCapital',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WolvCapital Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WolvCapital - Smart Investment Platform',
    description: 'Invest smarter with WolvCapital - A comprehensive investment platform.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}