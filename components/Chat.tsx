"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


type MessagePart = {
  type: "text" | "code";
  content: string;
};

interface GeminiResponse {
  optimizedCode: string;
  issuesAndFixes: string;
  performanceMetrics: string;
  scalingArchitecture: string;
  implementationRoadmap: string;
  productionDeployment: string;
}

export default function ChatBox() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessagePart[]>([]);
  const [sections, setSections] = useState<GeminiResponse | null>(null);

  let isCodeBlock = false;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setMessages([]);
    setSections(null);

    try {
      const res = await fetch("/api/first-chat-window", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, chatId }),
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
              if (part.includes("```")) {
                isCodeBlock = !isCodeBlock;
                continue;
              }

              setMessages((prev) => [
                ...prev,
                { type: isCodeBlock ? "code" : "text", content: part },
              ]);
            }
            else {
              if (data.chat?._id) {
                setChatId(data.chat._id);
              }
              if (data.sections) {
                setSections(data.sections as GeminiResponse);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Error streaming response:", err);
      setError("Failed to fetch response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b font-semibold">Chat with AI</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) =>
          msg.type === "code" ? (
            <pre
              key={i}
              className="bg-black text-white p-3 rounded-md overflow-x-auto whitespace-pre-wrap"
            >
              <code>{msg.content}</code>
            </pre>
          ) : (
            <p key={i} className="text-gray-800 whitespace-pre-wrap">{msg.content}</p>
          )
        )}
        {sections && (
          <div className="mt-6 space-y-2 border-t pt-4">
            <h3 className="font-semibold">Analysis</h3>
            <p><strong>Optimized Code:</strong> {sections.optimizedCode}</p>
            <p><strong>Issues & Fixes:</strong> {sections.issuesAndFixes}</p>
            <p><strong>Performance Metrics:</strong> {sections.performanceMetrics}</p>
            <p><strong>Scaling Architecture:</strong> {sections.scalingArchitecture}</p>
            <p><strong>Implementation Roadmap:</strong> {sections.implementationRoadmap}</p>
            <p><strong>Production Deployment:</strong> {sections.productionDeployment}</p>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="p-4 border-t flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
        <Button onClick={handleSubmit} disabled={loading || !content.trim()} size="icon" className="rounded-full">
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
