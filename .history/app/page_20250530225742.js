"use client"
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  useEffect(() => {
    // Check if we should force stay on homepage (from navbar click)
    const urlParams = new URLSearchParams(window.location.search);
    const forceHomepage = urlParams.get('force') === 'true';
    
    // Only redirect if authenticated, not forcing homepage, and on first load
    if (isSignedIn && !forceHomepage && isFirstLoad) {
      const referrer = document.referrer;
      const currentHost = window.location.host;
      
      // Check if referrer is empty (direct access) or from external site
      if (!referrer || !referrer.includes(currentHost)) {
        router.push("/player");
      }
      
      // Mark as no longer first load
      setIsFirstLoad(false);
    }
  }, [isSignedIn, router, isFirstLoad]);

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
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/player" className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-all">
                Start Listening
              </Link>
              <Link href="/about" className="bg-slate-800/60 border border-slate-700/60 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700/60 transition-all">
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <Image
                src="/hero-image.png"
                alt="YTune Music Player"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 md:px-16 py-16 bg-gradient-to-b from-transparent to-slate-900/50">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Why Choose YTune?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Vast Music Library</h3>
              <p className="text-gray-400">Access millions of songs from artists around the world, all in one place.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Personalized Playlists</h3>
              <p className="text-gray-400">Create and share your own playlists, or discover curated ones based on your taste.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Recommendations</h3>
              <p className="text-gray-400">Get personalized music recommendations based on your listening history and preferences.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
