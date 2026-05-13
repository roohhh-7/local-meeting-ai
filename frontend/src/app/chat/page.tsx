"use client";

import { Sidebar } from "@/components/Sidebar";
 import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import api from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your Meeting Assistant. Ask me anything about your previous meetings." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", { query: input });
      setMessages(prev => [...prev, { role: "assistant", content: response.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please check if Ollama is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-accent/5">
        <header className="p-4 border-b bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Meeting Intelligence Chat</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Local AI (Llama 3)
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-3xl",
                m.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                m.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {m.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl",
                m.role === "assistant" ? "bg-card border" : "bg-primary text-primary-foreground"
              )}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="bg-card border p-4 rounded-2xl flex items-center gap-2">
                <Loader2 size={18} className="animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-background border-t">
          <div className="max-w-4xl mx-auto flex gap-4 items-end bg-card p-2 rounded-2xl border shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
            <Button variant="ghost" size="icon" className="shrink-0 rounded-xl">
              <Paperclip size={20} />
            </Button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask anything about your meetings..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 min-h-[50px] max-h-[200px]"
              rows={1}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || loading}
              className="shrink-0 rounded-xl w-12 h-12"
            >
              <Send size={20} />
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-4">
            AI can make mistakes. Verify important information with the original transcript.
          </p>
        </div>
      </main>
    </div>
  );
}
