import React from "react";
import { motion } from "framer-motion";

interface NavbarProps {
  appName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ appName }) => {
  return (
    <motion.div
      className="bg-[#1a1a1a] border-b border-gray-700 px-4 py-3 flex justify-center"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
        {appName}
      </h1>
    </motion.div>
  );
};
