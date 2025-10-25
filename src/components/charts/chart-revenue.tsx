"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface ChartRevenueProps {
  title: string;
  description?: string;
  data: Array<{
    label: string;
    [key: string]: string | number;
  }>;
  config: ChartConfig;
  footerTrend?: {
    value: number;
    text: string;
  };
  footerDescription?: string;
  stacked?: boolean;
}

export function ChartRevenue({
  title,
  description,
  data,
  config,
  footerTrend,
  footerDescription,
  stacked = true,
}: ChartRevenueProps) {
  // Get all data keys except 'label'
  const dataKeys = Object.keys(data[0] || {}).filter((key) => key !== "label");

  const isTrendingUp = footerTrend ? footerTrend.value > 0 : true;

  return (
    <Card>
      <CardHeader>
        {description && <CardDescription>{description}</CardDescription>}
        <CardTitle className="text-2xl font-bold tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-[3/1] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: -16,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                if (typeof value === "string" && value.length > 10) {
                  return value.slice(0, 3);
                }
                return value;
              }}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              domain={[0, "dataMax"]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideIndicator />}
            />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`var(--color-${key})`}
                radius={
                  stacked
                    ? index === 0
                      ? [0, 0, 4, 4]
                      : index === dataKeys.length - 1
                      ? [4, 4, 0, 0]
                      : [0, 0, 0, 0]
                    : [4, 4, 0, 0]
                }
                stackId={stacked ? "1" : undefined}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      {(footerTrend || footerDescription) && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {footerTrend && (
            <div className="flex gap-2 font-medium leading-none">
              {footerTrend.text}
              {isTrendingUp ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </div>
          )}
          {footerDescription && (
            <div className="leading-none text-muted-foreground">
              {footerDescription}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
