"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ChartVisitorsProps {
  title: string;
  description?: string;
  data: Array<{
    category: string;
    value: number;
    fill: string;
  }>;
  config: ChartConfig;
  showSelector?: boolean;
  centerLabel?: string;
}

export function ChartVisitors({
  title,
  description,
  data,
  config,
  showSelector = true,
  centerLabel = "Total",
}: ChartVisitorsProps) {
  const id = React.useId();
  const [activeCategory, setActiveCategory] = React.useState(
    data[0]?.category || ""
  );

  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.category === activeCategory),
    [activeCategory, data]
  );

  const categories = React.useMemo(
    () => data.map((item) => item.category),
    [data]
  );

  const totalValue = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.value, 0),
    [data]
  );

  return (
    <Card data-chart={id}>
      <ChartStyle id={id} config={config} />
      <CardHeader>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {showSelector && categories.length > 1 && (
            <Select value={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger
                className="ml-auto h-8 w-[150px]"
                aria-label="Select a category"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent align="end">
                {categories.map((key) => {
                  const configItem = config[key as keyof typeof config];
                  const color =
                    configItem && "color" in configItem ? configItem.color : undefined;

                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className="flex h-3 w-3 shrink-0 rounded-sm"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                        {configItem?.label || key}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={config}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data[activeIndex]?.value.toLocaleString() ||
                            totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {centerLabel}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
