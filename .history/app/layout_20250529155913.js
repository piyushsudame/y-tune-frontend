import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";

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
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <SessionWrapper>
        <div className="relative min-h-screen flex flex-col">
          <div className="absolute inset-0 -z-10 h-[calc(100vh-7rem)] w-full items-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
          <Navbar />
          {children}
        </div>
      </SessionWrapper>
      </body>
    </html>
  );
}
