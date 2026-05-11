"use client";

import React from "react";
import { LuPackage, LuActivity, LuFish } from "react-icons/lu";
import { CardStatisticReport } from "@/components/card/card-statistic-report";
import { Scale } from "lucide-react";

interface SummaryData {
  totalRecords: number;
  totalKg: number;
  totalAmount: number;
}

interface HarvestSummaryCardsProps {
  summary: SummaryData;
}

export const HarvestSummaryCards: React.FC<HarvestSummaryCardsProps> = ({
  summary,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CardStatisticReport
        icon={<LuActivity size={20} />}
        title="Total Frekuensi Panen"
        value={summary.totalRecords}
        unit="kali"
        iconBgColor="bg-blue-50"
        iconTextColor="text-blue-600"
      />

      <CardStatisticReport
        icon={<Scale size={20} />}
        title="Total Berat Panen"
        value={summary.totalKg}
        unit="kg"
        iconBgColor="bg-violet-50"
        iconTextColor="text-violet-600"
      />

      <CardStatisticReport
        icon={<LuFish size={20} />}
        title="Total Jumlah Panen"
        value={summary.totalAmount}
        unit="ekor"
        iconBgColor="bg-emerald-50"
        iconTextColor="text-emerald-600"
      />
    </div>
  );
};
