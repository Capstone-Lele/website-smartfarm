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
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { CHART_COLORS } from "@/lib/constants/chart-color";
import { LuTrendingUp } from "react-icons/lu";
import { sourceLabelTranslation } from "@/lib/constants/type-finance";

interface FinancePieChartsProps {
  data: Finance[];
}

/* ─── types ─────────────────────────────────────────────────────────── */
interface Segment {
  id: string;
  label: string;
  value: number;
  fill: string;
}

/* ─── helpers ───────────────────────────────────────────────────────── */
const buildSegments = (
  data: Finance[],
  typeFilter: "in" | "out",
): Segment[] => {
  const totals: Record<string, number> = {};

  data.forEach((item) => {
    // if (item.transactionType === "grant") return;

    const itemType = item.type?.toLowerCase();
    if (itemType !== typeFilter) return;

    const source = item.transactionSource || "Lainnya";
    totals[source] = (totals[source] ?? 0) + (item.totalPrice || 0);
  });

  return Object.entries(totals)
    .filter(([, value]) => value > 0)
    .map(([source, value], index) => ({
      id: source.replace(/\s+/g, "-").toLowerCase(),
      label: sourceLabelTranslation(source), 
      value,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
};

const buildChartConfig = (segments: Segment[]): ChartConfig => {
  const cfg: ChartConfig = { value: { label: "Jumlah" } };
  segments.forEach((s) => {
    cfg[s.id] = { label:s.label, color: s.fill };
  });
  return cfg;
};

/* ─── custom tooltip ────────────────────────────────────────────────── */
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: {
    value: number;
    payload: { fill: string; label: string };
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
      <span className="text-muted-foreground">{formatRupiah(value)}</span>
    </div>
  );
};

/* ─── reusable donut ────────────────────────────────────────────────── */
interface DonutChartProps {
  title: string;
  subtitle: string;
  segments: Segment[];
  centerLabel: string;
  emptyMessage: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  title,
  subtitle,
  segments,
  centerLabel,
  emptyMessage,
}) => {
  const chartConfig = useMemo(() => buildChartConfig(segments), [segments]);
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <DefaultCard>
      <div className="mb-3">
        <h2 className="text-base font-semibold leading-tight">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {segments.length === 0 ? (
        <div className="flex h-[260px] flex-col items-center justify-center gap-3 text-muted-foreground">
          <LuTrendingUp className="h-10 w-10 opacity-25" />
          <span className="text-sm">{emptyMessage}</span>
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px] w-full"
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
                          className="fill-foreground text-[11px] font-bold"
                        >
                          {formatRupiah(total)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 10}
                          className="fill-muted-foreground text-[10px]"
                        >
                          {centerLabel}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="id" />}
              className="flex flex-wrap gap-1 *:basis-1/2 *:justify-center pt-1"
            />
          </PieChart>
        </ChartContainer>
      )}
    </DefaultCard>
  );
};

/* ─── main component ────────────────────────────────────────────────── */
const FinancePieCharts: React.FC<FinancePieChartsProps> = ({ data }) => {
  const incomeSegments = useMemo(() => buildSegments(data, "in"), [data]);
  const expenseSegments = useMemo(() => buildSegments(data, "out"), [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DonutChart
        title="Distribusi Pemasukan"
        subtitle="Berdasarkan sumber transaksi masuk"
        segments={incomeSegments}
        centerLabel="Total Masuk"
        emptyMessage="Belum ada data pemasukan"
      />
      <DonutChart
        title="Distribusi Pengeluaran"
        subtitle="Berdasarkan sumber transaksi keluar"
        segments={expenseSegments}
        centerLabel="Total Keluar"
        emptyMessage="Belum ada data pengeluaran"
      />
    </div>
  );
};

export default FinancePieCharts;
