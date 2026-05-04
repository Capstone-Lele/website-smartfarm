"use client";

import React, { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";
import DefaultCard from "@/components/card/default-card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { Finance } from "@/types/finance/finance";
import { LuTrendingUp } from "react-icons/lu";
import { ImFileEmpty } from "react-icons/im";

interface TransactionCountPieProps {
  data: Finance[];
}

const COLORS = {
  masuk: "#2EB88A",
  keluar: "#E23670",
};

const chartConfig: ChartConfig = {
  value: { label: "Jumlah" },
  masuk: { label: "Transaksi Masuk", color: COLORS.masuk },
  keluar: { label: "Transaksi Keluar", color: COLORS.keluar },
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { fill: string; label: string } }[];
}) => {
  if (!active || !payload?.length) return null;
  const { value, payload: p } = payload[0];
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-xs">
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: p.fill }}
        />
        <span className="font-medium">{p.label}</span>
      </div>
      <span className="text-muted-foreground">{value} transaksi</span>
    </div>
  );
};

const TransactionCountPie = ({ data }: TransactionCountPieProps) => {
  const { segments, total } = useMemo(() => {
    let masuk = 0;
    let keluar = 0;

    data.forEach((item) => {
      // if (item.transactionType === "grant") return;
      const type = item.type?.toLowerCase();
      if (type === "in") masuk += 1;
      else if (type === "out") keluar += 1;
    });

    const segs = [
      { id: "masuk", label: "Transaksi Masuk", value: masuk, fill: COLORS.masuk },
      { id: "keluar", label: "Transaksi Keluar", value: keluar, fill: COLORS.keluar },
    ].filter((s) => s.value > 0);

    return { segments: segs, total: masuk + keluar };
  }, [data]);

  return (
    <DefaultCard>
      <div className="mb-3">
        <h2 className="text-base font-semibold leading-tight">
          Proporsi Jumlah Transaksi
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Perbandingan total transaksi masuk dan keluar
        </p>
      </div>

      {segments.length === 0 ? (
        <div className="flex h-[260px] flex-col items-center justify-center gap-3 text-muted-foreground">
          <ImFileEmpty className="h-10 w-10 opacity-25" />
          <span className="text-sm">Belum ada data transaksi</span>
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <Pie
              data={segments}
              dataKey="value"
              nameKey="id"
              innerRadius={60}
              outerRadius={90}
              strokeWidth={3}
              stroke="var(--background)"
            >
              {segments.map((entry) => (
                <Cell key={entry.id} fill={entry.fill} />
              ))}
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
                          y={(viewBox.cy ?? 0) - 8}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 12}
                          className="fill-muted-foreground text-[11px]"
                        >
                          Total Transaksi
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="id" />}
              className="flex-wrap gap-2 *:basis-1/2 *:justify-center pt-2"
            />
          </PieChart>
        </ChartContainer>
      )}
    </DefaultCard>
  );
};

export default TransactionCountPie;
