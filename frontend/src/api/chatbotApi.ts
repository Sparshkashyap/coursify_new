import API from "@/api/axios";

export interface ChatbotPayload {
  message: string;
  role?: string;
  userName?: string;
  currentPath?: string;
}

export const sendChatbotMessage = async (payload: ChatbotPayload) => {
  const res = await API.post("/chatbot/message", payload);
  return res.data;
};