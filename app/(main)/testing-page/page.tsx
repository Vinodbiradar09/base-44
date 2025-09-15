"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "@/components/MainContent";
import { Navbar } from "@/components/Navbar";

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [histories, setHistories] = useState([
    { id: 1, title: "Chat 1", timestamp: "2025-09-15" },
    { id: 2, title: "Chat 2", timestamp: "2025-09-14" },
  
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");

 
  const handleNewChat = () => {

    console.log("New chat created");
    setHistories([...histories, { id: Date.now(), title: "New Chat", timestamp: new Date().toISOString().split('T')[0] }]);
  };

  const handleDelete = (id: number) => {
  
    setHistories(histories.filter(h => h.id !== id));
  };

  const handleRename = (id: number, newTitle: string) => {
  
    setHistories(histories.map(h => h.id === id ? { ...h, title: newTitle } : h));
  };


  const filteredHistories = histories.filter(h => 
    h.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Navbar appName="base44" />
      
      <div className="flex flex-1 overflow-hidden">
     
        <motion.div
          initial={false}
          animate={{ width: isSidebarOpen ? "300px" : "0px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-[#1a1a1a] border-r border-gray-700 overflow-hidden"
        >
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            histories={filteredHistories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNewChat={handleNewChat}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        </motion.div>

     
        <MainContent
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={() => {
            if (inputValue.trim()) {
              console.log("Send message:", inputValue);
              setInputValue("");
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatPage;