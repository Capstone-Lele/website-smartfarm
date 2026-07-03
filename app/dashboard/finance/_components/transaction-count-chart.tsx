"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { ImFileEmpty } from "react-icons/im";

interface TransactionCountChartProps {
  data: Finance[];
}

type CountDataPoint = {
  date: string;
  masuk: number;
  keluar: number;
};

const chartConfig: ChartConfig = {
  masuk: { label: "Transaksi Masuk", color: "#2EB88A" },
  keluar: { label: "Transaksi Keluar", color: "#E23670" },
};

const TransactionCountChart = ({ data }: TransactionCountChartProps) => {
  const countData = useMemo<CountDataPoint[]>(() => {
    if (!data || data.length === 0) return [];

    const grouped: Record<string, CountDataPoint> = {};

    data.forEach((item) => {
      // if (item.transactionType === "grant") return;

      try {
        const parsed = new Date(item.transactionDate);
        const sortKey = format(parsed, "yyyy-MM-dd");
        const displayDate = format(parsed, "dd MMM yyyy");

        if (!grouped[sortKey]) {
          grouped[sortKey] = { date: displayDate, masuk: 0, keluar: 0 };
        }

        const type = item.type?.toLowerCase();
        if (type === "in") {
          grouped[sortKey].masuk += 1;
        } else if (type === "out") {
          grouped[sortKey].keluar += 1;
        }
      } catch {
        // skip invalid dates
      }
    });

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => grouped[key]);
  }, [data]);

  return (
    <DefaultCard>
      <div className="mb-4">
        <h2 className="text-base font-semibold leading-tight">
          Tren Jumlah Transaksi
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Jumlah transaksi masuk dan keluar per hari
        </p>
      </div>

      {countData.length === 0 ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-muted-foreground">
          <ImFileEmpty className="h-10 w-10 opacity-25" />
          <span className="text-sm">Belum ada data transaksi</span>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart
            data={countData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2EB88A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2EB88A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
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
              allowDecimals={false}
              tickFormatter={(v) => `${v} trx`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value} transaksi`}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="masuk"
              name="Transaksi Masuk"
              stroke="#2EB88A"
              fillOpacity={1}
              fill="url(#colorMasuk)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="keluar"
              name="Transaksi Keluar"
              stroke="#E23670"
              fillOpacity={1}
              fill="url(#colorKeluar)"
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </DefaultCard>
  );
};

export default TransactionCountChart;
