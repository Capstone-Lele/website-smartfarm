"use client";

import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Feed } from "@/types/notes/feed.types";

import { FeedingSummaryCards } from "./feeding-summary-cards";
import { FeedingTrendChart } from "./feeding-trend-chart";
import { FeedingFoodChart } from "./feeding-food-chart";
import { FeedingPoolChart } from "./feeding-pool-chart";

interface FeedingOverviewProps {
  data: Feed[];
}

export const FeedingOverview: React.FC<FeedingOverviewProps> = ({ data }) => {
  const { summary, foodData, trendData, poolData } = useMemo(() => {
    const foodMap = new Map<string, any>();
    const poolMap = new Map<string, any>();
    const trendMap = new Map<string, any>();
    let totalFeedQuantity = 0;

    data.forEach((item) => {
      const qty = parseFloat(item.quantity) || 0;
      totalFeedQuantity += qty;
      // Gunakan reportDate sebagai acuan tanggal, fallback ke createdAt
      const dateKey = format(
        new Date(item.reportDate || item.createdAt),
        "yyyy-MM-dd",
      );

      // Buat key yang menggabungkan nama pakan dan unitnya
      const foodKey = `${item.foodName} (${item.unit})`;

      // 1. Grouping Data Pakan (untuk FoodChart)
      if (!foodMap.has(foodKey)) {
        foodMap.set(foodKey, {
          name: foodKey,
          quantity: 0,
          unit: item.unit,
        });
      }
      foodMap.get(foodKey).quantity += qty;

      // 2. Grouping Data Kolam (untuk PoolChart)
      if (!poolMap.has(item.poolName)) {
        poolMap.set(item.poolName, { poolName: item.poolName });
      }
      const poolObj = poolMap.get(item.poolName);
      poolObj[foodKey] = (poolObj[foodKey] || 0) + qty;

      // 3. Grouping Data Trend per Tanggal (untuk TrendChart)
      if (!trendMap.has(dateKey)) {
        trendMap.set(dateKey, { date: dateKey });
      }
      const trendObj = trendMap.get(dateKey);
      trendObj[foodKey] = (trendObj[foodKey] || 0) + qty;
    });

    return {
      summary: {
        totalRecords: data.length, // Total kali pemberian makan
        totalFeedQuantity, // Total jumlah pakan dalam kg
        totalFeedTypes: foodMap.size, // Berapa jenis pakan yang digunakan
        totalPools: poolMap.size,
      },
      foodData: Array.from(foodMap.values()),
      poolData: Array.from(poolMap.values()),
      trendData: Array.from(trendMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    };
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <FeedingSummaryCards summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FeedingTrendChart trendData={trendData} foodData={foodData} />
        <FeedingFoodChart foodData={foodData} />
      </div>

      <FeedingPoolChart poolData={poolData} foodData={foodData} />
    </div>
  );
};
