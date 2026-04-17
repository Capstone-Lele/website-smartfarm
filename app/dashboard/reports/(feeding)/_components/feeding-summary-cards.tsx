"use client";

import React from "react";
import { LuPackage, LuTrendingUp, LuActivity } from "react-icons/lu";
import { CardStatisticReport } from "@/components/card/card-statistic-report";

interface SummaryData {
  totalRecords: number;
  totalFeedQuantity: number;
  totalFeedTypes: number;
  totalPools: number;
}

interface FeedingSummaryCardsProps {
  summary: SummaryData;
}

export const FeedingSummaryCards: React.FC<FeedingSummaryCardsProps> = ({
  summary,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <CardStatisticReport
        icon={<LuActivity size={20} />}
        title="Total Pemberian Pakan"
        value={summary.totalRecords}
        unit="kali"
        iconBgColor="bg-blue-50"
        iconTextColor="text-blue-600"
      />

      <CardStatisticReport
        icon={<LuActivity size={20} />}
        title="Total Jumlah Pakan"
        value={summary.totalFeedQuantity}
        unit="kg"
        iconBgColor="bg-violet-50"
        iconTextColor="text-violet-600"
      />

      <CardStatisticReport
        icon={<LuPackage size={20} />}
        title="Jenis Pakan"
        value={summary.totalFeedTypes}
        unit="macam"
        iconBgColor="bg-emerald-50"
        iconTextColor="text-emerald-600"
      />

      <CardStatisticReport
        icon={<LuTrendingUp size={20} />}
        title="Total Kolam"
        value={summary.totalPools}
        unit="kolam"
        iconBgColor="bg-amber-50"
        iconTextColor="text-amber-600"
      />
    </div>
  );
};
