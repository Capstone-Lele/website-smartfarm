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
import { formatDate } from "@/lib/utils/format-date";
import DefaultCard from "@/components/card/default-card";
import CardStatistic from "@/components/card/card-statistic";
import { Sampling } from "@/types/notes/sampling.types";
import { LuScale, LuClipboardList, LuTrendingUp } from "react-icons/lu";
import { SelectCombobox } from "@/components/combobox/select";
import { usePool } from "@/lib/api/service/pools/usePool";
import { useListCycle } from "@/lib/api/service/cycles/useCycle";

const HARVEST_TARGET_GRAM = 350; // Use your actual target here
const MIN_PREDICTION_POINTS = 3;
const MAX_PREDICTION_POINTS = 20;

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

const getAverageIntervalMs = (points: ChartPoint[]) => {
  const timestamps = points
    .map((point) => new Date(point.reportDate).getTime())
    .filter((time) => Number.isFinite(time));

  if (timestamps.length < 2) return 24 * 60 * 60 * 1000;

  const total = timestamps
    .slice(1)
    .reduce((acc, current, index) => acc + (current - timestamps[index]), 0);

  return Math.max(
    24 * 60 * 60 * 1000,
    Math.round(total / (timestamps.length - 1)),
  );
};

const buildChartData = (samplings: Sampling[]) => {
  const sorted = [...samplings].sort(
    (a, b) =>
      new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime(),
  );

  const baseData: ChartPoint[] = sorted.map((item) => ({
    reportDate: item.reportDate,
    label: formatDate(item.reportDate),
    actual: toWeight(item.averageWeight),
    prediction: null,
  }));

  const points = baseData
    .map((item, index) => ({ x: index, y: item.actual }))
    .filter((item): item is { x: number; y: number } => item.y !== null);

  if (points.length < MIN_PREDICTION_POINTS) {
    return {
      chartData: baseData,
      canPredict: false,
      estimatedHarvestDate: null as string | null,
      predictionPointCount: points.length,
    };
  }

  const n = points.length;
  const sumX = points.reduce((acc, point) => acc + point.x, 0);
  const sumY = points.reduce((acc, point) => acc + point.y, 0);
  const sumXY = points.reduce((acc, point) => acc + point.x * point.y, 0);
  const sumXX = points.reduce((acc, point) => acc + point.x * point.x, 0);
  const denominator = n * sumXX - sumX * sumX;

  if (denominator === 0) {
    return {
      chartData: baseData,
      canPredict: false,
      estimatedHarvestDate: null as string | null,
      predictionPointCount: points.length,
    };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  const mergedData: ChartPoint[] = [...baseData];
  const lastKnown = mergedData[mergedData.length - 1];

  if (!lastKnown || lastKnown.actual === null) {
    return {
      chartData: mergedData,
      canPredict: false,
      estimatedHarvestDate: null as string | null,
      predictionPointCount: points.length,
    };
  }

  lastKnown.prediction = Number(lastKnown.actual.toFixed(2));

  const averageIntervalMs = getAverageIntervalMs(baseData);
  const lastDate = new Date(lastKnown.reportDate).getTime();
  let estimatedHarvestDate: string | null = null;

  for (let offset = 1; offset <= MAX_PREDICTION_POINTS; offset += 1) {
    const xValue = points[points.length - 1].x + offset;
    const predicted = slope * xValue + intercept;
    const predictionDate = new Date(
      lastDate + averageIntervalMs * offset,
    ).toISOString();

    mergedData.push({
      reportDate: predictionDate,
      label: formatDate(predictionDate),
      actual: null,
      prediction: Number(predicted.toFixed(2)),
    });

    if (!estimatedHarvestDate && predicted >= HARVEST_TARGET_GRAM) {
      estimatedHarvestDate = formatDate(predictionDate);
      break;
    }
  }

  return {
    chartData: mergedData,
    canPredict: true,
    estimatedHarvestDate,
    predictionPointCount: points.length,
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

  const { chartData, canPredict, estimatedHarvestDate, predictionPointCount } =
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
            <div className="w-full h-[45vh] min-h-[300px] mt-4">
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

              <div className="mt-2 text-xs text-muted-foreground">
                Prediksi ditampilkan jika minimal {MIN_PREDICTION_POINTS} data
                sampling.
                {canPredict
                  ? estimatedHarvestDate
                    ? ` Estimasi target panen pada ${estimatedHarvestDate}.`
                    : " Target panen belum tercapai dalam horizon prediksi saat ini."
                  : ` Saat ini baru ${predictionPointCount} data.`}
              </div>
            </div>
          </DefaultCard>
        </>
      ) : (
        <DefaultCard>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            Silakan pilih kolam dan siklus terlebih dahulu untuk melihat
            ringkasan & grafik prediksi.
          </div>
        </DefaultCard>
      )}
    </div>
  );
};

export default SamplingOverview;
