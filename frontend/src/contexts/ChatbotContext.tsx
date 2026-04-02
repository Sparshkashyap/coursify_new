import React, { createContext, useContext, useMemo, useState } from "react";

export type ChatbotMessageType = "bot" | "user";

export interface ChatbotMessageItem {
  id: string;
  type: ChatbotMessageType;
  text: string;
  createdAt: string;
}

interface ChatbotContextType    {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  messages: ChatbotMessageItem[];
  setMessages: React.Dispatch<React.SetStateAction<ChatbotMessageItem[]>>;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const ChatbotContext = createContext<ChatbotContextType | null>(null);

const initialBotMessage: ChatbotMessageItem = {
  id: "welcome-message",
  type: "bot",
  text: "Aur dost, kya haal hai? Main Coursify assistant hoon. Aaj aapki kis cheez me help karu?",
  createdAt: new Date().toISOString(),
};

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessageItem[]>([
    initialBotMessage,
  ]);
  const [unreadCount, setUnreadCount] = useState(1);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      messages,
      setMessages,
      unreadCount,
      setUnreadCount,
    }),
    [open, messages, unreadCount]
  );

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);

  if (!context) {
    throw new Error("useChatbot must be used inside ChatbotProvider");
  }

  return context;
};