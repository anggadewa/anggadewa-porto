import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 250;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Point = { x: number; y: number };

export default function SnakeGame({ onBack }: { onBack: () => void }) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake-highscore') || '0');
  });
  const [isPaused, setIsPaused] = useState(false);
  const dirRef = useRef<Direction>('RIGHT');
  const touchStart = useRef<Point | null>(null);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(s => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const initial = [{ x: 10, y: 10 }];
    setSnake(initial);
    setFood(spawnFood(initial));
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  }, [spawnFood]);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const speed = Math.max(120, INITIAL_SPEED - score * 1);
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { ...prev[0] };
        const dir = dirRef.current;

        switch (dir) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snake-highscore', String(newScore));
            }
            return newScore;
          });
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [gameOver, isPaused, food, score, highScore, spawnFood]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onBack(); return; }
      if (e.key === 'p' || e.key === 'P') { setIsPaused(p => !p); return; }
      if (gameOver && (e.key === 'Enter' || e.key === ' ')) { resetGame(); return; }

      const dir = dirRef.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
          if (dir !== 'DOWN') { dirRef.current = 'UP'; setDirection('UP'); } break;
        case 'ArrowDown': case 's': case 'S':
          if (dir !== 'UP') { dirRef.current = 'DOWN'; setDirection('DOWN'); } break;
        case 'ArrowLeft': case 'a': case 'A':
          if (dir !== 'RIGHT') { dirRef.current = 'LEFT'; setDirection('LEFT'); } break;
        case 'ArrowRight': case 'd': case 'D':
          if (dir !== 'LEFT') { dirRef.current = 'RIGHT'; setDirection('RIGHT'); } break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameOver, resetGame, onBack]);

  // Touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const dir = dirRef.current;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30 && dir !== 'LEFT') { dirRef.current = 'RIGHT'; setDirection('RIGHT'); }
      else if (dx < -30 && dir !== 'RIGHT') { dirRef.current = 'LEFT'; setDirection('LEFT'); }
    } else {
      if (dy > 30 && dir !== 'UP') { dirRef.current = 'DOWN'; setDirection('DOWN'); }
      else if (dy < -30 && dir !== 'DOWN') { dirRef.current = 'UP'; setDirection('UP'); }
    }
    touchStart.current = null;
  };

  return (
    <div
      className="fixed inset-0 bg-[#0a0a2a] flex flex-col items-center justify-center z-[100] font-arcade select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-arcade { font-family: 'Press Start 2P', cursive; }
      `}</style>

      {/* Score Header */}
      <div className="flex justify-between w-full max-w-[420px] px-2 mb-4 text-xs">
        <div className="text-yellow-400">SCORE<br/><span className="text-white">{String(score).padStart(6, '0')}</span></div>
        <div className="text-yellow-400 text-right">HIGH<br/><span className="text-white">{String(highScore).padStart(6, '0')}</span></div>
      </div>

      {/* Game Board */}
      <div
        className="relative border-2 border-cyan-500/50 bg-[#050520]"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, rgba(100,200,255,0.3) 1px, transparent 1px)',
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
        }} />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute rounded-sm transition-all duration-75 ${i === 0 ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-green-500/80'}`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse"
          style={{
            left: food.x * CELL_SIZE + 2,
            top: food.y * CELL_SIZE + 2,
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-6">
            <p className="text-red-500 text-2xl animate-pulse">GAME OVER</p>
            <p className="text-yellow-300 text-xs">SCORE: {score}</p>
            <button
              onClick={resetGame}
              className="text-sm text-cyan-400 hover:text-white transition-colors animate-bounce cursor-pointer"
            >
              PRESS START
            </button>
          </div>
        )}

        {/* Paused Overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <p className="text-yellow-300 text-xl animate-pulse">PAUSED</p>
          </div>
        )}
      </div>

      {/* Mobile D-Pad */}
      <div className="mt-8 md:hidden grid grid-cols-3 gap-2 w-40">
        <div />
        <button
          onTouchStart={() => { if (dirRef.current !== 'DOWN') { dirRef.current = 'UP'; setDirection('UP'); } }}
          className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/40 rounded-lg flex items-center justify-center text-cyan-400 text-lg active:bg-cyan-500/40"
        >▲</button>
        <div />
        <button
          onTouchStart={() => { if (dirRef.current !== 'RIGHT') { dirRef.current = 'LEFT'; setDirection('LEFT'); } }}
          className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/40 rounded-lg flex items-center justify-center text-cyan-400 text-lg active:bg-cyan-500/40"
        >◄</button>
        <div />
        <button
          onTouchStart={() => { if (dirRef.current !== 'LEFT') { dirRef.current = 'RIGHT'; setDirection('RIGHT'); } }}
          className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/40 rounded-lg flex items-center justify-center text-cyan-400 text-lg active:bg-cyan-500/40"
        >►</button>
        <div />
        <button
          onTouchStart={() => { if (dirRef.current !== 'UP') { dirRef.current = 'DOWN'; setDirection('DOWN'); } }}
          className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/40 rounded-lg flex items-center justify-center text-cyan-400 text-lg active:bg-cyan-500/40"
        >▼</button>
        <div />
      </div>

      {/* Controls Hint */}
      <div className="mt-6 text-[8px] text-zinc-500 text-center space-y-1 hidden md:block">
        <p>ARROW KEYS / WASD TO MOVE</p>
        <p>P TO PAUSE • ESC TO EXIT</p>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mt-6 text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer"
      >
        ← BACK TO ARCADE
      </button>
    </div>
  );
}
