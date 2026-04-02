import React from "react";
import { Bot, User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatbotMessageItem } from "@/contexts/ChatbotContext";

interface Props {
  message: ChatbotMessageItem;
}

const ChatbotMessage: React.FC<Props> = ({ message }) => {
  const isBot = message.type === "bot";

  return (
    <div
      className={cn(
        "flex gap-3",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
          isBot
            ? "rounded-tl-md border bg-card text-foreground"
            : "rounded-tr-md bg-primary text-primary-foreground"
        )}
      >
        {message.text}
      </div>

      {!isBot && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-foreground">
          <User2 className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default ChatbotMessage;