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
import { ImFileEmpty } from "react-icons/im";

export const description = "A bar chart";

const chartConfig = {
  total: {
    label: "Populasi Ikan",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function PopulasiChartBarDefault({
  chartData = [],
}: {
  chartData?: { poolName: string; total: number }[];
}) {
  return (
    <Card className="w-full  rounded-sm">
      <CardHeader>
        <CardTitle>Populasi Ikan Per Kolam</CardTitle>
        <CardDescription>
          Jumlah ikan lele yang ada di masing-masing kolam
        </CardDescription>
      </CardHeader>
      <CardContent>
        {
          chartData.length === 0 ? (
            <div className="flex h-[260px] flex-col items-center justify-center gap-3 text-muted-foreground">
                          <ImFileEmpty className="h-10 w-10 opacity-25" />
                          <span className="text-sm">Belum ada data populasi</span>
                        </div>
          ) : (
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ left: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="poolName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.replace("Kolam", "K")}
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
            <Bar dataKey="total" fill="var(--color-total)" maxBarSize={40} />
          </BarChart>
        </ChartContainer>
          )
        }
      </CardContent>
    </Card>
  );
}
