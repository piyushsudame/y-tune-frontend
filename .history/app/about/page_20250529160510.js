import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <main className="flex flex-col min-h-[calc(100vh-7rem)]">
        {/* Hero Section */}
        <section className="px-6 md:px-16 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
            About YTune
          </h1>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto">
            We're on a mission to revolutionize how you experience music. 
            YTune is more than just a music player—it's your personal music companion.
          </p>
        </section>

        {/* Our Story Section */}
        <section className="px-6 md:px-16 py-16 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Our Story</h2>
                <div className="space-y-4 text-white">
                  <p>
                    YTune was born from a simple idea: music should be accessible to everyone, everywhere, without limitations.
                  </p>
                  <p>
                    Founded in 2023 by a team of music enthusiasts and tech innovators, we set out to create a platform that not only delivers high-quality audio but also connects people through their shared love of music.
                  </p>
                  <p>
                    What started as a small project has quickly grown into a platform loved by thousands of users worldwide. Our journey is just beginning, and we're excited to have you along for the ride.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 relative h-64 md:h-96 w-full rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 mix-blend-overlay z-10 rounded-xl"></div>
                <Image 
                  src="/logo1.png" 
                  alt="YTune Team" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="px-6 md:px-16 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 p-8 rounded-xl border border-purple-900/30 backdrop-blur-sm">
                <div className="w-14 h-14 bg-purple-700/30 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Accessibility</h3>
                <p className="text-white">We believe music should be accessible to everyone, regardless of where they are or what device they're using.</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 p-8 rounded-xl border border-purple-900/30 backdrop-blur-sm">
                <div className="w-14 h-14 bg-purple-700/30 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Quality & Security</h3>
                <p className="text-white">We're committed to delivering the highest audio quality while ensuring your data remains secure and private.</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 p-8 rounded-xl border border-purple-900/30 backdrop-blur-sm">
                <div className="w-14 h-14 bg-purple-700/30 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Community</h3>
                <p className="text-white">We foster a global community of music lovers who share, discover, and connect through the universal language of music.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-6 md:px-16 py-16 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 rounded-xl overflow-hidden border border-purple-900/30">
                <div className="h-64 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-semibold text-white">Alex Johnson</h3>
                    <p className="text-purple-400">Founder & CEO</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-white text-sm">Music enthusiast with a passion for technology. Alex founded YTune with the vision of making music more accessible to everyone.</p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 rounded-xl overflow-hidden border border-purple-900/30">
                <div className="h-64 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-semibold text-white">Samantha Lee</h3>
                    <p className="text-purple-400">CTO</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-white text-sm">Tech wizard and audio engineering expert. Samantha ensures YTune delivers the highest quality sound experience possible.</p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 rounded-xl overflow-hidden border border-purple-900/30">
                <div className="h-64 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-semibold text-white">Marcus Chen</h3>
                    <p className="text-purple-400">Head of Design</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-white text-sm">Creative genius with an eye for detail. Marcus is responsible for YTune's sleek interface and intuitive user experience.</p>
                </div>
              </div>

              {/* Team Member 4 */}
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 rounded-xl overflow-hidden border border-purple-900/30">
                <div className="h-64 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-semibold text-white">Olivia Rodriguez</h3>
                    <p className="text-purple-400">Music Curator</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-white text-sm">Former DJ with an encyclopedic knowledge of music. Olivia helps users discover new artists and tracks they'll love.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 md:px-16 py-16 md:py-24 flex flex-col items-center justify-center text-center flex-grow">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl text-white">
            Join the YTune Family
          </h2>
          <p className="text-lg text-white mb-8 max-w-2xl">
            Ready to experience music like never before? Join our growing community of music lovers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full font-medium text-white hover:opacity-90 transition-all">
                Sign Up Now
              </button>
            </Link>
            <Link href="/">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 border border-purple-500 rounded-full font-medium text-white hover:bg-purple-900/20 transition-all">
                Back to Home
              </button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
