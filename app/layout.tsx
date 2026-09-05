import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ShipNexDelivery — Track Your Shipment',
  description:
    'ShipNexDelivery: real-time package tracking with live map location, delivery status, and shipment updates.',
  generator: 'v0.app',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7819%20%282%29-Er2qhPu9NWUVVuiK5fbV7lp0Ae0Duu.jpeg',
    shortcut: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7819%20%282%29-Er2qhPu9NWUVVuiK5fbV7lp0Ae0Duu.jpeg',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7819%20%282%29-Er2qhPu9NWUVVuiK5fbV7lp0Ae0Duu.jpeg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
