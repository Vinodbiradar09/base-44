
"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState, useEffect } from "react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.5,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 150, opacity: 0, rotate: -10 },
  visible: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { duration: 1.5, ease: [0.6, -0.05, 0.01, 0.99], type: "spring", stiffness: 80 },
  },
};

const glowVariants: Variants = {
  initial: { textShadow: "0 0 5px rgba(192, 192, 192, 0.1)", scale: 1 },
  animate: {
    textShadow: [
      "0 0 5px rgba(192, 192, 192, 0.1)",
      "0 0 40px rgba(192, 192, 192, 0.7)",
      "0 0 5px rgba(192, 192, 192, 0.1)",
    ],
    scale: [1, 1.08, 1],
    transition: { duration: 1.8, repeat: Infinity, repeatType: "reverse" },
  },
};

const buttonVariants: Variants = {
  initial: { scale: 1, boxShadow: "0 0 0 rgba(192, 192, 192, 0)" },
  hover: {
    scale: 1.15,
    boxShadow: "0 0 30px rgba(192, 192, 192, 0.6)",
    transition: { duration: 0.5, type: "spring", stiffness: 150 },
  },
  tap: { scale: 0.85, rotate: 10 },
};

const shadowLightVariants: Variants = {
  animate: {
    opacity: [0.15, 0.6, 0.15],
    scale: [1, 1.3, 1],
    transition: { duration: 4, repeat: Infinity, repeatType: "reverse" },
  },
};

const glitchVariants: Variants = {
  animate: {
    opacity: [1, 0.8, 1, 0.9, 1],
    x: [0, 2, -2, 1, 0],
    y: [0, 1, -1, 2, 0],
    transition: { duration: 0.3, repeat: Infinity, repeatDelay: 2, ease: "linear" },
  },
};

const particleVariants: Variants = {
  animate: {
    y: [0, -30, 0],
    opacity: [0.4, 0.8, 0.4],
    transition: { duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
  },
};

const orbitVariants: Variants = {
  animate: {
    rotate: [0, 360],
    transition: { duration: 20, repeat: Infinity, ease: "linear" },
  },
};

export default function Home() {
  const [particlePositions, setParticlePositions] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Generate random positions for 50 particles only on client side
      const positions = Array.from({ length: 50 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }));
      setParticlePositions(positions);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Cyberpunk background effects with radial void and vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(at_center,rgba(0,0,0,1),rgba(20,20,20,0.9))] opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /> {/* Vignette effect */}

      {/* Enhanced shadow lights with pulsing */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-silver/25 to-transparent rounded-full opacity-50 blur-[100px]"
        variants={shadowLightVariants}
        animate="animate"
        style={{ transformOrigin: "top left" }}
      />
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-silver/25 to-transparent rounded-full opacity-50 blur-[100px]"
        variants={shadowLightVariants}
        animate="animate"
        style={{ transformOrigin: "top right" }}
      />

      {/* Unique aesthetic: Floating glitch particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-silver/30 rounded-full"
            initial={{ x: pos.x, y: pos.y }}
            animate="animate"
            variants={particleVariants}
            transition={{ delay: Math.random() * 3, duration: 4 + Math.random() * 3 }}
          />
        ))}
        {/* Horizontal scan lines for added retro-futuristic depth */}
        <motion.div
          className="w-full h-full bg-repeating-linear-gradient(to bottom, transparent 4px, rgba(192,192,192,0.02) 4px)"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.div
        className="z-10 w-full max-w-[90vw] flex flex-col items-center text-center gap-12 md:gap-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* App Name with Enhanced Glow, Scale Pulse, and Orbiting Elements */}
        <motion.div className="relative">
          <motion.h1
            className="text-7xl md:text-9xl font-black bg-gradient-to-r from-silver to-gray-600 bg-clip-text text-transparent uppercase tracking-[0.1em] leading-none"
            variants={{ ...itemVariants, ...glowVariants }}
            initial="initial"
            animate="animate"
          >
            base44
          </motion.h1>
          {/* Orbiting silver dots for unique cyber effect */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            variants={orbitVariants}
            animate="animate"
          >
            <div className="w-2 h-2 bg-silver/50 rounded-full absolute top-[-50px]" />
            <div className="w-2 h-2 bg-silver/50 rounded-full absolute bottom-[-50px]" />
            <div className="w-2 h-2 bg-silver/50 rounded-full absolute left-[-50px]" />
            <div className="w-2 h-2 bg-silver/50 rounded-full absolute right-[-50px]" />
          </motion.div>
        </motion.div>

        {/* Tagline with Responsive Font Size, Allowing Two Lines on Mobile */}
        <motion.p
          className="text-[2.5vw] sm:text-[2vw] md:text-[1.5vw] font-mono text-gray-100 tracking-[0.05em] uppercase italic max-w-[85vw] md:whitespace-nowrap"
          style={{ fontVariant: "full-width" }}
          variants={{ ...itemVariants, ...glitchVariants }}
          initial="initial"
          animate="animate"
        >
          credits are fucked ditch that weak-ass shits and hook up with base44
        </motion.p>

        {/* Cool Button with Explosive Hover, No Rounded Corners */}
        <motion.div variants={itemVariants}>
          <Link href="/sign-in">
            <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
              <Button className="bg-black hover:bg-gray-950 text-silver font-black py-5 px-12 rounded-none border-2 border-silver/60 text-2xl uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(192,192,192,0.4)]">
                Go
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Fixed Footer: Simpler, centered, with subtle glow */}
      <motion.footer
        className="absolute bottom-4 text-gray-400 text-sm font-mono uppercase tracking-wide z-10"
        variants={itemVariants}
        animate={{ textShadow: ["0 0 5px rgba(192,192,192,0.2)", "0 0 10px rgba(192,192,192,0.4)", "0 0 5px rgba(192,192,192,0.2)"], transition: { duration: 2, repeat: Infinity, repeatType: "reverse" } }}
      >
        fuck credits
      </motion.footer>
    </div>
  );
}