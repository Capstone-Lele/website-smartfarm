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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import DefaultCard from "@/components/card/default-card";
import ChartSkeleton from "@/components/sekeleton/chart-skeleton";

export const description = "A stacked bar chart with a legend";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartBarStacked({
  data,
  isLoading,
}: {
  data: any;
  isLoading?: boolean;
}) {
  return (
    <DefaultCard className="h-96 flex flex-col w-full">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="font-semibold">Bar Chart - Persediaan Stok</h1>
      </div>
      <CardContent className="flex-1 p-0">
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <YAxis width={24} domain={[0, "auto"]} />
              <XAxis
                dataKey="product"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                // tickFormatter={(value) => value.slice(0, 3)}
                height={60}
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {/* <ChartLegend content={<ChartLegendContent />} /> */}
              <Bar dataKey="totalQuantity" fill="#8b5cf6" radius={0} />
              <Bar dataKey="minQuantity" fill="#ef4444" radius={0} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </DefaultCard>
  );
}
