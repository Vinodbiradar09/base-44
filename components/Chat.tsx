
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, Variants } from "framer-motion";

type MessagePart = {
  type: "text" | "code";
  content: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  parts: MessagePart[];
};

function parseContent(content: string): MessagePart[] {
  const parts: MessagePart[] = [];
  const regex = /```(\w+)?\n([\s\S]*?)\n```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      });
    }
    parts.push({
      type: "code",
      content: match[2],
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      content: content.slice(lastIndex),
    });
  }

  if (parts.length === 0) {
    parts.push({ type: "text", content: content });
  }

  return parts.filter(part => part.content.trim() !== '');
}

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

const messageVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const buttonVariants: Variants = {
  initial: { scale: 1, boxShadow: "0 0 0 rgba(255, 255, 255, 0)" },
  hover: {
    scale: 1.1,
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
    transition: { duration: 0.3, type: "spring", stiffness: 150 },
  },
  tap: { scale: 0.9 },
};

const textareaVariants: Variants = {
  initial: { scale: 1, boxShadow: "0 0 0 rgba(255, 255, 255, 0)" },
  focus: {
    scale: 1.02,
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
    transition: { duration: 0.3 },
  },
};

export default function ChatBox() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/first-chat-window?chatId=${chatId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await res.json();
      const formattedMessages: ChatMessage[] = data.messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        parts: msg.role === "user" ? [{ type: "text", content: msg.content.trim() }] : parseContent(msg.content),
      }));
      setMessages(formattedMessages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  }, [chatId]);

 
  useEffect(() => {
    const storedChatId = localStorage.getItem('chatId') || "";
    setChatId(storedChatId);
  }, []);

 
  useEffect(() => {
    if (chatId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [chatId, fetchMessages]);

 
  useEffect(() => {
    if (chatId) {
      localStorage.setItem('chatId', chatId);
    } else {
      localStorage.removeItem('chatId');
    }
  }, [chatId]);

 
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewChat = () => {
    setChatId("");
    setMessages([]);
    setError(null);
    setContent("");
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch(err => console.error("Failed to copy: ", err));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setError(null);
    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ type: "text", content: content.trim() }],
    };
    setMessages((prev) => [...prev, userMessage]);
    setContent("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", parts: [] }]);
    const assistantIndex = messages.length + 1;

    let currentResponse = "";

    try {
      const res = await fetch("/api/first-chat-window", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content.trim(), chatId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "API request failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n").filter((line) => line.startsWith("data: "));

          for (const line of lines) {
            const data = JSON.parse(line.replace("data: ", ""));
            if (data.chunk) {
              currentResponse += data.chunk;
              setMessages((prev) => {
                const newMsgs = [...prev];
                newMsgs[assistantIndex].parts = [{ type: "text", content: currentResponse }];
                return newMsgs;
              });
            } else if (data.chatId) {
              setChatId(data.chatId);
            }
          }
        }
      }

      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[assistantIndex].parts = parseContent(currentResponse);
        return newMsgs;
      });
    } catch (err: any) {
      console.error("Error streaming response:", err);
      setError(err.message || "Failed to fetch response");
      setMessages((prev) => prev.slice(0, -2));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      className="flex flex-col h-full max-w-4xl w-full bg-[#0A0A0B] text-[#E5E7EB] border border-[#2D2D2D] rounded-xl shadow-2xl overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-4 border-b border-[#2D2D2D] font-semibold text-lg bg-[#0A0A0B]">
        Hook with 44
      </div>
      <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0A0A0B]">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            variants={messageVariants}
          >
            <div className={`relative max-w-[80%] p-4 rounded-lg ${msg.role === "user" ? "bg-[#2D2D2D] text-[#E5E7EB]" : "bg-[#1F1F1F] text-[#E5E7EB]"} shadow-md`}>
              {msg.parts.map((part, j) =>
                part.type === "code" ? (
                  <div key={j} className="relative">
                    <pre className="bg-[#1A1A1A] text-[#4ADE80] p-3 rounded-md overflow-x-auto whitespace-pre-wrap my-2 font-mono text-sm">
                      <code>{part.content}</code>
                    </pre>
                    {msg.role === "assistant" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-[#6B7280] hover:text-[#E5E7EB] relative"
                        onClick={() => copyToClipboard(part.content, i)}
                      >
                        <Copy size={16} />
                        {copiedIndex === i && (
                          <span className="absolute top-8 right-0 bg-[#2D2D2D] text-[#E5E7EB] text-xs px-2 py-1 rounded-md shadow">
                            Copied!
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                ) : (
                  <p key={j} className="text-[#E5E7EB] whitespace-pre-wrap break-words">{part.content}</p>
                )
              )}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.p
            className="text-[#6B7280] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            44 is cooking...
          </motion.p>
        )}
        {error && (
          <motion.p
            className="text-[#F87171] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}{error.includes("full") ? ". Click + to create a new chat." : ""}
          </motion.p>
        )}
      </div>
      <motion.div
        className="p-4 border-t border-[#2D2D2D] bg-[#0A0A0B] relative"
        variants={textareaVariants}
        initial="initial"
        animate={content ? "focus" : "initial"}
      >
        <Textarea
          ref={textareaRef}
          className="flex-1 bg-[#1F1F1F] text-[#E5E7EB] border-[#2D2D2D] placeholder-[#6B7280] focus:border-[#4B5563] rounded-lg resize-none h-20 max-h-32 overflow-y-auto pr-20"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex gap-2">
          <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
            <Button
              onClick={handleNewChat}
              variant="ghost"
              size="icon"
              className="text-[#E5E7EB] hover:bg-[#2D2D2D] rounded-full"
            >
              <Plus size={20} />
            </Button>
          </motion.div>
          <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
            <Button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              size="icon"
              className="bg-[#2D2D2D] text-[#E5E7EB] hover:bg-[#4B5563] rounded-full"
            >
              <Send size={16} />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}