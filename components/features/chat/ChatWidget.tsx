"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput("");
  };

  const getMessageContent = (message: {
    role: string;
    parts?: Array<{ type: string; text?: string }>;
  }) => {
    if (!message.parts) return "";
    return message.parts
      .filter(
        (p): p is { type: string; text: string } =>
          p.type === "text" && typeof p.text === "string",
      )
      .map((p) => p.text)
      .join("");
  };

  return (
    <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className={cn(
            "card border:none flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden shadow-xl",
            "rounded-[var(--radius)]",
          )}
        >
          <div className="card-header announcement-bar px-4 py-3">
            <h3 className="font-medium">Shop Assistant</h3>
            <p className="text-xs text-white">
              Products, orders — reply in your language
            </p>
          </div>

          <div className="flex max-h-80 flex-1 flex-col overflow-hidden bg-background">
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <p className="text-muted text-center text-sm" dir="auto">
                  Hello! How can I help you?
                </p>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "rounded-[var(--radius)] px-3 py-2 text-sm",
                    message.role === "user"
                      ? "ml-8 border border-brand text-white"
                      : "mr-8  text-foreground",
                  )}
                >
                  <p className="whitespace-pre-wrap" dir="auto">
                    {getMessageContent(message)}
                  </p>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="mr-8 flex items-center gap-1.5 rounded-[var(--radius)] bg-gray-light px-4 py-3">
                  <span className="animate-typing-dot h-2 w-2 rounded-full bg-foreground/70 [animation-delay:0ms]" />
                  <span className="animate-typing-dot h-2 w-2 rounded-full bg-foreground/70 [animation-delay:160ms]" />
                  <span className="animate-typing-dot h-2 w-2 rounded-full bg-foreground/70 [animation-delay:320ms]" />
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="card-footer p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  dir="auto"
                  placeholder="Message…"
                  className="flex-1 rounded-[var(--radius)] border border-input px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand disabled:opacity-50"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="default"
                  className="h-10 w-10 rounded-full bg-brand text-accent-foreground hover:bg-accent/90"
                  disabled={isLoading || !input.trim()}
                  // className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Button
        onClick={() => setOpen(!open)}
        variant="accent"
        className="h-12 w-12 rounded-full  bg-brand"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
}
