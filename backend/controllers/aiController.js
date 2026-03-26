import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateCourseDescription = async (req, res) => {
  try {
    const { topic, audience, outcomes, tone } = req.body;

    console.log("AI USER:", req.user);

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is missing in .env",
      });
    }

    const prompt = `
You are an expert edtech course copywriter.

Write a high-quality professional course description for an online learning platform.

Course topic: ${topic}
Target audience: ${audience || "General learners"}
Learning outcomes: ${outcomes || "Understand concepts and apply them practically"}
Tone: ${tone || "Professional, clear, engaging"}

Requirements:
1. Write in simple, strong, natural English.
2. Make it sound premium and production-ready.
3. Keep it concise but valuable.
4. Output only the final course description.
5. Do not use bullet points.
6. Do not mention that this was AI-generated.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const description = response?.text?.trim();

    if (!description) {
      return res.status(500).json({
        success: false,
        message: "No description generated",
      });
    }

    return res.json({
      success: true,
      description,
    });
  } catch (err) {
    console.error("AI GENERATOR ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};