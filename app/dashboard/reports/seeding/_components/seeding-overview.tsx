"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Seed } from "@/types/notes/seed";
import { SeedingSummaryCards } from "./seeding-summary-cards";
import { SeedingTrendChart } from "./seeding-trend-chart";

interface SeedingOverviewProps {
  data: Seed[];
}

export const SeedingOverview: React.FC<SeedingOverviewProps> = ({ data }) => {
  const { summary, trendData, poolData } = useMemo(() => {
    const trendMap = new Map<string, any>();
    const poolSet = new Set<string>();
    let totalQuantity = 0;
    let totalWeight = 0;

    data.forEach((item) => {
      const quantity = item.initialQuantity || 0;
      const weight = parseFloat(item.initialAverageWeight) || 0;
      const poolName = item.poolName || "Unknown Pool";

      poolSet.add(poolName);

      totalQuantity += quantity;
      totalWeight += weight;

      const dateKey = format(new Date(item.reportDate), "yyyy-MM-dd");

      if (!trendMap.has(dateKey)) {
        trendMap.set(dateKey, {
          date: format(new Date(item.reportDate), "dd MMM", {
            locale: localeId,
          }),
          timestamp: new Date(item.reportDate).getTime(),
        });
      }

      const existingData = trendMap.get(dateKey);
      existingData[poolName] = (existingData[poolName] || 0) + quantity;
    });

    const sortedTrendData = Array.from(trendMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    // Convert poolSet to array of objects for the chart
    const poolDataArray = Array.from(poolSet).map((name) => ({ name }));

    const averageWeight =
      data.length > 0 ? (totalWeight / data.length).toFixed(2) : 0;

    return {
      summary: {
        totalRecords: data.length,
        totalQuantity,
        averageWeight: Number(averageWeight),
      },
      trendData: sortedTrendData,
      poolData: poolDataArray,
    };
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <SeedingSummaryCards summary={summary} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <SeedingTrendChart trendData={trendData} poolData={poolData} />
        </div>
      </div>
    </div>
  );
};
