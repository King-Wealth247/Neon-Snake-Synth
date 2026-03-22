import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer, { Track } from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

const DUMMY_TRACKS: Track[] = [
  { id: 'track1', title: 'UPLINK_01', artist: 'SYS.ADMIN', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'track2', title: 'CORRUPT_DATA', artist: 'UNKNOWN_ENTITY', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'track3', title: 'VOID_SIGNAL', artist: 'NULL_PTR', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono overflow-hidden relative flex flex-col items-center selection:bg-fuchsia-500 selection:text-black">
      {/* Static Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-40 scanlines opacity-40"></div>

      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center z-10 border-b-8 border-fuchsia-500 bg-black">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-400 p-2 animate-glitch">
            <Terminal className="text-black w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-widest text-fuchsia-500 animate-glitch uppercase">
            SYS.TERMINAL // NEON_SNAKE
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-black text-cyan-400 px-4 py-2 border-4 border-cyan-400 animate-pulse">
          <span className="uppercase tracking-widest text-xl font-bold">MEM_ALLOC</span>
          <span className="text-3xl font-bold text-fuchsia-500">
            [ {score.toString().padStart(4, '0')} ]
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 items-start mt-8">
        
        {/* Left Column: Music Player */}
        <div className="lg:col-span-1 flex flex-col h-full relative group">
          <div className="relative bg-black h-full p-6 border-4 border-fuchsia-500">
            <h2 className="text-cyan-400 text-3xl mb-6 border-b-4 border-cyan-400 pb-2 animate-glitch uppercase tracking-widest">&gt;&gt; AUDIO_UPLINK</h2>
            <MusicPlayer tracks={DUMMY_TRACKS} />
          </div>
        </div>

        {/* Center/Right Column: Game */}
        <div className="lg:col-span-2 flex justify-center items-center h-full min-h-[500px] relative group">
          <div className="relative bg-black w-full h-full p-6 flex flex-col items-center justify-center border-4 border-cyan-400">
            <h2 className="text-fuchsia-500 text-3xl mb-6 w-full border-b-4 border-fuchsia-500 pb-2 animate-glitch uppercase tracking-widest">&gt;&gt; EXECUTE_SNAKE.EXE</h2>
            <SnakeGame onScoreUpdate={setScore} />
          </div>
        </div>

      </main>
    </div>
  );
}
