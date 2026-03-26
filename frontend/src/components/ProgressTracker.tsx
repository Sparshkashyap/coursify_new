import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress, completedLessons, totalLessons }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{completedLessons}/{totalLessons} lessons</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ProgressTracker;
