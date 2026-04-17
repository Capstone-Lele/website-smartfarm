"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useListMortalityWithParams } from "@/lib/api/service/notes/mortality/useMortality";
import { formatDate } from "@/lib/utils/format-date";
import TableSkeleton from "@/components/sekeleton/table-skeleton";

const chartConfig = {
  quantity: {
    label: "Jumlah Mati",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type MortalityChartPoint = {
  reportDate: string;
  label: string;
  quantity: number;
};

const buildChartData = (
  mortalities: Array<{ reportDate: string; quantity: number }>,
): MortalityChartPoint[] => {
  const sorted = [...mortalities].sort(
    (a, b) =>
      new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime(),
  );

  return sorted.map((item) => ({
    reportDate: item.reportDate,
    label: formatDate(item.reportDate),
    quantity: Number(item.quantity) || 0,
  }));
};

type MortalityChartProps = {
  cycleId: string;
};

export function MortalityBarChart({ cycleId }: MortalityChartProps) {
  const { data, isLoading } = useListMortalityWithParams({ cycleId });

  const chartData = useMemo(
    () => buildChartData(data?.data || []),
    [data],
  );

  const totalDead = useMemo(
    () => chartData.reduce((acc, item) => acc + item.quantity, 0),
    [chartData],
  );

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[45vh] min-h-65 max-h-105 text-muted-foreground text-sm">
        Belum ada data mortalitas untuk siklus ini.
      </div>
    );
  }

  return (
    <div className="w-full h-[45vh] min-h-65 max-h-105">
      <ChartContainer
        config={chartConfig}
        className="h-full w-full aspect-auto"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          barSize={38}
          margin={{
            top: 20,
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            allowDecimals={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar
            dataKey="quantity"
            fill="var(--color-quantity)"
            name="Jumlah Mati"
          />
        </BarChart>
      </ChartContainer>

      <div className="mt-2 text-xs text-muted-foreground">
        Total kematian: <span className="font-medium">{totalDead} ekor</span>{" "}
        dari {chartData.length} catatan.
      </div>
    </div>
  );
}
