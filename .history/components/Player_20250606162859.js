import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Hls from 'hls.js'
import { useSpotify } from '@/context/SpotifyContext'

const Player = () => {
  const { currentStreamUrl, currentSong } = useSpotify();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [hlsInstance, setHlsInstance] = useState(null);

  useEffect(() => {
    if (!currentStreamUrl || !audioRef.current) return;
    
    // Clean up previous HLS instance if it exists
    if (hlsInstance) {
      hlsInstance.destroy();
    }
    
    let hls;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(currentStreamUrl);
      hls.attachMedia(audioRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Auto play when the stream is ready
        audioRef.current.play()
          .then(() => {
            console.log('Playback started successfully');
          })
          .catch(error => {
            console.error('Error starting playback:', error);
          });
      });
      setHlsInstance(hls);
    } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      audioRef.current.src = currentStreamUrl;
      audioRef.current.play()
        .catch(error => console.error('Error starting playback in Safari:', error));
    }

    const audio = audioRef.current;
    
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      
      if (hls) {
        hls.destroy();
        setHlsInstance(null);
      }
    };
  }, [currentStreamUrl, hlsInstance]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const seekTo = (e) => {
    const seekPosition = e.target.value;
    if (audioRef.current) {
      audioRef.current.currentTime = (seekPosition / 100) * duration;
    }
  };

  return (
    <div className='h-full flex justify-center items-center bg-gradient-to-r from-black via-[#37055c] to-black backdrop-blur-sm border-t border-purple-900/40'>
      {/* Hidden audio element for HLS.js */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      <div className="container px-5 w-[95%] rounded-3xl mx-auto h-[80%] flex items-center justify-between bg-gradient-to-br from-[#23232a]/90 via-[#2d193c]/80 to-[#18181c]/90 border border-purple-900/40 shadow-lg backdrop-blur-md">
        {/* Track Info */}
        <div className="track flex items-center gap-4 w-1/4">
          <div className="relative h-14 w-14 rounded-md overflow-hidden">
            <Image 
              src={currentSong?.image || "/demo-album.jpg"} 
              alt="Album Cover" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium">{currentSong?.title || "No Song Playing"}</span>
            <span className="text-gray-400 text-sm">{currentSong?.artist || "Unknown Artist"}</span>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Image src="/add.png" alt="Add to playlist" width={20} height={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="controls flex flex-col items-center gap-2 w-2/4">
          <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Image src="/shuffle.png" alt="Shuffle" width={20} height={20} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Image src="/previous song.png" alt="Previous" width={20} height={20} />
            </button>
            <button 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={togglePlayPause}
            >
              <Image 
                src={isPlaying ? "/pause.png" : "/playing.png"} 
                alt="Play/Pause" 
                width={32} 
                height={32} 
              />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Image src="/next song.png" alt="Next" width={20} height={20} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Image src="/repeat.png" alt="Repeat" width={20} height={20} />
            </button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-gray-400 text-xs">{formatTime(currentTime)}</span>
            <div className="flex-grow h-1 bg-gray-600 rounded-full relative">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={seekTo}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="h-full bg-purple-500 rounded-full" 
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Extra Options */}
        <div className="extra-options flex items-center gap-4 w-1/4 justify-end">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Image 
                src={volume === 0 ? "/volume-mute.png" : volume < 0.5 ? "/volume-min.png" : "/volume-max.png"} 
                alt="Volume" 
                width={20} 
                height={20} 
              />
            </button>
            <div className="w-24 h-1 bg-gray-600 rounded-full relative">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume * 100}
                onChange={handleVolumeChange}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="h-full bg-purple-500 rounded-full" 
                style={{ width: `${volume * 100}%` }}
              ></div>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Image src="/queue.png" alt="Queue" width={20} height={20} />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Image src="/lyrics.png" alt="Lyrics" width={20} height={20} className="brightness-0 invert" /> 
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Image src="/fullscreen.png" alt="Fullscreen" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Player
