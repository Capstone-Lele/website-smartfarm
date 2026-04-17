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
import { useListMoveWithParams } from "@/lib/api/service/notes/move/useMove";
import TableSkeleton from "@/components/sekeleton/table-skeleton";

const chartConfig = {
  quantity: {
    label: "Jumlah Pindah",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type MoveChartPoint = {
  destinationPoolName: string;
  quantity: number;
};

const buildChartData = (
  moves: Array<{ destinationPoolName: string; quantity: number }>,
): MoveChartPoint[] => {
  const aggregated: Record<string, number> = {};
  
  moves.forEach((item) => {
    if (!aggregated[item.destinationPoolName]) {
      aggregated[item.destinationPoolName] = 0;
    }
    aggregated[item.destinationPoolName] += Number(item.quantity) || 0;
  });

  return Object.keys(aggregated).map((key) => ({
    destinationPoolName: key,
    quantity: aggregated[key],
  }));
};

type MovePoolChartProps = {
  cycleId: string;
};

export function MovePoolBarChart({ cycleId }: MovePoolChartProps) {
  const { data, isLoading } = useListMoveWithParams({ cycleId });

  const chartData = useMemo(
    () => buildChartData(data?.data || []),
    [data],
  );

  const totalMoved = useMemo(
    () => chartData.reduce((acc, item) => acc + item.quantity, 0),
    [chartData],
  );

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[45vh] min-h-65 max-h-105 text-muted-foreground text-sm">
        Belum ada data pemindahan untuk siklus ini.
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
            dataKey="destinationPoolName"
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
            name="Jumlah Pindah"
          />
        </BarChart>
      </ChartContainer>

      <div className="mt-2 text-xs text-muted-foreground">
        Total ikan dipindah: <span className="font-medium">{totalMoved} ekor</span>{" "}
        ke {chartData.length} kolam.
      </div>
    </div>
  );
}
