"use client";

import DefaultCard from "@/components/card/default-card";
import { DataTable } from "@/components/data-table/data-table";
import React, { useMemo } from "react";
import { nonInventoryColumns } from "./column";
import { useFinanceNonInventory } from "@/lib/api/service/finance/useFinance";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";

interface Props {
  dateRange: { start: Date | null; end: Date | null };
}

const FinanceNonInventoryData = ({ dateRange }: Props) => {
  const {
    data: nonInventoryData,
    isLoading,
    isError,
  } = useFinanceNonInventory();

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
    if (!nonInventoryData) return [];
    if (!dateRange.start || !dateRange.end) return nonInventoryData;
    const start = dateRange.start.getTime();
    const end = dateRange.end.getTime();
    return nonInventoryData.filter((item) => {
      const t = new Date(item.transactionDate).getTime();
      return t >= start && t <= end;
    });
  }, [nonInventoryData, dateRange]);

  return (
    <DefaultCard>
      <div className="flex justify-end mb-4">
        <Link
          href="/dashboard/non-inventory"
          className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LuExternalLink />
          Catatan Non-Inventaris
        </Link>
      </div>
      <DataTable columns={nonInventoryColumns} data={filteredData} />
    </DefaultCard>
  );
};

export default FinanceNonInventoryData;
