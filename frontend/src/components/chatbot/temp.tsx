import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { useChatbot } from "@/contexts/ChatbotContext";

const ChatbotButton: React.FC = () => {
  const { open, setOpen, unreadCount } = useChatbot();

  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => setOpen((prev) => !prev)}
      className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_15px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all"
      aria-label="Open chatbot"
      type="button"
    >
      {/* Gradient Glow Background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/40 via-purple-500/30 to-blue-500/30 blur-xl opacity-70" />

      {/* Pulse Ring */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-primary/20 opacity-75 animate-ping"></span>

      {/* Icon */}
      <MessageCircle className="relative z-10 h-7 w-7 text-primary" />

      {/* Notification badge */}
      {unreadCount > 0 && (
        <div className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-lg">
          {unreadCount}
        </div>
      )}

      {/* Sparkle */}
      <Sparkles className="absolute bottom-1 right-1 h-3 w-3 text-primary opacity-80" />
    </motion.button>
  );
};

export default ChatbotButton;