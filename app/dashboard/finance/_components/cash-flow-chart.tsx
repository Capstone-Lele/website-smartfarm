"use client";

import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import DefaultCard from "@/components/card/default-card";
import { Finance } from "@/types/finance/finance";
import { LuTrendingUp } from "react-icons/lu";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { ImFileEmpty } from "react-icons/im";

interface CashFlowChartProps {
  data: Finance[];
}

type TrendDataPoint = {
  date: string;
  income: number;
  expense: number;
};

const chartConfig: ChartConfig = {
  income: { label: "Pemasukan", color: "#2EB88A" },
  expense: { label: "Pengeluaran", color: "#E23670" },
};

const CashFlowChart = ({ data }: CashFlowChartProps) => {
  const trendData = useMemo<TrendDataPoint[]>(() => {
    if (!data || data.length === 0) return [];

    const grouped: Record<string, TrendDataPoint> = {};

    data.forEach((item) => {
      // Abaikan grant
      // if (item.transactionType === "grant") return;

      try {
        const parsed = new Date(item.transactionDate);
        const sortKey = format(parsed, "yyyy-MM-dd");
        const displayDate = format(parsed, "dd MMM yyyy");
        const amount = item.totalPrice || 0;

        if (!grouped[sortKey]) {
          grouped[sortKey] = {
            date: displayDate,
            income: 0,
            expense: 0,
          };
        }

        if (item.type === "in" || item.type === "IN") {
          grouped[sortKey].income += amount;
        } else if (item.type === "out" || item.type === "OUT") {
          grouped[sortKey].expense += amount;
        }
      } catch {
        // skip
      }
    });

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => grouped[key]);
  }, [data]);

  return (
    <DefaultCard>
      <div className="mb-4">
        <h2 className="text-base font-semibold leading-tight">Tren Arus Kas</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Pemasukan dan Pengeluaran per hari
        </p>
      </div>

      {trendData.length === 0 ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-muted-foreground">
          <ImFileEmpty className="h-10 w-10 opacity-25" />
          <span className="text-sm">Belum ada data arus kas</span>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart
            data={trendData}
            margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2EB88A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2EB88A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E23670" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E23670" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
              tickMargin={8}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => {
                if (value >= 1e6) {
                  return `Rp ${(value / 1e6).toFixed(1)}Jt`;
                } else if (value >= 1e3) {
                  return `Rp ${(value / 1e3).toFixed(1)}Rb`;
                }
                return `Rp ${value}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatRupiah(Number(value))}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Pemasukan"
              stroke="#2EB88A"
              fillOpacity={1}
              fill="url(#colorIncome)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Pengeluaran"
              stroke="#E23670"
              fillOpacity={1}
              fill="url(#colorExpense)"
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </DefaultCard>
  );
};

export default CashFlowChart;
