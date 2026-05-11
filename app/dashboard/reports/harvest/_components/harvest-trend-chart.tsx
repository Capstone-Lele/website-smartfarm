"use client";

import React, { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
import DefaultCard from "@/components/card/default-card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_COLORS } from "@/lib/constants/chart-color";

interface HarvestTrendChartProps {
  trendData: { date: string; [key: string]: any }[];
}

export const HarvestTrendChart: React.FC<HarvestTrendChartProps> = ({
  trendData,
}) => {
  const chartConfig = useMemo(() => {
    return {
      "Total Kg": {
        label: "Total Berat (Kg)",
        color: CHART_COLORS[0],
      },
      "Total Ekor": {
        label: "Total Jumlah (Ekor)",
        color: CHART_COLORS[1],
      },
    } satisfies ChartConfig;
  }, []);

  return (
    <DefaultCard className="lg:col-span-2">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">
        Tren Pertumbuhan Panen
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        Jumlah panen berdasarkan kuantitas panen masing-masing
      </p>
      <ChartContainer config={chartConfig} className="h-[260px] w-full">
        <LineChart
          data={trendData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickMargin={8}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Legend className="mt-4" />
          <Line
            dataKey="Total Kg"
            type="monotone"
            stroke={CHART_COLORS[0]}
            strokeWidth={3}
            dot={{ r: 4, fill: CHART_COLORS[0], strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line
            dataKey="Total Ekor"
            type="monotone"
            stroke={CHART_COLORS[1]}
            strokeWidth={3}
            dot={{ r: 4, fill: CHART_COLORS[1], strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </DefaultCard>
  );
};
