"use client";

import React from "react";
import { LuActivity, LuFish, LuTrendingUp } from "react-icons/lu";
import { CardStatisticReport } from "@/components/card/card-statistic-report";
import { Scale } from "lucide-react";

interface SummaryData {
  totalRecords: number;
  totalQuantity: number;
  averageWeight: number;
}

interface SeedingSummaryCardsProps {
  summary: SummaryData;
}

export const SeedingSummaryCards: React.FC<SeedingSummaryCardsProps> = ({
  summary,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CardStatisticReport
        icon={<LuActivity size={20} />}
        title="Total Frekuensi Tebar"
        value={summary.totalRecords}
        unit="kali"
        iconBgColor="bg-blue-50"
        iconTextColor="text-blue-600"
      />

      <CardStatisticReport
        icon={<LuFish size={20} />}
        title="Total Bennih Ditebar"
        value={summary.totalQuantity}
        unit="ekor"
        iconBgColor="bg-emerald-50"
        iconTextColor="text-emerald-600"
      />

      <CardStatisticReport
        icon={<Scale size={20} />}
        title="Rata-rata Berat Awal"
        value={summary.averageWeight}
        unit="gram"
        iconBgColor="bg-violet-50"
        iconTextColor="text-violet-600"
      />
    </div>
  );
};
