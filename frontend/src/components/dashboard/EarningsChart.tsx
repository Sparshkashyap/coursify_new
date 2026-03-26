import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EarningsChartProps {
  data: { month: string; earnings: number }[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="rounded-3xl border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg font-semibold text-foreground">
            Earnings Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="earnGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.6}
              />

              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: 600,
                }}
              />

              <Area
                type="monotone"
                dataKey="earnings"
                stroke="hsl(var(--primary))"
                fill="url(#earnGradient)"
                strokeWidth={2.5}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                  stroke: "hsl(var(--primary))",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EarningsChart;