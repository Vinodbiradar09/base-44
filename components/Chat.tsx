
"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export default function ChatBox() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string>(typeof window !== 'undefined' ? localStorage.getItem('chatId') || "" : "");
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
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

  const fetchMessages = async () => {
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
  };

  const handleNewChat = () => {
    setChatId("");
    setMessages([]);
    setError(null);
    setContent("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => console.error("Failed to copy: ", err));
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
              const part = data.chunk;
              currentResponse += part;
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
    } catch (err) {
      console.error("Error streaming response:", err);
      setError("Failed to fetch response");
      setMessages((prev) => prev.slice(0, -2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl w-full bg-black text-white border border-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-800 font-semibold text-lg">Chat with AI</div>
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-black">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`relative max-w-[80%] p-3 rounded-lg ${msg.role === "user" ? "bg-gray-800 text-white" : "bg-gray-900 text-white"}`}>
              {msg.parts.map((part, j) =>
                part.type === "code" ? (
                  <pre key={j} className="bg-black text-green-300 p-3 rounded-md overflow-x-auto whitespace-pre-wrap my-2">
                    <code>{part.content}</code>
                  </pre>
                ) : (
                  <p key={j} className="text-white whitespace-pre-wrap break-words">{part.content}</p>
                )
              )}
              {msg.role === "assistant" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  onClick={() => copyToClipboard(msg.parts.map(p => p.content).join('\n\n'))}
                >
                  <Copy size={16} />
                </Button>
              )}
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-400 text-center">AI is thinking...</p>}
        {error && <p className="text-red-400 text-center">{error}{error.includes("full") ? ". Click + to create a new chat." : ""}</p>}
      </div>
      <div className="p-4 border-t border-gray-800 flex items-center gap-2 bg-black">
        <Button onClick={handleNewChat} variant="ghost" size="icon" className="text-white hover:bg-gray-800">
          <Plus size={20} />
        </Button>
        <Input
          className="flex-1 bg-gray-900 text-white border-gray-800 placeholder-gray-400 focus:border-gray-600"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
        <Button onClick={handleSubmit} disabled={loading || !content.trim()} size="icon" className="bg-gray-800 text-white hover:bg-gray-700 rounded-full">
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}