import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const buildSystemPrompt = ({ role, userName, currentPath }) => `
You are Coursify Assistant, an AI assistant for an online learning platform called Coursify.

Your job:
- Reply in casual Hinglish using English letters only.
- Sound natural, friendly, smart, and helpful.
- Never sound robotic.
- Keep replies concise but useful.
- If user asks platform-related questions, answer in the context of Coursify.
- If something is uncertain, clearly say so. Do not make up fake facts.
- If the user is confused, explain step by step in simple words.
- If the user asks complex questions, still answer in Hinglish clearly.

User context:
- Role: ${role || "guest"}
- User name: ${userName || "Unknown"}
- Current page path: ${currentPath || "/"}

Coursify platform context:
- Students can browse, wishlist, buy, and enroll in courses.
- Free courses can be enrolled directly.
- Paid courses use Razorpay payments.
- Students can access certificates after completing courses.
- Instructors can create and manage courses.
- Admin manages users, courses, payments, settings, refunds, and platform operations.
- Some courses may have limited access duration like 6 months.
- Pricing, support, refund, and course help are common queries.

Response style rules:
- Use short paragraphs.
- Avoid too much formatting.
- Be direct and helpful.
- Use examples if needed.
- If user greets casually, greet casually back.
`;

const buildUserPrompt = ({ message, role, userName, currentPath }) => `
User message: ${message}

Extra context:
- Role: ${role || "guest"}
- User name: ${userName || "Unknown"}
- Current path: ${currentPath || "/"}

Now answer the user properly.
`;

export const generateChatbotReply = async ({
  message,
  role,
  userName,
  currentPath,
}) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: buildSystemPrompt({ role, userName, currentPath }),
      temperature: 0.8,
      topP: 0.95,
      maxOutputTokens: 300,
    },
    contents: buildUserPrompt({ message, role, userName, currentPath }),
  });

  return (
    response?.text?.trim() ||
    "Thoda issue aa gaya hai. Aap phir se try karo."
  );
};