import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-purple-900/30 md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link href="/player" className="flex flex-col items-center text-white">
          <div className="w-6 h-6 relative flex items-center justify-center">
            <Image src="/home.png" alt="Home" width={20} height={20} />
          </div>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/player/explore" className="flex flex-col items-center text-white">
          <div className="w-6 h-6 relative flex items-center justify-center">
            <Image src="/explore.svg" style={{ filter: "invert(1)" }} alt="Explore" width={20} height={20} />
          </div>
          <span className="text-xs mt-1">Explore</span>
        </Link>
        <Link href="/player/library" className="flex flex-col items-center text-white">
          <div className="w-6 h-6 relative flex items-center justify-center">
            <Image src="/library.svg" style={{ filter: "invert(1)" }} alt="Library" width={20} height={20} />
          </div>
          <span className="text-xs mt-1">Library</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center text-white">
          <div className="w-6 h-6 relative flex items-center justify-center">
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-500 text-xs">👤</div>
          </div>
          <span className="text-xs mt-1">Account</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav; 