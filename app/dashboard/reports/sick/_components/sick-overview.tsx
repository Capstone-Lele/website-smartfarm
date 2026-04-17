"use client";

import React, { useMemo } from "react";
import DefaultCard from "@/components/card/default-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Label } from "recharts";
import { Sick } from "@/types/notes/sick.types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CardStatisticReport } from "@/components/card/card-statistic-report";
import { LuActivity } from "react-icons/lu";

export default function SickOverview({ data }: { data: Sick[] }) {
  // 1. Stats Calculation
  const totalSicks = useMemo(() => {
    return (
      data?.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0) || 0
    );
  }, [data]);

  const totalOriginPools = useMemo(() => {
    if (!data) return 0;
    const pools = new Set(
      data.filter((d) => d.originPoolName).map((d) => d.originPoolName),
    );
    return pools.size;
  }, [data]);

  // 3. Pool Pie Data
  const { poolPieData, poolPieConfig } = useMemo(() => {
    if (!data) return { poolPieData: [], poolPieConfig: {} };
    const grouped = data.reduce(
      (acc, curr) => {
        const pool = curr.originPoolName || "Tidak Diketahui";
        if (!acc[pool]) {
          acc[pool] = 0;
        }
        acc[pool] += Number(curr.quantity || 0);
        return acc;
      },
      {} as Record<string, number>,
    );

    const colors = [
      "#ef4444",
      "#f97316",
      "#f59e0b",
      "#84cc16",
      "#22c55e",
      "#06b6d4",
    ];

    const pieData = Object.keys(grouped).map((pool, idx) => ({
      name: pool.replace(/\s+/g, "_").toLowerCase(),
      labelName: pool,
      value: grouped[pool],
      fill: colors[idx % colors.length],
    }));

    const config: any = {
      value: { label: "Ekor Sakit" },
    };
    pieData.forEach((item) => {
      config[item.name] = { label: item.labelName, color: item.fill };
    });

    return { poolPieData: pieData, poolPieConfig: config };
  }, [data]);

  return (
    <div className="space-y-4 mt-2">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardStatisticReport
          icon={<LuActivity size={20} />}
          title="Total Evakuasi / Sakit & Karantina"
          value={totalSicks}
          unit="ekor"
          iconBgColor="bg-rose-50"
          iconTextColor="text-rose-600"
        />

        <CardStatisticReport
          icon={<LuActivity size={20} />}
          title="Sumber Kolam Terdampak"
          value={totalOriginPools}
          unit="kolam"
          iconBgColor="bg-orange-50"
          iconTextColor="text-orange-600"
        />
      </div>

      <DefaultCard>
        <h2 className="text-sm font-semibold text-gray-700 mb-1">
          Sumber Masalah (Kolam Asal)
        </h2>
        <p className="text-xs text-gray-400 mb-2">Total yg dievakuasi/sakit</p>
        {poolPieData.length > 0 ? (
          <ChartContainer
            config={poolPieConfig}
            className="mx-auto aspect-[4/3] max-h-[220px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={poolPieData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                strokeWidth={2}
                paddingAngle={2}
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
                            {totalSicks.toLocaleString("id-ID")}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-[10px]"
                          >
                            Ekor Dievakuasi
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center text-[10px]"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
            Tidak ada rekaman data evakuasi
          </div>
        )}
      </DefaultCard>
    </div>
  );
}
