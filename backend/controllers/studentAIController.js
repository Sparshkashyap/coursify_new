import Course from "../models/Course.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { apiVersion: "v1" },
});

const getFallbackRecommendations = (courses, query) => {
  const q = query.toLowerCase().trim();
  const queryWords = q.split(/\s+/).filter(Boolean);

  return courses
    .map((course) => {
      const title = (course.title || "").toLowerCase();
      const description = (course.description || "").toLowerCase();
      const instructor = (course.instructor?.name || "").toLowerCase();

      let score = 0;

      if (title.includes(q)) score += 8;
      if (description.includes(q)) score += 5;
      if (instructor.includes(q)) score += 2;

      for (const word of queryWords) {
        if (title.includes(word)) score += 3;
        if (description.includes(word)) score += 1;
        if (instructor.includes(word)) score += 1;
      }

      score += Number(course.rating || 0);
      score += Math.min((course.students?.length || 0) / 100, 3);

      return { course, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ course }) => ({
      ...course.toObject(),
      aiReason:
        "Recommended using fallback matching based on title, description, instructor, rating, and popularity.",
    }));
};

export const getAIRecommendedCourses = async (req, res) => {
  try {
    const query = req.body?.query?.trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const courses = await Course.find({
      $or: [{ status: "published" }, { status: { $exists: false } }],
    })
      .populate("instructor", "name")
      .sort({ rating: -1, createdAt: -1 })
      .limit(30);

    if (!courses.length) {
      return res.status(404).json({
        success: false,
        message: "No courses found",
      });
    }

    const compactCourses = courses.map((course) => ({
      id: course._id.toString(),
      title: course.title || "",
      description: course.description || "",
      price: course.price ?? 0,
      isFree: course.isFree ?? false,
      rating: course.rating || 0,
      studentsCount: course.students?.length || 0,
      instructor: course.instructor?.name || "Unknown",
    }));

    const prompt = `
You are a course recommendation assistant.

User request:
"${query}"

Available courses:
${JSON.stringify(compactCourses, null, 2)}

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "id": "course_id",
      "reason": "why this course fits the user"
    }
  ]
}

Rules:
- Recommend maximum 5 courses
- Only use ids from the provided courses
- Prioritize fit, price, practical value, and rating
- Do not add markdown
- Do not add extra explanation outside JSON
`;

    let parsed = null;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const rawText = response.text?.trim() || "";

      const cleanedText = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleanedText);
    } catch (aiErr) {
      console.error("STUDENT AI RECOMMEND ERROR:", aiErr);

      const fallbackCourses = getFallbackRecommendations(courses, query);

      return res.status(200).json({
        success: true,
        fallback: true,
        message:
          aiErr?.status === 429
            ? "AI recommendations are temporarily unavailable due to quota limits. Showing fallback recommendations."
            : "AI recommendations are unavailable right now. Showing fallback recommendations.",
        recommendations: fallbackCourses,
      });
    }

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray(parsed.recommendations)
    ) {
      const fallbackCourses = getFallbackRecommendations(courses, query);

      return res.status(200).json({
        success: true,
        fallback: true,
        message:
          "AI returned an invalid format. Showing fallback recommendations.",
        recommendations: fallbackCourses,
      });
    }

    const validCourseIds = new Set(
      courses.map((course) => course._id.toString())
    );

    const recommendationMap = new Map();

    for (const item of parsed.recommendations) {
      if (
        item &&
        typeof item.id === "string" &&
        validCourseIds.has(item.id)
      ) {
        recommendationMap.set(item.id, item.reason || "");
      }
    }

    const matchedCourses = courses
      .filter((course) => recommendationMap.has(course._id.toString()))
      .map((course) => ({
        ...course.toObject(),
        aiReason: recommendationMap.get(course._id.toString()) || "",
      }));

    if (!matchedCourses.length) {
      const fallbackCourses = getFallbackRecommendations(courses, query);

      return res.status(200).json({
        success: true,
        fallback: true,
        message:
          "AI did not return usable recommendations. Showing fallback recommendations.",
        recommendations: fallbackCourses,
      });
    }

    return res.status(200).json({
      success: true,
      fallback: false,
      recommendations: matchedCourses,
    });
  } catch (err) {
    console.error("STUDENT AI RECOMMEND ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};