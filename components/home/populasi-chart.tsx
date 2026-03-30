"use client";

import { TrendingUp } from "lucide-react";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartData = [
  { kolam: "Kolam 1", populasi: 1200 },
  { kolam: "Kolam 2", populasi: 850 },
  { kolam: "Kolam 3", populasi: 1500 },
  { kolam: "Kolam 4", populasi: 950 },
  { kolam: "Kolam 5", populasi: 1100 },
  { kolam: "Kolam 6", populasi: 1300 },
  { kolam: "Kolam 7", populasi: 700 },
  { kolam: "Kolam 8", populasi: 1600 },
  { kolam: "Kolam 9", populasi: 1050 },
  { kolam: "Kolam 10", populasi: 900 },
  { kolam: "Kolam 11", populasi: 1450 },
  { kolam: "Kolam 12", populasi: 1250 },
];

const chartConfig = {
  populasi: {
    label: "Populasi Ikan",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function PopulasiChartBarDefault() {
  return (
    <Card className="w-full  rounded-sm">
      <CardHeader>
        <CardTitle>Populasi Ikan Per Kolam</CardTitle>
        <CardDescription>
          Jumlah ikan lele yang ada di masing-masing kolam
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ left: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="kolam"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.replace("Kolam", "K")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="populasi" fill="var(--color-populasi)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
