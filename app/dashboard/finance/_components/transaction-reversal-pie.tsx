"use client";

import React, { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";
import DefaultCard from "@/components/card/default-card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Finance } from "@/types/finance/finance";
import { sourceLabelTranslation } from "@/lib/constants/type-finance";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { ImFileEmpty } from "react-icons/im";

interface TransactionReversalPieProps {
  data: Finance[];
}

const COLORS = [
  "#2563EB",
  "#F97316",
  "#14B8A6",
  "#A855F7",
  "#E11D48",
  "#84CC16",
];

const chartConfig: ChartConfig = {
  value: { label: "Jumlah" },
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: {
    value: number;
    payload: {
      fill: string;
      label: string;
      totalNominal: number;
    };
  }[];
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
      <div className="grid gap-0.5 text-muted-foreground">
        <span>{value} transaksi reversal</span>
        <span>{formatRupiah(p.totalNominal)}</span>
      </div>
    </div>
  );
};

const TransactionReversalPie = ({ data }: TransactionReversalPieProps) => {
  const { segments, totalCount, totalNominal } = useMemo(() => {
    const grouped = new Map<
      string,
      { id: string; label: string; value: number; totalNominal: number }
    >();

    data
      .filter((item) => item.type === "reversal")
      .forEach((item) => {
        const key = item.transactionSource || "unknown";
        const label = sourceLabelTranslation(key);
        const current = grouped.get(key) ?? {
          id: key,
          label,
          value: 0,
          totalNominal: 0,
        };

        current.value += 1;
        current.totalNominal += item.totalPrice || 0;
        grouped.set(key, current);
      });

    const segs = Array.from(grouped.values())
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
      }));

    return {
      segments: segs,
      totalCount: segs.reduce((sum, item) => sum + item.value, 0),
      totalNominal: segs.reduce((sum, item) => sum + item.totalNominal, 0),
    };
  }, [data]);

  return (
    <DefaultCard>
      <div className="mb-3">
        <h2 className="text-base font-semibold leading-tight">
          Transaksi Reversal
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Jumlah dan nominal reversal semua transaksi
        </p>
      </div>

      {segments.length === 0 ? (
        <div className="flex h-[260px] flex-col items-center justify-center gap-3 text-muted-foreground">
          <ImFileEmpty className="h-10 w-10 opacity-25" />
          <span className="text-sm">Belum ada transaksi reversal</span>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <ChartContainer
            config={chartConfig}
            className="mx-auto h-[260px] w-full max-w-[260px]"
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
                            {totalCount}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 12}
                            className="fill-muted-foreground text-[11px]"
                          >
                            Reversal
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="flex flex-col justify-center gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Total nominal transaksi reversal</p>
              <p className="text-lg font-semibold">{formatRupiah(totalNominal)}</p>
            </div>
            <div className="grid gap-2">
              {segments.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-xs"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="line-clamp-1 text-xs">{item.label}</span>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-medium">{item.value}x</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRupiah(item.totalNominal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DefaultCard>
  );
};

export default TransactionReversalPie;
