"use client";

import DefaultCard from "@/components/card/default-card";
import { DataTable } from "@/components/data-table/data-table";
import React, { useMemo } from "react";
import { commodityColumns } from "./column";
import { useFinanceCommodity } from "@/lib/api/service/finance/useFinance";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";

interface Props {
  dateRange: { start: Date | null; end: Date | null };
}

const FinanceCommodityData = ({ dateRange }: Props) => {
  const { data: commodityData, isLoading, isError } = useFinanceCommodity();

  if (isLoading) {
    return (
      <DefaultCard>
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DefaultCard>
    );
  }

  if (isError) {
    return (
      <DefaultCard>
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-red-500">Failed to get data</p>
        </div>
      </DefaultCard>
    );
  }

  const filteredData = useMemo(() => {
    if (!commodityData) return [];
    if (!dateRange.start || !dateRange.end) return commodityData;
    const start = dateRange.start.getTime();
    const end = dateRange.end.getTime();
    return commodityData.filter((item) => {
      const t = new Date(item.transactionDate).getTime();
      return t >= start && t <= end;
    });
  }, [commodityData, dateRange]);

  return (
    <DefaultCard>
      <div className="flex justify-end mb-4">
        <Link
          href="/dashboard/commodity"
          className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LuExternalLink />
          Catatan Penjualan Komoditas
        </Link>
      </div>
      <DataTable columns={commodityColumns} data={filteredData} />
    </DefaultCard>
  );
};

export default FinanceCommodityData;
