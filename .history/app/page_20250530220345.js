"use client"
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-bg.jpg"
              alt="Background"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-purple-400">YTune</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Your ultimate music streaming platform. Discover, listen, and enjoy your favorite tracks anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200">
                  Get Started
                </button>
              </Link>
              <Link href="/login">
                <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-gradient-to-b from-black to-purple-900/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose <span className="text-purple-400">YTune</span>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-purple-900/30">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Vast Music Library</h3>
                <p className="text-gray-400">
                  Access millions of songs from artists around the world. From the latest hits to timeless classics.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-purple-900/30">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎧</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">High-Quality Audio</h3>
                <p className="text-gray-400">
                  Experience crystal-clear sound with our high-quality audio streaming. Every note, every beat, perfectly delivered.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-purple-900/30">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Cross-Platform</h3>
                <p className="text-gray-400">
                  Listen on any device. Seamlessly switch between your phone, tablet, and computer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
