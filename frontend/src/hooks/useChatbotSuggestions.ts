import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

const useChatbotSuggestions = () => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) {
      return [
        "Courses kaise browse karu?",
        "Signup kaise karu?",
        "Pricing kya hai?",
        "Contact support",
      ];
    }

    if (user.role === "student") {
      return [
        "Mere enrolled courses dikhao",
        "Certificate kaise milega?",
        "Wishlist kaise use karu?",
        "Payment issue me help chahiye",
      ];
    }

    if (user.role === "instructor") {
      return [
        "Course kaise create karu?",
        "Earnings kaha dikhenge?",
        "Video upload kaise karu?",
        "Students export kaise karu?",
      ];
    }

    return [
      "Users manage kaise karu?",
      "Courses moderate kaise karu?",
      "Payments kaha dekhu?",
      "Settings kaha milengi?",
    ];
  }, [user]);
};

export default useChatbotSuggestions;