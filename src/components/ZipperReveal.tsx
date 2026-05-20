import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useMotionTemplate, animate } from 'framer-motion';
import RetroArcade from './RetroArcade';

export default function ZipperReveal({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'normal' | 'opening' | 'arcade' | 'closing'>('normal');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ======== OPEN ZIPPER (Top-Right → Bottom-Left) ========
  const openProgress = useMotionValue(0);
  const openHandleX = useTransform(openProgress, (v) => -v);
  const openMaskDist = useTransform(openProgress, (v) => v * 1.4142);
  const openMask = useMotionTemplate`linear-gradient(225deg, transparent ${openMaskDist}px, black ${openMaskDist}px)`;

  // ======== CLOSE ZIPPER (Bottom-Left → Top-Right) ========
  const closeProgress = useMotionValue(0);
  const closeHandleX = useTransform(closeProgress, (v) => v);
  const closeHandleY = useTransform(closeProgress, (v) => -v); // moves up
  const closeMaskDist = useTransform(closeProgress, (v) => v * 1.4142);
  const closeMask = useMotionTemplate`linear-gradient(45deg, black ${closeMaskDist}px, transparent ${closeMaskDist}px)`;

  // Audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };
  const stopAudio = () => {
    if (audioRef.current) audioRef.current.pause();
  };

  // ---- OPEN handlers ----
  const handleOpenDragEnd = () => {
    stopAudio();
    const threshold = Math.min(window.innerWidth, window.innerHeight) * 0.25;
    if (openProgress.get() > threshold) {
      setPhase('opening');
      animate(openProgress, Math.max(window.innerWidth, window.innerHeight) * 2, {
        duration: 0.8,
        ease: 'easeInOut',
        onComplete: () => {
          setPhase('arcade');
          closeProgress.set(0);
        },
      });
    } else {
      animate(openProgress, 0, { type: 'spring', stiffness: 300, damping: 30 });
    }
  };

  // ---- CLOSE handlers ----
  const handleCloseDragEnd = () => {
    stopAudio();
    const threshold = Math.min(window.innerWidth, window.innerHeight) * 0.25;
    if (closeProgress.get() > threshold) {
      setPhase('closing');
      animate(closeProgress, Math.max(window.innerWidth, window.innerHeight) * 2, {
        duration: 0.8,
        ease: 'easeInOut',
        onComplete: () => {
          setPhase('normal');
          openProgress.set(0);
          closeProgress.set(0);
        },
      });
    } else {
      animate(closeProgress, 0, { type: 'spring', stiffness: 300, damping: 30 });
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Arcade Layer */}
      <div className={`fixed inset-0 ${phase === 'arcade' ? 'z-30' : 'z-10'}`}>
        <RetroArcade />
      </div>

      {/* Modern UI: Normal / Opening */}
      {(phase === 'normal' || phase === 'opening') && (
        <motion.div
          className="relative w-full min-h-screen bg-background z-20"
          style={{ WebkitMaskImage: openMask, maskImage: openMask }}
        >
          {children}
        </motion.div>
      )}

      {/* Modern UI: Closing (reveals from bottom-left as user drags) */}
      {(phase === 'arcade' || phase === 'closing') && (
        <motion.div
          className="fixed inset-0 bg-background z-40 overflow-y-auto pointer-events-none"
          style={{ WebkitMaskImage: closeMask, maskImage: closeMask }}
        >
          {children}
        </motion.div>
      )}

      {/* OPEN HANDLE (Top-Right) */}
      {phase === 'normal' && (
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: window.innerHeight * 1.5 }}
          dragElastic={0}
          dragMomentum={false}
          onMouseDown={playAudio}
          onTouchStart={playAudio}
          onMouseUp={stopAudio}
          onTouchEnd={stopAudio}
          onDragEnd={handleOpenDragEnd}
          style={{ x: openHandleX, y: openProgress }}
          className="fixed top-0 right-0 z-50 cursor-grab active:cursor-grabbing w-16 h-16 flex items-center justify-center touch-none"
        >
          <div className="w-10 h-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] pointer-events-none">
            <svg viewBox="0 0 24 40" className="w-full h-full">
              <rect x="8" y="0" width="8" height="10" rx="2" fill="#a1a1aa" />
              <path d="M5 8 L19 8 L16 36 L8 36 Z" fill="#d4d4d8" />
              <circle cx="12" cy="26" r="2.5" fill="#3f3f46" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* CLOSE HANDLE (Bottom-Left) */}
      {phase === 'arcade' && (
        <motion.div
          drag="y"
          dragConstraints={{ top: -window.innerHeight * 1.5, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onMouseDown={playAudio}
          onTouchStart={playAudio}
          onMouseUp={stopAudio}
          onTouchEnd={stopAudio}
          onDrag={(_e, info) => {
            closeProgress.set(Math.max(0, -info.offset.y));
          }}
          onDragEnd={handleCloseDragEnd}
          style={{ x: closeHandleX, y: closeHandleY }}
          className="fixed bottom-0 left-0 z-50 cursor-grab active:cursor-grabbing w-16 h-16 flex items-center justify-center touch-none"
        >
          <div className="w-10 h-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] rotate-180 pointer-events-none">
            <svg viewBox="0 0 24 40" className="w-full h-full">
              <rect x="8" y="0" width="8" height="10" rx="2" fill="#a1a1aa" />
              <path d="M5 8 L19 8 L16 36 L8 36 Z" fill="#d4d4d8" />
              <circle cx="12" cy="26" r="2.5" fill="#3f3f46" />
            </svg>
          </div>
        </motion.div>
      )}

      <audio ref={audioRef} src="/zipper.mp3" preload="auto" />
    </div>
  );
}
