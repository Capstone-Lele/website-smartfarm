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

interface FeedingTrendChartProps {
  trendData: { date: string; [key: string]: any }[];
  foodData: { name: string; quantity: number; unit: string }[];
}

export const FeedingTrendChart: React.FC<FeedingTrendChartProps> = ({
  trendData,
  foodData,
}) => {
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    foodData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
    return config;
  }, [foodData]);

  return (
    <DefaultCard className="lg:col-span-2">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">
        Tren Konsumsi Vitamin
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        Jumlah Vitamin per hari (Sesuai kuantitas masing-masing tipe Vitamin)
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
          {foodData.map((item, index) => (
            <Line
              key={item.name}
              dataKey={item.name}
              type="monotone"
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={3}
              dot={{
                r: 4,
                fill: CHART_COLORS[index % CHART_COLORS.length],
                strokeWidth: 2,
              }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </DefaultCard>
  );
};
