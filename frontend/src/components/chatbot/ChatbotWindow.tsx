import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  X,
  Loader2,
  Minimize2,
  MessageSquareText,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useChatbot } from "@/contexts/ChatbotContext";
import { useAuth } from "@/contexts/AuthContext";
import ChatbotMessage from "./ChatbotMessage";
import { sendChatbotMessage } from "@/api/chatbotApi";

const publicSuggestions = [
  "Courses kaise browse karu?",
  "Pricing kya hai?",
  "Signup kaise karu?",
  "Contact support",
];

const studentSuggestions = [
  "Mere liye kaunsa course best rahega?",
  "Payment hua but access nahi mila",
  "Certificate kaise milega?",
  "Wishlist kaise kaam karti hai?",
];

const instructorSuggestions = [
  "Course create kaise karu?",
  "Students ka data kaha milega?",
  "Course pricing kaise decide karu?",
  "Earnings section kaise use karu?",
];

const adminSuggestions = [
  "Admin dashboard kaise use karu?",
  "Payments kaha dekh sakta hu?",
  "Courses moderation kaise hoti hai?",
  "Users manage kaise karu?",
];

const ChatbotWindow: React.FC = () => {
  const { open, setOpen, messages, setMessages, setUnreadCount } = useChatbot();
  const { user } = useAuth();
  const location = useLocation();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestions = !user
    ? publicSuggestions
    : user.role === "student"
    ? studentSuggestions
    : user.role === "instructor"
    ? instructorSuggestions
    : adminSuggestions;

  useEffect(() => {
    if (open) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages.length, setUnreadCount]);

  const pushMessage = (type: "bot" | "user", text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${type}-${Date.now()}-${Math.random()}`,
        type,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleSend = async (forcedText?: string) => {
    const finalText = (forcedText ?? input).trim();
    if (!finalText || sending) return;

    pushMessage("user", finalText);
    setInput("");
    setSending(true);

    try {
      const data = await sendChatbotMessage({
        message: finalText,
        role: user?.role,
        userName: user?.name,
        currentPath: location.pathname,
      });

      pushMessage(
        "bot",
        data?.reply || "Thoda issue aa gaya hai. Aap phir se try karo."
      );
    } catch (error) {
      pushMessage(
        "bot",
        "Thoda network ya server issue aa gaya hai. Aap 1 baar phir try karo."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-24 right-4 z-[9998] flex h-[34rem] w-[22rem] flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/95 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:right-6 sm:w-[24rem]"
        >
          <div className="relative border-b border-border/70 px-5 py-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_42%)]" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-primary/10 text-primary">
                  <Bot className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">
                    Coursify AI Assistant
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {user ? `Talking as ${user.role}` : "General help mode"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Minimize chatbot"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Close chatbot"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-border/60 px-4 py-3">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSend(item)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <ChatbotMessage key={message.id} message={message} />
            ))}

            {sending && (
              <div className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-md border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Soch raha hoon...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border/70 p-4">
            <div className="mb-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Hinglish me pucho. Complex sawal bhi chalega.
            </div>

            <div className="flex items-center gap-2 rounded-2xl border bg-card/80 p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageSquareText className="h-4 w-4" />
              </div>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Type in Hinglish..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={sending || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatbotWindow;