"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send, Loader2, User, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are an expert technical interviewer at a top product company like Google, Microsoft, or Amazon. You are conducting a mock coding interview to help a student prepare for placements.

Your behavior:
- The candidate will choose between Mock Interview mode or Practice mode
- In Mock Interview mode: act strict like a real interviewer, ask one problem, evaluate their approach, ask follow-up questions on complexity and edge cases
- In Practice mode: be friendly, let them pick topic/difficulty, give hints when asked
- Always ask what their target company is to tailor the difficulty
- If they ask for hints, give small nudges without giving away the answer
- Ask follow-up questions like "What is the time complexity?", "Can you optimize this?", "What about edge cases?"
- Give encouraging feedback
- Stay in character throughout the conversation
- Keep responses concise and conversational (2-4 sentences max unless giving a problem)
- If they want a new problem, give them one`;

const INITIAL_MESSAGE = "Hey! 👋 Ready to ace your placement interviews?\n\nI can help you in two ways:\n1️⃣ Mock Interview — I'll act as a real interviewer, ask you problems, and evaluate your answers\n2️⃣ Practice Mode — Pick a topic and difficulty, and we'll solve problems together with hints\n\nWhich one would you like? And what's your target company — product (Google/Microsoft/Amazon) or service (TCS/Infosys/Wipro)?";

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: INITIAL_MESSAGE,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          messages: newMessages,
          systemPrompt: SYSTEM_PROMPT,
        }),
      });

      const data = await res.json();

      if (data.result) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.result },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I had trouble responding. Please try again." },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: INITIAL_MESSAGE,
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">

      {/* Header */}
      <div className="h-10 border-b border-white/10 flex items-center px-4 justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-violet-400" />
          <span className="text-gray-400 text-sm font-medium">AI Interviewer</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <button
          onClick={resetChat}
          className="text-gray-500 hover:text-gray-300 transition-colors"
          title="New Interview"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === "assistant" ? "bg-violet-600/30" : "bg-blue-600/30"
            }`}>
              {msg.role === "assistant"
                ? <Bot className="w-3 h-3 text-violet-400" />
                : <User className="w-3 h-3 text-blue-400" />
              }
            </div>
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
              msg.role === "assistant"
                ? "bg-gray-800 text-gray-200 rounded-tl-sm"
                : "bg-violet-600 text-white rounded-tr-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-violet-600/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-violet-400" />
            </div>
            <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-3 py-2">
              <Loader2 className="w-3 h-3 text-violet-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            size="sm"
            className="bg-violet-600 hover:bg-violet-700 text-white px-3 rounded-xl"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
