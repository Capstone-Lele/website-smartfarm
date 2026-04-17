"use client";

import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import DefaultCard from "@/components/card/default-card";
import { InventoryDetail } from "@/types/inventory";
import { LuTrendingUp } from "react-icons/lu";

interface InventoryStockTrendChartProps {
  details: InventoryDetail[];
  unit: string;
}

type TrendDataPoint = {
  date: string;
  in: number;
  out: number;
};

type DateGroup = {
  sortKey: string;
  displayDate: string;
  in: number;
  out: number;
};

const chartConfig: ChartConfig = {
  in: { label: "Masuk (In)", color: "#2EB88A" },
  out: { label: "Keluar (Out)", color: "#E23670" },
};

const InventoryStockTrendChart = ({
  details,
  unit,
}: InventoryStockTrendChartProps) => {
  const trendData = useMemo<TrendDataPoint[]>(() => {
    if (!details || details.length === 0) return [];

    const grouped: Record<string, DateGroup> = {};

    details.forEach((item) => {
      try {
        const parsed = parseISO(item.createdAt);
        const sortKey = format(parsed, "yyyy-MM-dd");
        const displayDate = format(parsed, "dd MMM");
        const qty = parseFloat(item.quantity) || 0;

        if (!grouped[sortKey]) {
          grouped[sortKey] = {
            sortKey,
            displayDate,
            in: 0,
            out: 0,
          };
        }

        if (item.type === "in") {
          grouped[sortKey].in += qty;
        } else if (item.type === "out") {
          grouped[sortKey].out += qty;
        }
      } catch {
        // skip entries with unparseable dates
      }
    });

    return Object.values(grouped)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ displayDate, in: inQty, out: outQty }) => ({
        date: displayDate,
        in: inQty,
        out: outQty,
      }));
  }, [details]);

  return (
    <DefaultCard>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold leading-tight">
          Tren Pergerakan Stok
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Jumlah barang masuk &amp; keluar per tanggal
        </p>
      </div>

      {/* Empty state */}
      {trendData.length === 0 ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-muted-foreground">
          <LuTrendingUp className="h-10 w-10 opacity-25" />
          <span className="text-sm">Belum ada data pergerakan stok</span>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <LineChart
            data={trendData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
              unit={unit ? ` ${unit}` : undefined}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Legend
              wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              dataKey="in"
              name="Masuk (In)"
              type="monotone"
              stroke="#2EB88A"
              strokeWidth={3}
              dot={{
                r: 3,
                fill: "#2EB88A",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 5,
                fill: "#2EB88A",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
            <Line
              dataKey="out"
              name="Keluar (Out)"
              type="monotone"
              stroke="#E23670"
              strokeWidth={3}
              dot={{
                r: 3,
                fill: "#E23670",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 5,
                fill: "#E23670",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </DefaultCard>
  );
};

export default InventoryStockTrendChart;
