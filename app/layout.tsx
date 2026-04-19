// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PhilosophyOS — 経営哲学ダッシュボード',
  description: '経営者の哲学を15分で入力して、専用ダッシュボードを自動生成します',
  keywords: ['経営哲学', 'ビジョン', 'ミッション', 'カルチャー', 'ダッシュボード'],
  openGraph: {
    title: 'PhilosophyOS',
    description: '経営者の哲学を15分でダッシュボードに',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
