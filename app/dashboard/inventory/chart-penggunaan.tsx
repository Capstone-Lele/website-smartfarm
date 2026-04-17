"use client";

import React, { useMemo, useState } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import { DatePickerWithRange } from "@/components/date-picker/date-rage-picker";
import { CHART_COLORS } from "@/lib/constants/chart-color";

export const description = "A pie chart with a legend";

export function ChartPie({
  data,
  isLoading,
}: {
  data: any;
  isLoading?: boolean;
}) {
  const [dateRange, setDateRange] = useState<{
    startDate?: Date | null;
    endDate?: Date | null;
  }>({});

  const handleDateRangeChange = (
    startDate?: Date | null,
    endDate?: Date | null,
  ) => {
    setDateRange({ startDate, endDate });
  };

  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const filteredData = data.filter((item: any) => {
      if (!item.reportDate) return true;
      if (!dateRange.startDate && !dateRange.endDate) return true;

      const itemDate = new Date(item.reportDate);
      let isValid = true;

      if (dateRange.startDate) {
        const start = new Date(dateRange.startDate);
        start.setHours(0, 0, 0, 0);
        isValid = isValid && itemDate >= start;
      }

      if (dateRange.endDate) {
        const end = new Date(dateRange.endDate);
        end.setHours(23, 59, 59, 999);
        isValid = isValid && itemDate <= end;
      }

      return isValid;
    });

    const groupedData = filteredData.reduce(
      (acc: Record<string, any>, item: any) => {
        const name = item.name;
        const quantity = parseFloat(item.quantity) || 0;

        if (!acc[name]) {
          acc[name] = {
            id: name.replace(/\s+/g, "-").toLowerCase(),
            name: name,
            quantity: 0,
          };
        }
        acc[name].quantity += quantity;
        return acc;
      },
      {},
    );

    return Object.values(groupedData).map((item: any, index: number) => ({
      ...item,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [data, dateRange]);

  const chartConfig = useMemo(() => {
    const config: Record<string, any> = {
      quantity: {
        label: "Penggunaan",
      },
    };

    chartData.forEach((item: any, index: number) => {
      config[item.id] = {
        label: item.name,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });

    return config as ChartConfig;
  }, [chartData]);

  const totalQuantity = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [chartData]);

  return (
    <DefaultCard>
      <div className="flex items-center gap-2 mb-4">
        <h1 className="font-semibold">Pie Chart - Penggunaan Produk</h1>
        <div className="ml-auto">
          <DatePickerWithRange
            placeholder="Pilih rentang tanggal"
            onValueChange={handleDateRangeChange}
            hideLabel
          />
        </div>
      </div>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            Loading...
          </div>
        ) : chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
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
                innerRadius={60}
                strokeWidth={5}
                label
                labelLine={false}
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
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalQuantity.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Berkurang
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="id" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Tidak ada data
          </div>
        )}
      </CardContent>
    </DefaultCard>
  );
}
