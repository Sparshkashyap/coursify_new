import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Wand2, Sparkles, Loader2, Check } from "lucide-react";
import { generateCourseDescription } from "@/api/aiApi";
import { toast, ToastContainer } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const InstructorAIGenerator: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [tone, setTone] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Topic is required");
      return;
    }

    try {
      setLoading(true);
      setResult("");
      setCopied(false);

      const data = await generateCourseDescription({
        topic,
        audience,
        outcomes,
        tone,
      });

      if (data.success) {
        setResult(data.description || "");
        toast.success("Description generated");
      } else {
        toast.error(data.message || "Generation failed");
      }
    } catch (err: any) {
      console.error("AI FRONTEND ERROR:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      if (!result) return;
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success("Copied to clipboard");

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      console.error("COPY ERROR:", err);
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-2xl font-bold">AI Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate professional course descriptions using AI.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.05 }}
      >
        <Card className="rounded-3xl border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Generate Course Description</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              placeholder="Course topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <Input
              placeholder="Audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />

            <Input
              placeholder="Learning outcomes"
              value={outcomes}
              onChange={(e) => setOutcomes(e.target.value)}
            />

            <Input
              placeholder="Tone (professional, practical, engaging)"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            />

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={!result || loading}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-3xl border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Generated Output</CardTitle>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!result || loading}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Output
                </>
              )}
            </Button>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI is generating your course description...
                </div>

                <div className="mt-4 space-y-3">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-10/12 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-9/12 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ) : result ? (
              <Textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="min-h-[220px] resize-y rounded-2xl border bg-muted/30 p-4 text-sm leading-7"
              />
            ) : (
              <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                <Sparkles className="mx-auto mb-3 h-6 w-6" />
                No generated description yet
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default InstructorAIGenerator;