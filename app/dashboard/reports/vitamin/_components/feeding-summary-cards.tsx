"use client";

import React from "react";
import { LuPackage, LuTrendingUp, LuActivity } from "react-icons/lu";
import { CardStatisticReport } from "@/components/card/card-statistic-report";

interface SummaryData {
  totalRecords: number;
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CardStatisticReport
        icon={<LuActivity size={20} />}
        title="Total Pemberian Vitamin"
        value={summary.totalRecords}
        unit="kali"
        iconBgColor="bg-blue-50"
        iconTextColor="text-blue-600"
      />

      <CardStatisticReport
        icon={<LuPackage size={20} />}
        title="Jenis Vitamin"
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
