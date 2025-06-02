'use client';

import { useEffect, useState } from 'react';

export default function Library() {
  const [tracks, setTracks] = useState([]);

  // This file fetches and displays user's library tracks
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Track list will be rendered here */}
      </div>
    </div>
  );
} 