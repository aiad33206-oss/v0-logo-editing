import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Tajawal, Reem_Kufi, Amiri, Aref_Ruqaa } from 'next/font/google'
import './globals.css'

const tajawal = Tajawal({
  variable: '--font-body',
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
})

const reemKufi = Reem_Kufi({
  variable: '--font-heading',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
})

const amiri = Amiri({
  variable: '--font-quran',
  subsets: ['arabic'],
  weight: ['400', '700'],
})

const arefRuqaa = Aref_Ruqaa({
  variable: '--font-display',
  subsets: ['arabic'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'ملخص الفقه المقارن | خيار العيب – الربا – الرهن',
  description:
    'ملخص أكاديمي منسّق لمادة الفقه المقارن (خيار العيب، الربا، الرهن) – الفرقة الثانية شريعة إسلامية.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${reemKufi.variable} ${amiri.variable} ${arefRuqaa.variable} bg-background`}
    >
      <body className="font-body antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
