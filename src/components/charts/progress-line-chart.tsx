"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProgressLineChartProps {
  data: Array<{
    date: string;
    listening?: number;
    speaking?: number;
    reading?: number;
    writing?: number;
    overall?: number;
  }>;
  title?: string;
  description?: string;
  className?: string;
  showLegend?: boolean;
  height?: number;
}

export function ProgressLineChart({
  data,
  title = "Learning Progress",
  description = "Your skill improvement over time",
  className,
  showLegend = true,
  height = 400,
}: ProgressLineChartProps) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-lg">
          <p className="text-sm font-semibold">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {entry.dataKey}:
                  </span>
                </div>
                <span className="text-xs font-medium">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const skillColors = {
    listening: "#f97316", // orange-500
    speaking: "#10b981", // emerald-500
    reading: "#3b82f6", // blue-500
    writing: "#a855f7", // purple-500
    overall: "#6366f1", // indigo-500
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pb-6">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
              />
            )}

            {data[0]?.listening !== undefined && (
              <Line
                type="monotone"
                dataKey="listening"
                name="Listening"
                stroke={skillColors.listening}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}

            {data[0]?.speaking !== undefined && (
              <Line
                type="monotone"
                dataKey="speaking"
                name="Speaking"
                stroke={skillColors.speaking}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}

            {data[0]?.reading !== undefined && (
              <Line
                type="monotone"
                dataKey="reading"
                name="Reading"
                stroke={skillColors.reading}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}

            {data[0]?.writing !== undefined && (
              <Line
                type="monotone"
                dataKey="writing"
                name="Writing"
                stroke={skillColors.writing}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}

            {data[0]?.overall !== undefined && (
              <Line
                type="monotone"
                dataKey="overall"
                name="Overall"
                stroke={skillColors.overall}
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}