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
import { GeneralInfoResponse } from "@/types/guest";
import { ImFileEmpty } from "react-icons/im";

export const description = "An interactive bar chart";

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

export function PanenChartBarInteractive({
  data,
}: {
  data?: GeneralInfoResponse;
}) {
  const generalInfo = data?.data[0];
  const chartHarvestData = generalInfo?.harvestSection.chartHarvest || [];

  const chartData = React.useMemo(() => {
    return chartHarvestData.map((item) => ({
      month: item.month,
      frekuensi: item.frequency,
      ekor: item.total,
    }));
  }, [chartHarvestData]);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("frekuensi");

  const total = React.useMemo(
    () => ({
      frekuensi: chartData.reduce((acc, curr) => acc + curr.frekuensi, 0),
      ekor: chartData.reduce((acc, curr) => acc + curr.ekor, 0),
    }),
    [chartData],
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
        {chartData.length === 0 ? (
          <div className="flex h-[260px] flex-col items-center justify-center gap-3 text-muted-foreground">
            <ImFileEmpty className="h-10 w-10 opacity-25" />
            <span className="text-sm">Belum ada data populasi</span>
          </div>
        ) : (
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
              maxBarSize={50}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={10}
                tickFormatter={(value) => {
                  return value.slice(0, 3);
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-37.5"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return value;
                    }}
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
