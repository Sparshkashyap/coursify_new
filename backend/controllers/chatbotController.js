import { generateChatbotReply } from "../services/chatbotService.js";

export const handleChatbotMessage = async (req, res) => {
  try {
    const { message, role, userName, currentPath } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await generateChatbotReply({
      message: String(message).trim(),
      role,
      userName,
      currentPath,
    });

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process chatbot message",
    });
  }
};