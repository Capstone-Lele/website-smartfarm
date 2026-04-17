"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import DefaultCard from "@/components/card/default-card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_COLORS } from "@/lib/constants/chart-color";

interface FeedingPoolChartProps {
  poolData: { poolName: string; [key: string]: any }[];
  foodData: { name: string; quantity: number; unit: string }[];
}

export const FeedingPoolChart: React.FC<FeedingPoolChartProps> = ({
  poolData,
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
    <DefaultCard>
      <h2 className="text-sm font-semibold text-gray-700 mb-1">
        Perbandingan Vitamin Antar Kolam
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        Total Vitamin yang dihabiskan tiap kolam (Stacked berdasarkan jenis
        Vitamin)
      </p>
      <ChartContainer config={chartConfig} className="h-[240px] w-full">
        <BarChart
          data={poolData}
          barSize={38}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="poolName"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Legend className="mt-4" />
          {foodData.map((item, index) => (
            <Bar
              key={item.name}
              dataKey={item.name}
              stackId="a"
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </DefaultCard>
  );
};
