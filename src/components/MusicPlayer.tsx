import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

interface MusicPlayerProps {
  tracks: Track[];
}

export default function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="bg-black border-2 border-fuchsia-500 p-6 w-full max-w-md mx-auto flex flex-col items-center relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-fuchsia-500"></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Track Info */}
      <div className="flex items-center gap-4 w-full mb-6 border-b border-cyan-400/50 pb-4">
        <div className="w-16 h-16 bg-fuchsia-500 flex items-center justify-center animate-glitch relative overflow-hidden">
          <Terminal className="text-black w-8 h-8 z-10" />
          {isPlaying && (
            <div className="absolute inset-0 bg-cyan-400/50 mix-blend-overlay animate-noise" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-cyan-400 font-bold text-xl truncate tracking-widest uppercase animate-glitch">
            {currentTrack.title}
          </h3>
          <p className="text-fuchsia-500 text-sm truncate uppercase tracking-widest">
            ID: {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-6 group relative h-4 bg-gray-900 border border-fuchsia-500/50">
        <div 
          className="absolute top-0 left-0 h-full bg-cyan-400 mix-blend-screen"
          style={{ width: `${progress}%` }}
        ></div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full px-2">
        <button
          onClick={toggleMute}
          className="text-cyan-400 hover:text-fuchsia-500 transition-colors p-2 border border-cyan-400 hover:border-fuchsia-500"
          title={isMuted ? "ENABLE_AUDIO" : "DISABLE_AUDIO"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="text-fuchsia-500 hover:text-cyan-400 transition-colors border border-fuchsia-500 p-2 hover:bg-fuchsia-500/20"
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-16 h-12 bg-cyan-400 text-black flex items-center justify-center hover:bg-fuchsia-500 transition-colors animate-pulse"
          >
            {isPlaying ? (
              <Pause size={28} className="fill-current" />
            ) : (
              <Play size={28} className="fill-current ml-1" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="text-fuchsia-500 hover:text-cyan-400 transition-colors border border-fuchsia-500 p-2 hover:bg-fuchsia-500/20"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="w-10 text-xs text-cyan-400 tracking-tighter">
          {Math.floor(progress)}%
        </div>
      </div>
    </div>
  );
}
