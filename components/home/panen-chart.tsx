"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

const chartData = [
  { date: "2024-01-01", frekuensi: 3, ekor: 6200 },
  { date: "2024-02-01", frekuensi: 2, ekor: 7000 },
  { date: "2024-03-01", frekuensi: 4, ekor: 5500 },
  { date: "2024-04-01", frekuensi: 3, ekor: 8200 },
  { date: "2024-05-01", frekuensi: 5, ekor: 10500 },
  { date: "2024-06-01", frekuensi: 2, ekor: 9000 },
  { date: "2024-07-01", frekuensi: 4, ekor: 11500 },
  { date: "2024-08-01", frekuensi: 3, ekor: 9700 },
  { date: "2024-09-01", frekuensi: 5, ekor: 12500 },
  { date: "2024-10-01", frekuensi: 4, ekor: 14000 },
  { date: "2024-11-01", frekuensi: 2, ekor: 11000 },
  { date: "2024-12-01", frekuensi: 6, ekor: 15500 },
];

const chartConfig = {
  views: {
    label: "Total Panen",
  },
  frekuensi: {
    label: "Frekuensi Panen (Kali)",
    color: "var(--chart-2)",
  },
  ekor: {
    label: "Panen (Ekor)",
    color: "var(--secondary)",
  },
} satisfies ChartConfig;

export function PanenChartBarInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("frekuensi");

  const total = React.useMemo(
    () => ({
      frekuensi: chartData.reduce((acc, curr) => acc + curr.frekuensi, 0),
      ekor: chartData.reduce((acc, curr) => acc + curr.ekor, 0),
    }),
    [],
  );

  return (
    <Card className="py-0 rounded-sm">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Statistik Panen Ikan</CardTitle>
          <CardDescription>
            Menampilkan data total panen bulanan (Frekuensi dan Ekor)
          </CardDescription>
        </div>
        <div className="flex">
          {["frekuensi", "ekor"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString("id-ID")}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={10}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-37.5"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
