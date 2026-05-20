import React, { useEffect, useState } from 'react';
import SnakeGame from './SnakeGame';

export default function RetroArcade() {
  const [insertCoin, setInsertCoin] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Blinking "PRESS START"
    const interval = setInterval(() => {
      setInsertCoin(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  if (isPlaying) {
    return <SnakeGame onBack={() => setIsPlaying(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a2a] text-white overflow-hidden select-none flex flex-col items-center justify-center">
      {/* Import Pixel Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          .font-arcade { font-family: 'Press Start 2P', cursive; }
          .arcade-bg {
            background-image: 
              linear-gradient(rgba(255, 0, 255, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 255, 0.2) 1px, transparent 1px);
            background-size: 40px 40px;
            background-position: center;
          }
        `}
      </style>

      {/* Grid Background */}
      <div className="absolute inset-0 arcade-bg opacity-30" style={{ transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)' }} />
      
      {/* CRT Scanlines Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px'
        }}
      />
      
      {/* Arcade Content */}
      <div className="relative z-10 text-center font-arcade flex flex-col items-center gap-8">
        <div className="flex justify-between w-full max-w-md text-sm text-yellow-400 mb-4">
          <div>1UP<br/><span className="text-white">00</span></div>
          <div>HIGH SCORE<br/><span className="text-white">{String(parseInt(localStorage.getItem('snake-highscore') || '0')).padStart(6, '0')}</span></div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
          DEWA<br/>ARCADE
        </h1>
        
        <div className="space-y-6 mt-4">
          <p className="text-pink-500 text-sm md:text-base animate-bounce">
            🐍 SNAKE
          </p>
          
          <button 
            onClick={() => setIsPlaying(true)}
            className={`text-xl md:text-2xl text-yellow-300 hover:text-white transition-colors cursor-pointer ${insertCoin ? 'opacity-100' : 'opacity-30'}`}
          >
            PRESS START
          </button>
        </div>

        <div className="mt-12 text-[8px] text-zinc-600 space-y-1">
          <p>USE ARROW KEYS OR SWIPE TO PLAY</p>
        </div>

        <div className="mt-4 text-[10px] text-zinc-500">
          © 2026 DEWA CORP. ALL RIGHTS RESERVED.
        </div>
      </div>
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}
