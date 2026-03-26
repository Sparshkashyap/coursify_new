import React, { useState } from "react";
import { askCourseAssistant, getCourseSummary, getNextLessonGuidance } from "@/api/courseAssistantApi";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Sparkles, BookOpenCheck } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  courseId: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const CourseAIChat: React.FC<Props> = ({ courseId }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! Ask me anything about this course. I can explain concepts, summarize the lesson, and guide you on what to study next.",
    },
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const data = await askCourseAssistant(courseId, userMessage);
      const aiText = [
        data?.response?.answer,
        data?.response?.followUp ? `Follow-up: ${data.response.followUp}` : "",
        data?.response?.nextLessonGuidance
          ? `Next step: ${data.response.nextLessonGuidance}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      setMessages((prev) => [...prev, { role: "assistant", text: aiText }]);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleSummary = async () => {
    setLoading(true);
    try {
      const data = await getCourseSummary(courseId);
      const text = [
        data?.summary?.summary,
        Array.isArray(data?.summary?.keyPoints)
          ? `Key points:\n- ${data.summary.keyPoints.join("\n- ")}`
          : "",
        data?.summary?.revisionTip
          ? `Revision tip: ${data.summary.revisionTip}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text },
      ]);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  const handleNextLesson = async () => {
    setLoading(true);
    try {
      const data = await getNextLessonGuidance(courseId);
      const text = [
        data?.guidance?.guidance,
        Array.isArray(data?.guidance?.focusAreas)
          ? `Focus areas:\n- ${data.guidance.focusAreas.join("\n- ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text },
      ]);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to generate next lesson guidance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">AI Learning Assistant</h2>
          <p className="text-sm text-muted-foreground">
            Ask doubts, get summaries, and know what to study next.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleSummary} disabled={loading}>
            <Sparkles className="mr-2 h-4 w-4" />
            Summary
          </Button>
          <Button variant="outline" onClick={handleNextLesson} disabled={loading}>
            <BookOpenCheck className="mr-2 h-4 w-4" />
            Next Lesson
          </Button>
        </div>
      </div>

      <div className="mb-4 max-h-[360px] space-y-3 overflow-y-auto rounded-2xl border bg-background p-4">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
              item.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            <div className="whitespace-pre-wrap">{item.text}</div>
          </div>
        ))}

        {loading && (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking...
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything about this course..."
          className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none ring-0"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <Button onClick={handleSend} disabled={loading || !message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CourseAIChat;