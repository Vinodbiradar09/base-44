"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface HistoryItemProps {
  history: { id: number; title: string; timestamp: string };
  onDelete: (id: number) => void;
  onRename: (id: number, newTitle: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ history, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(history.title);

  const handleRename = () => {
    if (editTitle.trim()) {
      onRename(history.id, editTitle);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename();
    if (e.key === 'Escape') {
      setEditTitle(history.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      className="relative p-3 bg-[#2a2a2a] rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-700"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* 3-Dot Menu on Hover */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="absolute right-2 top-2 opacity-0 group-hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#2a2a2a] border-gray-600 text-white">
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(history.id)} className="text-red-400">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditing ? (
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          autoFocus
          className="bg-transparent border-0 p-0 text-white"
        />
      ) : (
        <div className="group">
          <h3 className="font-medium truncate">{history.title}</h3>
          <p className="text-xs text-gray-400">{history.timestamp}</p>
        </div>
      )}
    </motion.div>
  );
};