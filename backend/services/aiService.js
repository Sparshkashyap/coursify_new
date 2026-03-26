import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { apiVersion: "v1" },
});

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const cleanJson = (text = "") => {
  return text.replace(/```json/gi, "").replace(/```/g, "").trim();
};

export const generateQuizFromCourseContent = async ({
  course,
  topic = "",
  difficulty = "medium",
}) => {
  const prompt = `
You are an expert LMS quiz generator.

Generate exactly 10 high-quality multiple-choice quiz questions from the course content below.

Course title:
${course.title || ""}

Course description:
${course.description || ""}

Course notes:
${course.notes || ""}

Course transcript:
${course.transcript || ""}

Requested topic:
${topic || "Use the most important topic from the course"}

Difficulty:
${difficulty}

Return ONLY valid JSON in this format:
{
  "topic": "final topic used",
  "questions": [
    {
      "id": 1,
      "question": "string",
      "options": [
        "option 1",
        "option 2",
        "option 3",
        "option 4"
      ],
      "correctAnswer": "exact option text",
      "hint": "short useful hint",
      "explanation": "short explanation of the correct answer"
    }
  ]
}

Rules:
- Exactly 10 questions
- Exactly 4 options for each question
- Only 1 correct answer per question
- Questions must be important, practical, and essential for learning the topic
- Avoid duplicate questions
- Keep language simple and student-friendly
- Use only the course context
- Do not add markdown
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const raw = response.text?.trim() || "";
  const parsed = JSON.parse(cleanJson(raw));

  if (
    !parsed ||
    !Array.isArray(parsed.questions) ||
    parsed.questions.length !== 10
  ) {
    throw new Error("AI returned invalid quiz format");
  }

  for (const q of parsed.questions) {
    if (
      !q.question ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      !q.correctAnswer ||
      !q.hint ||
      !q.explanation
    ) {
      throw new Error("AI returned incomplete quiz question");
    }
  }

  return parsed;
};

export const askCourseDoubt = async ({ course, message }) => {
  const prompt = `
You are an AI learning assistant inside an LMS course.

Answer the student's question using only the course content below.
If the answer is not clearly present, say that the course content does not provide enough detail and give the best short guidance possible.

Course title:
${course.title || ""}

Course description:
${course.description || ""}

Course notes:
${course.notes || ""}

Course transcript:
${course.transcript || ""}

Student question:
${message}

Return ONLY valid JSON:
{
  "answer": "clear helpful answer for the student",
  "followUp": "one short follow-up suggestion",
  "nextLessonGuidance": "what the student should study next based on this doubt"
}
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const raw = response.text?.trim() || "";
  const parsed = JSON.parse(cleanJson(raw));

  if (!parsed || typeof parsed.answer !== "string") {
    throw new Error("AI returned invalid chat format");
  }

  return parsed;
};

export const generateCourseSummary = async ({ course }) => {
  const prompt = `
You are an AI learning assistant.

Create a concise study summary from the course content below.

Course title:
${course.title || ""}

Course description:
${course.description || ""}

Course notes:
${course.notes || ""}

Course transcript:
${course.transcript || ""}

Return ONLY valid JSON:
{
  "summary": "short student-friendly summary",
  "keyPoints": [
    "point 1",
    "point 2",
    "point 3"
  ],
  "revisionTip": "one revision tip"
}
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const raw = response.text?.trim() || "";
  const parsed = JSON.parse(cleanJson(raw));

  if (!parsed || typeof parsed.summary !== "string") {
    throw new Error("AI returned invalid summary format");
  }

  return parsed;
};

export const generateNextLessonGuidance = async ({ course }) => {
  const prompt = `
You are an AI learning assistant.

Based on the course content, tell the student what they should focus on next.

Course title:
${course.title || ""}

Course description:
${course.description || ""}

Course notes:
${course.notes || ""}

Course transcript:
${course.transcript || ""}

Return ONLY valid JSON:
{
  "guidance": "short practical next-step guidance",
  "focusAreas": [
    "focus 1",
    "focus 2",
    "focus 3"
  ]
}
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const raw = response.text?.trim() || "";
  const parsed = JSON.parse(cleanJson(raw));

  if (!parsed || typeof parsed.guidance !== "string") {
    throw new Error("AI returned invalid next lesson guidance format");
  }

  return parsed;
};