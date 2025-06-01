import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import MobilePlayer from '@/components/MobilePlayer'
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YTune - Your Music Companion',
  description: 'A modern music streaming platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen pt-[10vh] pb-32 md:pb-0">
          {children}
        </main>
        <MobilePlayer />
        <BottomNav />
      </body>
    </html>
  )
}
