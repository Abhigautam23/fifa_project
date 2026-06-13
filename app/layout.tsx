import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Data vs Bet365 — World Cup 2026',
  description:
    'Transparent £1 flat-stake betting experiment. Elo-derived model vs Bet365 odds, every prediction posted before kickoff.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-zinc-950">{children}</body>
    </html>
  )
}
