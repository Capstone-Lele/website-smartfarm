"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useListFeedWithParams } from "@/lib/api/service/notes/feed/useFeed";
import { formatDate } from "@/lib/utils/format-date";
import TableSkeleton from "@/components/sekeleton/table-skeleton";

const chartConfig = {
  quantity: {
    label: "Jumlah Pakan",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type FeedChartPoint = {
  reportDate: string;
  label: string;
  quantity: number;
};

const toQuantity = (value: string) => {
  const parsed = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildChartData = (
  feeds: Array<{ reportDate: string; quantity: string }>,
): FeedChartPoint[] => {
  const sorted = [...feeds].sort(
    (a, b) =>
      new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime(),
  );

  // Group by date — sum quantities on the same day
  const grouped = new Map<string, { reportDate: string; label: string; quantity: number }>();

  for (const item of sorted) {
    const dateKey = item.reportDate.slice(0, 10); // "YYYY-MM-DD"
    if (grouped.has(dateKey)) {
      grouped.get(dateKey)!.quantity += toQuantity(item.quantity);
    } else {
      grouped.set(dateKey, {
        reportDate: item.reportDate,
        label: formatDate(item.reportDate),
        quantity: toQuantity(item.quantity),
      });
    }
  }

  return Array.from(grouped.values());
};

type FeedingChartProps = {
  cycleId: string;
};

export function FeedingLineChart({ cycleId }: FeedingChartProps) {
  const { data, isLoading } = useListFeedWithParams({ cycleId });

  const chartData = useMemo(() => buildChartData(data?.data || []), [data]);


  if (isLoading) {
    return <TableSkeleton />;
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[45vh] min-h-65 max-h-105 text-muted-foreground text-sm">
        Belum ada data pemberian pakan untuk siklus ini.
      </div>
    );
  }

  return (
    <div className="w-full h-[45vh] min-h-65 max-h-105">
      <ChartContainer
        config={chartConfig}
        className="h-full w-full aspect-auto"
      >
        <LineChart
          accessibilityLayer
          data={chartData}
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
          <Line
            dataKey="quantity"
            type="linear"
            stroke="var(--color-quantity)"
            strokeWidth={2}
            dot={{ fill: "var(--color-quantity)" }}
            activeDot={{ r: 6 }}
            connectNulls
            name="Jumlah Pakan"
          />
        </LineChart>
      </ChartContainer>


    </div>
  );
}
