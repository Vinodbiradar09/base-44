"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ value, onChange, onSend }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'; // Max height 200px, scroll if more
    }
  }, [value]);

  const handleSend = () => {
    if (value.trim()) {
      onSend();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full min-h-[44px] max-h-[200px] resize-none bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400 pr-12 scroll-auto"
          rows={1}
        />
        <motion.div
          className="absolute bottom-2 right-2"
          initial={{ scale: 0 }}
          animate={{ scale: value.trim() ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handleSend}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!value.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};