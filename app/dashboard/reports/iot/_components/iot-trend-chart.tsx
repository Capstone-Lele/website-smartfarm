"use client";

import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DefaultCard from "@/components/card/default-card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_COLORS } from "@/lib/constants/chart-color";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface IotTrendChartProps {
  data: any[];
  nodes: number[];
  dataKey: "ph" | "temp";
  title: string;
  description: string;
}

export const IotTrendChart: React.FC<IotTrendChartProps> = ({
  data,
  nodes,
  dataKey,
  title,
  description,
}) => {
  const [showDots, setShowDots] = useState(false);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    nodes.forEach((node, index) => {
      const label = `Kolam ${node}`;
      config[label] = {
        label,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
    return config;
  }, [nodes]);

  return (
    <DefaultCard className="col-span-1 w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-1">{title}</h2>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-dots"
            checked={showDots}
            onCheckedChange={setShowDots}
          />
          <Label
            htmlFor="show-dots"
            className="text-xs text-slate-600 font-medium cursor-pointer"
          >
            Tampilkan Titik
          </Label>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
          Tidak ada data
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="time"
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
                domain={dataKey === "ph" ? [0, 14] : ["auto", "auto"]}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Legend className="mt-4" />
              {nodes.map((node, index) => {
                const label = `Kolam ${node}`;
                return (
                  <Line
                    key={label}
                    dataKey={label}
                    type="monotone"
                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                    strokeWidth={2}
                    dot={
                      showDots
                        ? {
                            fill: CHART_COLORS[index % CHART_COLORS.length],
                            opacity: 0.8,
                          }
                        : false
                    }
                    activeDot={{ r: 6 }}
                    connectNulls={true}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </DefaultCard>
  );
};
