"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Mortality } from "@/types/notes/mortality";
import DefaultCard from "@/components/card/default-card";
import { CardStatisticReport } from "@/components/card/card-statistic-report";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AlertCircle } from "lucide-react";

interface MortalityOverviewProps {
  data: Mortality[];
}

export const MortalityOverview: React.FC<MortalityOverviewProps> = ({
  data,
}) => {
  const { totalMortality, trendData, poolData } = useMemo(() => {
    if (!data || data.length === 0) {
      return { totalMortality: 0, trendData: [], poolData: [] };
    }

    let total = 0;
    const trendMap = new Map<string, number>();
    const poolMap = new Map<string, number>();

    // Urutkan berdasarkan tanggal ascending
    const sortedData = [...data].sort(
      (a, b) =>
        new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime(),
    );

    sortedData.forEach((item) => {
      const qty = item.quantity || 0;
      total += qty;

      // Group by Pool
      const poolName = item.poolName || "Unknown";
      if (!poolMap.has(poolName)) {
        poolMap.set(poolName, 0);
      }
      poolMap.set(poolName, poolMap.get(poolName)! + qty);

      // Group by Date (Trend)
      const dateStr = format(new Date(item.reportDate), "dd MMM yyyy", {
        locale: id,
      });
      if (!trendMap.has(dateStr)) {
        trendMap.set(dateStr, 0);
      }
      trendMap.set(dateStr, trendMap.get(dateStr)! + qty);
    });

    return {
      totalMortality: total,
      poolData: Array.from(poolMap.entries())
        .map(([name, quantity]) => ({
          name,
          quantity,
        }))
        .sort((a, b) => b.quantity - a.quantity), // Sort by highest mortality
      trendData: Array.from(trendMap.entries()).map(([date, quantity]) => ({
        date,
        quantity,
      })),
    };
  }, [data]);

  const trendConfig: ChartConfig = {
    quantity: {
      label: "Jumlah Kematian",
      color: "#E23670", // Pink/Red color for mortality
    },
  };

  const poolConfig: ChartConfig = {
    quantity: {
      label: "Jumlah Kematian",
      color: "#2662D9", // Blue tone for pool bars
    },
  };

  return (
    <div className="space-y-4 w-full">
      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardStatisticReport
          icon={<AlertCircle className="w-5 h-5" />}
          title="Total Kematian"
          value={totalMortality.toLocaleString("id-ID")}
          unit="ekor"
          iconTextColor="text-red-500"
          iconBgColor="bg-red-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Trend Chart (Line) */}
        <DefaultCard className="w-full">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Tren Kematian (Harian)
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Grafik laporan agregat jumlah kematian udang berdasar tanggal.
          </p>

          {trendData.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
              Tidak ada data
            </div>
          ) : (
            <ChartContainer config={trendConfig} className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
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
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    type="monotone"
                    dataKey="quantity"
                    stroke="#E23670"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#E23670", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </DefaultCard>

        {/* Pool Chart (Bar) */}
        <DefaultCard className="w-full">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Mortalitas Berdasarkan Kolam
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Akumulasi historis laporan udang mati dari masing-masing kolam.
          </p>

          {poolData.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
              Tidak ada data
            </div>
          ) : (
            <ChartContainer config={poolConfig} className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={poolData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
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
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="#2662D9"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </DefaultCard>
      </div>
    </div>
  );
};
