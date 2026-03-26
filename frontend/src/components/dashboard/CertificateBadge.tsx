import React from "react";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CertificateBadgeProps {
  courseTitle: string;
  completedDate?: string;
}

const CertificateBadge: React.FC<CertificateBadgeProps> = ({ courseTitle, completedDate }) => {
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="rounded-full bg-accent/20 p-3">
          <Award className="h-6 w-6 text-accent" />
        </div>
        <div>
          <p className="font-display font-semibold text-sm">{courseTitle}</p>
          <p className="text-xs text-muted-foreground">Completed {completedDate || "recently"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateBadge;
