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
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_COLORS } from "@/lib/constants/chart-color";
import { formatDate, formatDateShort } from "@/lib/utils/format-date";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const WaterQualityChart = ({ data, dataKey, title }: any) => {
  const [showDots, setShowDots] = useState(false);

  const chartConfig = useMemo(() => {
    return {
      [dataKey]: {
        label: title,
        color: dataKey === "ph" ? CHART_COLORS[0] : CHART_COLORS[3],
      },
    } satisfies ChartConfig;
  }, [dataKey, title]);

  const formattedData = useMemo(() => {
    if (!data) return [];
    return data.map((item: any) => ({
      ...item,
      time: item.createdAt ? formatDate(item.createdAt) : "-",
      shortTime: item.createdAt ? formatDateShort(item.createdAt) : "-",
    }));
  }, [data]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <div className="flex items-center space-x-2">
          <Switch
            id={`show-dots-${dataKey}`}
            checked={showDots}
            onCheckedChange={setShowDots}
          />
          <Label
            htmlFor={`show-dots-${dataKey}`}
            className="text-xs text-slate-600 font-medium cursor-pointer"
          >
            Tampilkan Titik
          </Label>
        </div>
      </div>
      <div className="h-[260px] w-full mt-2">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="shortTime"
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
                domain={dataKey === "ph" ? [0, 14] : ["auto", "auto"]}
              />
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label, payload) =>
                      payload?.[0]?.payload?.time || label
                    }
                  />
                }
              />
              <Legend className="mt-4" />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={`var(--color-${dataKey})`}
                strokeWidth={2}
                dot={
                  showDots
                    ? { fill: `var(--color-${dataKey})`, opacity: 0.8 }
                    : false
                }
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};
