import React from "react";
import { useLocation } from "react-router-dom";
import ChatbotButton from "./temp";
import ChatbotWindow from "./ChatbotWindow";

const hiddenPaths = ["/login", "/signup", "/forgot-password"];

const ChatbotLauncher: React.FC = () => {
  const location = useLocation();

  const shouldHide =
    hiddenPaths.some((path) => location.pathname.startsWith(path)) ||
    location.pathname.startsWith("/reset-password");

  if (shouldHide) return null;

  return (
    <>
      <div className="fixed bottom-5 right-4 z-[9997] sm:bottom-6 sm:right-6">
        <ChatbotButton />
      </div>
      <ChatbotWindow />
    </>
  );
};

export default ChatbotLauncher;