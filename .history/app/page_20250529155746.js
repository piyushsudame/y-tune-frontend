"use client"
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  useEffect(() => {
    // Check if we should force stay on homepage (from navbar click)
    const urlParams = new URLSearchParams(window.location.search);
    const forceHomepage = urlParams.get('force') === 'true';
    
    // Only redirect if authenticated, not forcing homepage, and on first load
    if (status === "authenticated" && !forceHomepage && isFirstLoad) {
      const referrer = document.referrer;
      const currentHost = window.location.host;
      
      // Check if referrer is empty (direct access) or from external site
      if (!referrer || !referrer.includes(currentHost)) {
        router.push("/player");
      }
      
      // Mark as no longer first load
      setIsFirstLoad(false);
    }
  }, [status, router, isFirstLoad]);

  return (
      <> 
            <main className="flex flex-col min-h-[calc(100vh-7rem)]">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16 md:py-24">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
              Your Music, Your Way
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl">
              YTune gives you unlimited access to music and podcasts with no ads.
              Create playlists, discover new tracks, and enjoy your favorite tunes anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link href={"/signup"} >
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full font-medium text-white hover:opacity-90 transition-all">
                Get Started
              </button>
              </Link>
              <Link href={"/about"}>
              <button className="px-8 py-3 bg-transparent border border-purple-500 rounded-full font-medium text-white hover:bg-purple-900/20 transition-all">
                Learn More
              </button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-b from-black/30 via-purple-950/40 to-black/30">
              <Image 
                src="/logo1.png" 
                alt="YTune Music Player" 
                fill
                className=" object-contain drop-shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 md:px-16 py-16 bg-black/30 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose <span className="text-purple-500">YTune</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 p-8 rounded-xl border border-purple-900/30 backdrop-blur-sm">
              <div className="w-14 h-14 bg-purple-700/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Unlimited Music</h3>
              <p className="text-gray-400">Access millions of songs from around the world without any limitations.</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 p-8 rounded-xl border border-purple-900/30 backdrop-blur-sm">
              <div className="w-14 h-14 bg-purple-700/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom Playlists</h3>
              <p className="text-gray-400">Create and customize your own playlists with your favorite tracks and share them with friends.</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 p-8 rounded-xl border border-purple-900/30 backdrop-blur-sm">
              <div className="w-14 h-14 bg-purple-700/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Social Experience</h3>
              <p className="text-gray-400">Connect with friends, share your favorite music, and discover what others are listening to.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 md:px-16 py-16 md:py-24 flex flex-col items-center justify-center text-center flex-grow">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl">
            Ready to experience the best music streaming platform?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Join thousands of music lovers who have already made YTune their go-to music player.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full font-medium text-white hover:opacity-90 transition-all text-lg">
            Start Listening Now
          </button>
        </section>
      </main>
      <Footer />
    </>        
  );
}
