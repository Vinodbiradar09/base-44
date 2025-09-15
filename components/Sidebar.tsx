"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, X, Plus } from "lucide-react";
import { HistoryList } from "./HistoryList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  histories: { id: number; title: string; timestamp: string }[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewChat: () => void;
  onDelete: (id: number) => void;
  onRename: (id: number, newTitle: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  histories,
  searchQuery,
  onSearchChange,
  onNewChat,
  onDelete,
  onRename,
}) => {
  return (
    <div className={`flex flex-col h-full ${!isOpen ? 'hidden' : ''}`}>
   
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <motion.div
          className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Grok-like AI Icon"
        >
          <span className="text-white text-sm font-bold">AI</span> 
        </motion.div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

  
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400"
          />
        </div>
      </div>

   
      <div className="flex-1 overflow-y-auto p-2">
        <HistoryList
          histories={histories}
          onDelete={onDelete}
          onRename={onRename}
        />
      </div>

    
      <div className="p-4 border-t border-gray-700">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onNewChat}
            className="w-full bg-[#2a2a2a] hover:bg-gray-600 border-gray-600 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </motion.div>
      </div>
    </div>
  );
};