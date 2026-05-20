import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Types of bugs to whack
const BUGS = ['🐛', '🐞', '🕷️', '👾', '🪲'];

interface BugData {
  id: string;
  emoji: string;
  x: number; // vw
  y: number; // px from top of document
  isSmashed?: boolean;
}

export default function MiniGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds per user request
  const [activeBugs, setActiveBugs] = useState<BugData[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const timerRef = useRef<number | undefined>(undefined);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const savedScore = localStorage.getItem('globalbug_highscore');
    if (savedScore) setHighScore(parseInt(savedScore, 10));
    return () => clearTimers();
  }, []);

  const clearTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current as number);
  };

  const popBugCluster = useCallback(() => {
    if (!isPlayingRef.current) return;
    
    // Create 3 to 5 bugs at a time
    const count = Math.floor(Math.random() * 3) + 3;
    const newBugs: BugData[] = [];
    
    const docHeight = document.documentElement.scrollHeight - 200; // avoid very bottom
    
    for (let i = 0; i < count; i++) {
      newBugs.push({
        id: Math.random().toString(36).substr(2, 9),
        emoji: BUGS[Math.floor(Math.random() * BUGS.length)],
        x: Math.random() * 80 + 10, // 10vw to 90vw
        y: Math.random() * docHeight + 100, // 100px to bottom
      });
    }

    setActiveBugs(prev => [...prev, ...newBugs]);

    // Schedule removing these bugs if they aren't clicked
    newBugs.forEach(bug => {
      const timeToStay = Math.random() * 2000 + 1000; // They stay for 1 to 3 seconds globally
      setTimeout(() => {
        setActiveBugs(prev => prev.filter(b => b.id !== bug.id));
      }, timeToStay);
    });

    // Schedule next cluster
    setTimeout(() => {
      if (isPlayingRef.current) popBugCluster();
    }, Math.random() * 800 + 400); // Very chaotic
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(45);
    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsGameOver(false);
    setActiveBugs([]);
    clearTimers();

    // Glitch effect on document body
    document.body.classList.add('glitch-active');
    setTimeout(() => {
      document.body.classList.remove('glitch-active');
    }, 1000);

    // Start countdown
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Initial pop
    setTimeout(() => {
      popBugCluster();
    }, 1000); // Wait for glitch to finish
  };

  const endGame = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsGameOver(true);
    setActiveBugs([]); // clear remaining bugs
    clearTimers();
    
    setScore((currentScore) => {
      if (currentScore > highScore) {
        setHighScore(currentScore);
        localStorage.setItem('globalbug_highscore', currentScore.toString());
      }
      return currentScore;
    });
  };

  const whack = (e: React.MouseEvent | React.PointerEvent, bugId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isPlayingRef.current) return;
    
    // Check if already smashed
    setActiveBugs(prev => {
      const bug = prev.find(b => b.id === bugId);
      if (!bug || bug.isSmashed) return prev; // Do nothing if already smashed
      
      // Update score safely
      setScore((s) => s + 1);

      // Mark as smashed and change emoji
      return prev.map(b => b.id === bugId ? { ...b, isSmashed: true, emoji: '💥' } : b);
    });

    // Add glitch screen effect
    document.body.classList.remove('glitch-active');
    setTimeout(() => {
      document.body.classList.add('glitch-active');
      setTimeout(() => {
        document.body.classList.remove('glitch-active');
      }, 300); // Matches CSS animation duration
    }, 10);

    // Remove completely after explosion effect
    setTimeout(() => {
      setActiveBugs(prev => prev.filter(b => b.id !== bugId));
    }, 400); // 400ms explosion duration
  };

  const cheatCode = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPlayingRef.current) {
      // Cheat activated: Adds +5 per click without disappearing!
      setScore((s) => s + 5);
      
      // Optional subtle glitch effect on cheat
      document.body.classList.remove('glitch-active');
      setTimeout(() => {
        document.body.classList.add('glitch-active');
        setTimeout(() => {
          document.body.classList.remove('glitch-active');
        }, 150);
      }, 10);
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto py-20 px-6" id="minigame">
        <div className="bg-zinc-950 rounded-[3rem] p-8 md:p-12 border border-rose-500/10 shadow-[0_0_50px_rgba(244,63,94,0.05)] overflow-hidden relative text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-rose-500/5 blur-[100px] pointer-events-none rounded-full" />
          
          <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 flex flex-col md:flex-row items-center justify-center gap-3">
            Global Bug Invasion 
            <span 
              onPointerDown={cheatCode}
              className="text-purple-500 hover:text-purple-400 animate-pulse cursor-pointer hover:scale-125 active:scale-90 transition-all select-none"
              title="Hmm... this bug looks suspicious"
            >
              👾
            </span>
          </h3>
          <p className="text-zinc-400 font-medium mb-12 max-w-lg mx-auto">
            The codebase is infected! Once you start, bugs will scatter across the ENTIRE website. 
            Scroll up and down to find and smash them before time runs out!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
            <button
              onClick={startGame}
              disabled={isPlaying}
              className="h-16 px-12 rounded-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500/50 disabled:cursor-not-allowed text-white text-lg font-black tracking-[0.2em] uppercase transition-all shadow-[0_0_40px_rgba(244,63,94,0.4)] active:scale-95"
            >
              {isPlaying ? 'Invasion Active!' : isGameOver ? 'Play Again' : 'Unleash The Bugs'}
            </button>
            
            {isGameOver && (
               <div className="p-4 px-8 bg-rose-500/10 rounded-3xl border border-rose-500/20 flex flex-col justify-center">
                 <h4 className="text-xl font-black text-white uppercase tracking-tighter">Invasion Stopped</h4>
                 <p className="text-zinc-300 font-medium text-sm">You squashed <span className="text-rose-500 font-black text-xl">{score}</span> bugs.</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Invasion Red Overlay (Cinematic Effect) */}
      {createPortal(
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              key="red-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              exit={{ opacity: 0, transition: { repeat: 0, duration: 0.5 } }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="fixed inset-0 pointer-events-none z-[99999]"
              style={{ backgroundColor: 'rgba(255, 0, 0, 0.25)' }}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Global Floating HUD (Visible only when playing) */}
      {createPortal(
        <AnimatePresence>
          {isPlaying && (
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] flex gap-4 pointer-events-none"
            >
              <div className="bg-zinc-950/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-rose-500/30 shadow-[0_10px_30px_rgba(244,63,94,0.2)] flex items-center gap-4">
                <div className="text-center border-r border-white/10 pr-4">
                  <div className="text-[10px] font-black tracking-widest text-rose-500 uppercase">Time Left</div>
                  <div className={`text-3xl font-black ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                    {timeLeft}s
                  </div>
                </div>
                <div className="text-center pl-2">
                  <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Score</div>
                  <div className="text-3xl font-black text-white">{score}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Scattered Bugs Portal */}
      {isPlaying && createPortal(
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[9998]">
          <AnimatePresence>
            {activeBugs.map((bug) => (
              <motion.div
                key={bug.id}
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={bug.isSmashed ? { scale: 1.8, opacity: 0, rotate: 15 } : { scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: bug.isSmashed ? 0.3 : 0.2 }}
                style={{
                  position: 'absolute',
                  left: `${bug.x}vw`,
                  top: `${bug.y}px`,
                }}
                className={`text-7xl md:text-[8rem] cursor-crosshair pointer-events-auto transition-transform ${bug.isSmashed ? 'pointer-events-none' : 'hover:scale-125'}`}
                onPointerDown={(e) => whack(e, bug.id)}
              >
                <div className={bug.isSmashed ? 'drop-shadow-[0_0_30px_rgba(255,200,0,0.8)]' : 'drop-shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'}>
                  {bug.emoji}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </>
  );
}
