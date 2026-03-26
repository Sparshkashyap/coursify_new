import React from "react";
import { Lock, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoPlayerProps {
  isPremium: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ isPremium }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=450&fit=crop"
          alt="Course video placeholder"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
          {isPremium ? (
            <div className="text-center space-y-2">
              <Lock className="mx-auto h-12 w-12 text-primary-foreground" />
              <Badge className="bg-primary">Premium Content</Badge>
              <p className="text-sm text-primary-foreground/80">Enroll to unlock this course</p>
            </div>
          ) : (
            <button className="rounded-full bg-primary p-4 text-primary-foreground transition-transform hover:scale-110">
              <Play className="h-8 w-8" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
