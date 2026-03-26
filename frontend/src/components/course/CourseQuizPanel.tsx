import React, { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { generateCourseQuiz } from "@/api/courseAssistantApi";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Clock3,
  Lightbulb,
  Loader2,
  RotateCcw,
  Coins,
  CheckCircle2,
  XCircle,
  Trophy,
} from "lucide-react";

type Props = {
  courseId: string;
};

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
};

type QuizPayload = {
  topic: string;
  questions: QuizQuestion[];
};

const TOTAL_QUESTIONS = 10;
const TOTAL_HINT_COINS = 3;
const QUESTION_TIME = 30;

const CourseQuizPanel: React.FC<Props> = ({ courseId }) => {
  const [quizSet, setQuizSet] = useState<QuizPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintCoins, setHintCoins] = useState(TOTAL_HINT_COINS);
  const [showHint, setShowHint] = useState(false);

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = useMemo(() => {
    return quizSet?.questions?.[currentIndex] || null;
  }, [quizSet, currentIndex]);

  useEffect(() => {
    if (!currentQuestion || answered || quizFinished) return;

    if (timeLeft <= 0) {
      setAnswered(true);
      setIsCorrect(false);
      setWrongCount((prev) => prev + 1);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, currentQuestion, answered, quizFinished]);

  const resetQuestionState = () => {
    setSelected("");
    setAnswered(false);
    setIsCorrect(null);
    setShowHint(false);
    setTimeLeft(QUESTION_TIME);
  };

  const resetFullQuizState = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setHintCoins(TOTAL_HINT_COINS);
    setQuizFinished(false);
    resetQuestionState();
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      const data = await generateCourseQuiz(courseId, {
        topic,
        difficulty,
      });

      setQuizSet(data?.quiz || null);
      resetFullQuizState();
      toast.success("New 10-question quiz generated");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    if (!currentQuestion || answered) return;

    setSelected(option);
    setAnswered(true);

    if (option === currentQuestion.correctAnswer) {
      setIsCorrect(true);
      setCorrectCount((prev) => prev + 1);
    } else {
      setIsCorrect(false);
      setWrongCount((prev) => prev + 1);
    }
  };

  const handleUseHint = () => {
    if (!currentQuestion || answered) return;

    if (hintCoins <= 0) {
      toast.error("No hint coins left");
      return;
    }

    if (showHint) return;

    setHintCoins((prev) => prev - 1);
    setShowHint(true);
  };

  const handleNextQuestion = () => {
    if (!quizSet) return;

    const isLast = currentIndex >= quizSet.questions.length - 1;

    if (isLast) {
      setQuizFinished(true);

      if (correctCount >= 8) {
        confetti({
          particleCount: 180,
          spread: 90,
          origin: { y: 0.6 },
        });
        toast.success("You win the quiz");
      }
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    resetQuestionState();
  };

  const optionClass = (option: string) => {
    if (!answered) {
      return "border-border bg-background hover:border-primary/40 hover:bg-primary/5";
    }

    if (option === currentQuestion?.correctAnswer) {
      return "border-green-500 bg-green-50 text-green-700";
    }

    if (option === selected && option !== currentQuestion?.correctAnswer) {
      return "border-red-500 bg-red-50 text-red-700";
    }

    return "border-border bg-background opacity-80";
  };

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">AI Quiz Generator</h2>
        <p className="text-sm text-muted-foreground">
          Generate 10 important topic-based questions with timer, hint coins, and result tracking.
        </p>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_170px_auto]">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Optional topic, e.g. React Hooks"
          className="rounded-xl border bg-background px-4 py-3 text-sm outline-none"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
          className="rounded-xl border bg-background px-4 py-3 text-sm outline-none"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <Button onClick={handleGenerateQuiz} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            "Generate / New Quiz"
          )}
        </Button>
      </div>

      {!quizSet || !currentQuestion ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Generate a 10-question quiz from this course content.
        </div>
      ) : quizFinished ? (
        <div className="space-y-5">
          <div className="rounded-3xl border bg-background p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-8 w-8 text-primary" />
            </div>

            <h3 className="text-2xl font-bold">Quiz Completed</h3>
            <p className="mt-2 text-muted-foreground">
              Topic: {quizSet.topic || topic || "Course topic"}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="text-2xl font-bold text-green-600">{correctCount}</p>
              </div>
              <div className="rounded-2xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Wrong</p>
                <p className="text-2xl font-bold text-red-600">{wrongCount}</p>
              </div>
              <div className="rounded-2xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">{correctCount}/{TOTAL_QUESTIONS}</p>
              </div>
            </div>

            {correctCount >= 8 ? (
              <div className="mt-6 rounded-2xl border border-green-500 bg-green-50 p-4 text-green-700">
                <p className="text-lg font-semibold">You win the quiz</p>
                <p className="mt-1 text-sm">
                  Great work. You scored {correctCount}/{TOTAL_QUESTIONS}.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-amber-400 bg-amber-50 p-4 text-amber-700">
                <p className="text-lg font-semibold">Keep practicing</p>
                <p className="mt-1 text-sm">
                  You scored {correctCount}/{TOTAL_QUESTIONS}. Generate a new quiz and try again.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Button onClick={handleGenerateQuiz} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                New Quiz
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-background p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Topic: {quizSet.topic || topic || "Course topic"}
              </p>
              <p className="text-sm text-muted-foreground">
                Question {currentIndex + 1} / {TOTAL_QUESTIONS}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                <Clock3 className="mr-2 inline h-4 w-4" />
                {timeLeft}s
              </span>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                <Coins className="mr-2 inline h-4 w-4" />
                {hintCoins} hint coins
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                <CheckCircle2 className="mr-2 inline h-4 w-4" />
                {correctCount}
              </span>

              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                <XCircle className="mr-2 inline h-4 w-4" />
                {wrongCount}
              </span>
            </div>
          </div>

          {showHint && (
            <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
              <span className="font-medium">Hint:</span> {currentQuestion.hint}
            </div>
          )}

          <div className="rounded-2xl border bg-background p-5">
            <h3 className="text-lg font-semibold text-foreground">
              {currentQuestion.question}
            </h3>

            <div className="mt-4 grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${optionClass(option)}`}
                  onClick={() => handleOptionClick(option)}
                  disabled={answered}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {!answered && (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleUseHint}
                disabled={hintCoins <= 0 || showHint}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Use Hint
              </Button>
            </div>
          )}

          {answered && (
            <div className="space-y-4">
              {isCorrect ? (
                <div className="rounded-2xl border border-green-500 bg-green-50 p-4 text-sm text-green-700">
                  <p className="font-semibold">Correct</p>
                  <p className="mt-1">{currentQuestion.explanation}</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-red-500 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold">Wrong</p>
                  <p className="mt-1">Correct answer: {currentQuestion.correctAnswer}</p>
                  <p className="mt-3">{currentQuestion.explanation}</p>
                </div>
              )}

              <Button onClick={handleNextQuestion}>
                {currentIndex === TOTAL_QUESTIONS - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseQuizPanel;