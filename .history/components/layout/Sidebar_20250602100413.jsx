'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Search', href: '/search' },
    { label: 'Your Library', href: '/library' },
    { label: 'Create Playlist', href: '/playlist/create' },
    { label: 'Liked Songs', href: '/liked-songs' },
  ];

  return (
    <div className="w-64 bg-black h-screen p-6">
      <div className="space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block text-gray-400 hover:text-white transition-colors ${
              pathname === item.href ? 'text-white' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
} 