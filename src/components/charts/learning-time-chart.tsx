"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LearningTimeChartProps {
  data: Array<{
    day: string;
    time: number; // in minutes
    sessions?: number;
  }>;
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  showGoalLine?: boolean;
  goalMinutes?: number;
}

export function LearningTimeChart({
  data,
  title = "Study Time",
  description = "Your daily learning activity",
  className,
  height = 300,
  showGoalLine = true,
  goalMinutes = 30,
}: LearningTimeChartProps) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-lg">
          <p className="text-sm font-semibold">{label}</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Study Time:</span>
              <span className="text-xs font-medium">{payload[0].value} min</span>
            </div>
            {payload[0].payload.sessions && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">Sessions:</span>
                <span className="text-xs font-medium">{payload[0].payload.sessions}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate average
  const avgTime = data.reduce((sum, day) => sum + day.time, 0) / data.length;

  // Color based on goal achievement
  const getBarColor = (value: number) => {
    if (value >= goalMinutes) return "#10b981"; // green-500
    if (value >= goalMinutes * 0.7) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{Math.round(avgTime)}</p>
            <p className="text-xs text-muted-foreground">min avg/day</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="day"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
            />
            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="time" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.time)} />
              ))}
            </Bar>

            {showGoalLine && (
              <line
                x1={0}
                x2="100%"
                y1={height - (goalMinutes / Math.max(...data.map(d => d.time)) * height)}
                y2={height - (goalMinutes / Math.max(...data.map(d => d.time)) * height)}
                stroke="#6366f1"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            )}
          </BarChart>
        </ResponsiveContainer>

        {showGoalLine && (
          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Goal achieved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Near goal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Below goal</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}