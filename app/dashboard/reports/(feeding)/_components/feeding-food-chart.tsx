"use client";

import React, { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import DefaultCard from "@/components/card/default-card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_COLORS } from "@/lib/constants/chart-color";

interface FeedingFoodChartProps {
  foodData: { name: string; quantity: number; unit: string }[];
}

export const FeedingFoodChart: React.FC<FeedingFoodChartProps> = ({
  foodData,
}) => {
  // Add computed ID and CHART_COLORS for shadcn wrapper compatibility
  const chartData = useMemo(() => {
    return foodData.map((item, index) => {
      const id = item.name.replace(/\s+/g, "-").toLowerCase();
      return {
        ...item,
        id,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
  }, [foodData]);

  // Dynamically generate chart config matching shadcn requirements
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      quantity: { label: "Jumlah" },
    };
    chartData.forEach((item, index) => {
      config[item.id] = {
        label: item.name,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
    return config;
  }, [chartData]);

  const totalTypes = chartData.length;

  return (
    <DefaultCard>
      <div className="flex flex-col mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">
          Proporsi Jenis Pakan
        </h2>
        <p className="text-xs text-gray-400">
          Semua jenis pakan yang digunakan
        </p>
      </div>
      <div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="quantity"
              nameKey="id"
              innerRadius={55}
              strokeWidth={15}
              labelLine={false}
              label
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
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalTypes}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          Jenis Pakan
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="id" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </div>
    </DefaultCard>
  );
};
