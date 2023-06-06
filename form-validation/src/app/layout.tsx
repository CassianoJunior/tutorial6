import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Form Validation',
  description: '',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex items-center justify-center flex-col w-full h-screen max-w-6xl m-auto pt-14">
          <h1 className="text-2xl text-center text-slate-200">
            Form Validation
          </h1>
          {children}
        </main>
      </body>
    </html>
  )
}
