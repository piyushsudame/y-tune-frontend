import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useState, useEffect } from "react"
import CommandPalette from "@/components/CommandPalette"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "YTune - Your own Music Player",
  description: "YTune is a website meant for streaming audio for free for anyone! It utilizes YT Data API and gives user features like searching songs, playing them in queue, creating playlists etc.",
};

export default function RootLayout({ children }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="relative min-h-screen flex flex-col">
          <div className="fixed inset-0 -z-100 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
          <div className="relative z-100">
            <Navbar />
            {children}
          </div>
        </div>
        <CommandPalette 
          isOpen={isCommandPaletteOpen} 
          onClose={() => setIsCommandPaletteOpen(false)} 
        />
      </body>
    </html>
    </ClerkProvider>
  );
}
