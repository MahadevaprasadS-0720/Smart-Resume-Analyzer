import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function InteractiveSpotlightBackground() {
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? 300 : 0);

  // Butter-smooth spring damping for cursor spotlight tracking
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Ultra-Clean Ambient Floating Aura Orbs (Apple/Stripe breathing light) */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.45, 0.6, 0.45],
          x: [0, 25, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[15%] left-[20%] w-[650px] h-[550px] rounded-full
          bg-gradient-to-br from-indigo-200/50 via-purple-100/40 to-transparent
          blur-[100px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[20%] -right-[10%] w-[550px] h-[500px] rounded-full
          bg-gradient-to-bl from-cyan-100/60 via-blue-100/40 to-transparent
          blur-[110px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute bottom-[5%] left-[10%] w-[500px] h-[450px] rounded-full
          bg-gradient-to-tr from-rose-100/40 via-amber-50/40 to-transparent
          blur-[100px]"
      />

      {/* 2. Interactive Cursor Spotlight (Linear/Raycast Style) */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="absolute w-[600px] h-[600px] rounded-full
          bg-[radial-gradient(circle,_rgba(99,102,241,0.09)_0%,_rgba(6,182,212,0.05)_35%,_transparent_70%)]
          blur-2xl"
      />
    </div>
  );
}
