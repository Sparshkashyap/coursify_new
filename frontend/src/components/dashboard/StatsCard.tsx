import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="rounded-3xl border-border bg-card shadow-sm transition hover:shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>

              <p className="text-2xl font-bold tracking-tight text-foreground">
                {value}
              </p>

              {description && (
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              )}

              {trend && (
                <p className="text-xs font-medium text-primary">
                  ↑ {trend}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 shadow-sm">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
  
export default StatsCard;