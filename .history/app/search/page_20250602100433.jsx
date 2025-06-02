'use client';

import { useState } from 'react';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  // This file handles search functionality for tracks, artists, and albums
  return (
    <div className="p-8">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for songs, artists, or albums..."
          className="w-full p-3 rounded-lg bg-gray-800 text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search results will be rendered here */}
      </div>
    </div>
  );
} 