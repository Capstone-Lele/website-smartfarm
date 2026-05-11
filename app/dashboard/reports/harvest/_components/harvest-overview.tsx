"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Harvest } from "@/types/notes/harvest";
import { HarvestSummaryCards } from "./harvest-summary-cards";
import { HarvestTrendChart } from "./harvest-trend-chart";

interface HarvestOverviewProps {
  data: Harvest[];
}

export const HarvestOverview: React.FC<HarvestOverviewProps> = ({ data }) => {
  const { summary, trendData } = useMemo(() => {
    const trendMap = new Map<string, any>();
    let totalKg = 0;
    let totalAmount = 0;

    data.forEach((item) => {
      const kg = parseFloat(item.totalKg) || 0;
      const amount = item.amount || 0;

      totalKg += kg;
      totalAmount += amount;

      const dateKey = format(new Date(item.date), "yyyy-MM-dd");

      if (!trendMap.has(dateKey)) {
        trendMap.set(dateKey, {
          date: format(new Date(item.date), "dd MMM", { locale: localeId }),
          timestamp: new Date(item.date).getTime(),
          "Total Kg": 0,
          "Total Ekor": 0,
        });
      }

      const existingData = trendMap.get(dateKey);
      existingData["Total Kg"] += kg;
      existingData["Total Ekor"] += amount;
    });

    const sortedTrendData = Array.from(trendMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    return {
      summary: {
        totalRecords: data.length,
        totalKg,
        totalAmount,
      },
      trendData: sortedTrendData,
    };
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <HarvestSummaryCards summary={summary} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <HarvestTrendChart trendData={trendData} />
        </div>
      </div>
    </div>
  );
};
