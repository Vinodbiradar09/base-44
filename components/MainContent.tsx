"use client";

import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { InputArea } from "./InputArea";
import { Button } from "@/components/ui/button";

interface MainContentProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({ inputValue, onInputChange, onSend }) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-black">
      {/* Chat Area - Scrollable, empty for now */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center text-gray-500 py-8">
          Start a conversation...
        </div>
        {/* Add message components here later */}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4">
        <InputArea
          value={inputValue}
          onChange={onInputChange}
          onSend={onSend}
        />
      </div>
    </div>
  );
};