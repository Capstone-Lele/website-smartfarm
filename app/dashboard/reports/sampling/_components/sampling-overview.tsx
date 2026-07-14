import React, { useMemo, useState } from "react";
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
import { formatDate, formatDateLong } from "@/lib/utils/format-date";
import DefaultCard from "@/components/card/default-card";
import CardStatistic from "@/components/card/card-statistic";
import { Sampling } from "@/types/notes/sampling.types";
import { LuScale, LuClipboardList, LuTrendingUp } from "react-icons/lu";
import { SelectCombobox } from "@/components/combobox/select";
import { usePool } from "@/lib/api/service/pools/usePool";
import { useListCycle } from "@/lib/api/service/cycles/useCycle";

const HARVEST_TARGET_GRAM = 750; // Use your actual target here
const MIN_PREDICTION_POINTS = 3;
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

const toWeight = (value: string | number) => {
  const parsed = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

const buildChartData = (samplings: Sampling[]) => {
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
    message = "Target panen sudah tercapai!";
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

  for (let day = 1; day <= MAX_PREDICTION_DAYS; day += 1) {
    const predictionDateMs = lastDate + MS_PER_DAY * day;
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
    message = `Estimasi target panen pada ${estimatedHarvestDate}.`;
  } else {
    message = `Target panen belum tercapai dalam ${MAX_PREDICTION_DAYS} hari ke depan.`;
  }

  return {
    chartData: mergedData,
    canPredict: true,
    estimatedHarvestDate,
    message,
    adg,
  };
};

interface SamplingOverviewProps {
  data: Sampling[];
}

const SamplingOverview: React.FC<SamplingOverviewProps> = ({ data }) => {
  const [selectedPool, setSelectedPool] = useState<string>("");
  const [selectedCycle, setSelectedCycle] = useState<string>("");

  const { data: dataPool, isLoading: isLoadingPool } = usePool();
  const { data: dataCycles, isLoading: isLoadingCycles } = useListCycle(
    selectedPool || "",
  );

  const filteredDataForChart = useMemo(() => {
    if (!selectedPool || !selectedCycle) return [];
    return data.filter(
      (item) => item.poolId === selectedPool && item.cycleId === selectedCycle,
    );
  }, [data, selectedPool, selectedCycle]);

  const { chartData, canPredict, message, adg } =
    useMemo(() => buildChartData(filteredDataForChart), [filteredDataForChart]);

  const summaryData = useMemo(() => {
    const totalData = filteredDataForChart.length;
    let averageTotal = 0;
    let maxWeight = 0;

    filteredDataForChart.forEach((item) => {
      const weight = toWeight(item.averageWeight) || 0;
      averageTotal += weight;
      if (weight > maxWeight) maxWeight = weight;
    });

    const averageWeight =
      totalData > 0 ? (averageTotal / totalData).toFixed(2) : 0;

    return [
      {
        title: "Total Sampling",
        value: totalData.toString(),
        icon: <LuClipboardList className="text-secondary" />,
      },
      {
        title: "Rata-rata Berat Keseluruhan",
        value: `${averageWeight} gram`,
        icon: <LuScale className="text-primary" />,
      },
      {
        title: "Berat Tertinggi",
        value: `${maxWeight} gram`,
        icon: <LuTrendingUp className="text-emerald-500" />,
      },
    ];
  }, [filteredDataForChart]);

  return (
    <div className="flex flex-col gap-4">
      <DefaultCard>
        <div className="flex gap-4 items-end mb-4">
          <div className="w-64">
            <SelectCombobox
              data={
                dataPool?.data?.map((pool) => ({
                  label: pool.name,
                  value: pool.id,
                })) || []
              }
              onValueChange={setSelectedPool}
              label="Pilih Kolam"
              name="Pilih Kolam..."
            />
          </div>
          <div className="w-64">
            <SelectCombobox
              data={
                dataCycles?.data?.map((cycle) => ({
                  label: formatDate(cycle.startDate),
                  value: cycle.id,
                })) || []
              }
              onValueChange={setSelectedCycle}
              label="Pilih Siklus"
              disable={!selectedPool}
              name="Pilih Siklus..."
            />
          </div>
        </div>
      </DefaultCard>

      {selectedPool && selectedCycle ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summaryData.map((item, index) => (
              <CardStatistic
                key={index}
                title={item.title}
                value={item.value}
                icon={item.icon}
              />
            ))}
          </div>
          <DefaultCard>
            <span className="font-semibold text-lg">
              Grafik Pertumbuhan Aktual & Prediksi (Trend Sampling)
            </span>
            <div className="mt-4 flex w-full h-[45vh] min-h-75 flex-col gap-2">
              <ChartContainer
                config={chartConfig}
                className="min-h-0 flex-1 w-full aspect-auto"
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
                    label={{
                      value: "Target panen",
                      position: "insideTopRight",
                    }}
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

              <div className="text-xs leading-relaxed text-muted-foreground flex flex-row gap-1">
                <span>{message}</span>
                {adg !== null && adg > 0 && (
                  <span className="font-medium text-foreground">
                    ADG: {adg.toFixed(2)} g/hari
                  </span>
                )}
              </div>
            </div>
          </DefaultCard>
        </>
      ) : (
        <DefaultCard>
          <div className="h-50 flex items-center justify-center text-muted-foreground text-sm">
            Silakan pilih kolam dan siklus terlebih dahulu untuk melihat
            ringkasan & grafik prediksi.
          </div>
        </DefaultCard>
      )}
    </div>
  );
};

export default SamplingOverview;
