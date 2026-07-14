"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useListSamplingWithParams } from "@/lib/api/service/notes/sampling/useSampling";
import { formatDateLong } from "@/lib/utils/format-date";
import TableSkeleton from "@/components/sekeleton/table-skeleton";

export const description = "A line chart with a label";

const HARVEST_TARGET_GRAM = 750;
const MIN_PREDICTION_POINTS = 3;
// Maksimum jumlah hari ke depan yang diproyeksikan
const MAX_PREDICTION_DAYS = 120;

type ChartPoint = {
  reportDate: string;
  label: string;
  actual: number | null;
  prediction: number | null;
};

const chartConfig = {
  actual: {
    label: "Aktual",
    color: "var(--chart-1)",
  },
  prediction: {
    label: "Prediksi",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type SamplingChartLineLabelProps = {
  cycleId: string;
};

const toWeight = (value: string) => {
  const parsed = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const getAverageIntervalMs = (points: ChartPoint[]) => {
  const timestamps = points
    .map((point) => new Date(point.reportDate).getTime())
    .filter((time) => Number.isFinite(time));

  if (timestamps.length < 2) return MS_PER_DAY;

  const total = timestamps
    .slice(1)
    .reduce((acc, current, index) => acc + (current - timestamps[index]), 0);

  return Math.max(
    MS_PER_DAY,
    Math.round(total / (timestamps.length - 1)),
  );
};

/**
 * Menghitung ADG (Average Daily Gain) dari data sampling.
 * Sesuai logika: ADG = (berat_terakhir - berat_awal) / selisih_hari_total
 */
const calculateADG = (
  points: Array<{ reportDate: string; actual: number | null }>,
): number | null => {
  const validPoints = points.filter(
    (p): p is { reportDate: string; actual: number } => p.actual !== null,
  );

  if (validPoints.length < 2) return null;

  const firstPoint = validPoints[0];
  const lastPoint = validPoints[validPoints.length - 1];

  const firstDateObj = new Date(firstPoint.reportDate);
  firstDateObj.setHours(0, 0, 0, 0);
  const firstDate = firstDateObj.getTime();

  const lastDateObj = new Date(lastPoint.reportDate);
  lastDateObj.setHours(0, 0, 0, 0);
  const lastDate = lastDateObj.getTime();
  
  const days = Math.round((lastDate - firstDate) / MS_PER_DAY);

  if (days <= 0) return null; // Data di hari yang sama

  return (lastPoint.actual - firstPoint.actual) / days;
};

const buildChartData = (
  samplings: Array<{ reportDate: string; averageWeight: string }>,
) => {
  const sorted = [...samplings].sort(
    (a, b) =>
      new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime(),
  );

  const baseData: ChartPoint[] = sorted.map((item) => ({
    reportDate: item.reportDate,
    label: formatDateLong(item.reportDate),
    actual: toWeight(item.averageWeight),
    prediction: null,
  }));

  const points = baseData
    .map((item, index) => ({ x: index, y: item.actual }))
    .filter((item): item is { x: number; y: number } => item.y !== null);

  // Implementasi prediksi menggunakan ADG (Average Daily Gain)
  const adg = calculateADG(baseData);
  let message = "";

  if (points.length < MIN_PREDICTION_POINTS) {
    message = `Butuh minimal ${MIN_PREDICTION_POINTS} data untuk prediksi ADG.`;
    return {
      chartData: baseData,
      canPredict: false,
      estimatedHarvestDate: null as string | null,
      message,
      adg,
    };
  }

  if (adg === null) {
    message = "Data sampling harus pada tanggal berbeda.";
    return {
      chartData: baseData,
      canPredict: false,
      estimatedHarvestDate: null as string | null,
      message,
      adg,
    };
  }

  if (adg <= 0) {
    message = "Berat rata-rata tidak bertambah, estimasi panen belum tersedia.";
    return {
      chartData: baseData,
      canPredict: false,
      estimatedHarvestDate: null as string | null,
      message,
      adg,
    };
  }

  const mergedData: ChartPoint[] = [...baseData];
  const lastKnown = mergedData[mergedData.length - 1];

  if (!lastKnown || lastKnown.actual === null) {
    return {
      chartData: mergedData,
      canPredict: false,
      estimatedHarvestDate: null as string | null,
      message,
      adg,
    };
  }

  // Cek apakah sudah capai target
  if (lastKnown.actual >= HARVEST_TARGET_GRAM) {
    message = "Target panen (0,75 kg) sudah tercapai!";
    return {
      chartData: mergedData,
      canPredict: true,
      estimatedHarvestDate: formatDateLong(lastKnown.reportDate),
      message,
      adg,
    };
  }

  lastKnown.prediction = Number(lastKnown.actual.toFixed(2));

  const lastDate = new Date(lastKnown.reportDate).getTime();
  const lastWeight = lastKnown.actual;
  let estimatedHarvestDate: string | null = null;

  // Membuat proyeksi harian berdasarkan ADG — step 1 hari agar grafik mulus
  // walaupun data sampling punya gap antar tanggal
  for (let day = 1; day <= MAX_PREDICTION_DAYS; day += 1) {
    const predictionDateMs = lastDate + MS_PER_DAY * day;
    // Prediksi berat = berat terakhir + ADG × jumlah hari ke depan
    const predicted = lastWeight + adg * day;
    const predictionDate = new Date(predictionDateMs).toISOString();

    mergedData.push({
      reportDate: predictionDate,
      label: formatDateLong(predictionDate),
      actual: null,
      prediction: Number(predicted.toFixed(2)),
    });

    if (!estimatedHarvestDate && predicted >= HARVEST_TARGET_GRAM) {
      estimatedHarvestDate = formatDateLong(predictionDate);
      break;
    }
  }

  if (estimatedHarvestDate) {
    message = `Estimasi target panen (0,75 kg) pada ${estimatedHarvestDate}.`;
  } else {
    message = `Target panen (0,75 kg) belum tercapai dalam ${MAX_PREDICTION_DAYS} hari ke depan.`;
  }

  return {
    chartData: mergedData,
    canPredict: true,
    estimatedHarvestDate,
    message,
    adg,
  };
};

export function SamplingChartLineLabel({
  cycleId,
}: SamplingChartLineLabelProps) {
  const { data, isLoading } = useListSamplingWithParams({ cycleId });

  const { chartData, canPredict, message, adg } =
    useMemo(() => buildChartData(data?.data || []), [data]);

  if (isLoading) {
    return <TableSkeleton />;
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
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ReferenceLine
            y={HARVEST_TARGET_GRAM}
            stroke="var(--muted-foreground)"
            strokeDasharray="3 3"
            label={{ value: "Target panen 750g", position: "insideTopRight" }}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="actual"
            type="linear"
            stroke="var(--color-actual)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-actual)",
            }}
            activeDot={{
              r: 6,
            }}
            connectNulls
            name="Aktual"
          />

          {canPredict && (
            <Line
              dataKey="prediction"
              type="monotone"
              stroke="var(--color-prediction)"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              connectNulls
              name="Prediksi"
            />
          )}
        </LineChart>
      </ChartContainer>

      <div className="mt-2 text-xs text-muted-foreground flex flex-row gap-1">
        <span>{message}</span>
        {adg !== null && adg > 0 && (
          <span className="font-medium text-foreground">
            ADG: {adg.toFixed(2)} g/hari
          </span>
        )}
      </div>
    </div>
  );
}
