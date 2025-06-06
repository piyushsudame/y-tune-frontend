import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

export default function Player({ streamUrl }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
    }
  }, [streamUrl]);

  return (
    <div className="fixed bottom-0 w-full bg-gray-900 p-4">
      <video ref={videoRef} controls className="w-full" />
    </div>
  );
}
