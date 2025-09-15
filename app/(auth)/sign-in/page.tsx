
"use client";

import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { Github } from "lucide-react";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";


export const dynamic = "force-dynamic";

const SignIn = () => {
  const SignInWithGoogle = async () => {
    if (typeof window === 'undefined') return; 
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/chat-page",
    });
  };

  const SignInWithGitHub = async () => {
    if (typeof window === 'undefined') return; 
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/chat-page",
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const buttonVariants: Variants = {
    initial: { scale: 1, boxShadow: "0 0 0 rgba(255, 255, 255, 0)" },
    hover: {
      scale: 1.02,
      boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent mb-4">
          base44
        </h1>
        <p className="text-xl text-gray-400 text-center">Sign in to base44</p>
      </motion.div>

      <motion.div
        className="flex flex-col gap-6 w-full max-w-md"
        variants={itemVariants}
      >
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" initial="initial">
          <Button
            onClick={SignInWithGoogle}
            className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 flex items-center justify-center gap-3 py-8 rounded-xl shadow-2xl transition-all duration-300 text-lg font-semibold"
          >
            <FcGoogle className="h-6 w-6" />
            Continue with Google
          </Button>
        </motion.div>

        <div className="flex items-center justify-center">
          <div className="w-full h-px bg-gray-700 mx-4"></div>
          <span className="text-gray-500 px-4 text-sm">or</span>
          <div className="w-full h-px bg-gray-700 mx-4"></div>
        </div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" initial="initial">
          <Button
            onClick={SignInWithGitHub}
            className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 flex items-center justify-center gap-3 py-8 rounded-xl shadow-2xl transition-all duration-300 text-lg font-semibold"
          >
            <Github className="h-6 w-6 text-gray-300" />
            Continue with GitHub
          </Button>
        </motion.div>
      </motion.div>

      <motion.p
        className="mt-12 text-xs text-gray-600 text-center"
        variants={itemVariants}
      >
        Secure authentication powered by Better-Auth
      </motion.p>

      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-gray-900 to-transparent rounded-full opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ filter: "blur(50px)" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-l from-gray-900 to-transparent rounded-full opacity-10"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ filter: "blur(40px)" }}
      />
    </motion.div>
  );
};

export default SignIn;