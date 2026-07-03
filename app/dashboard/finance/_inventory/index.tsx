"use client";

import DefaultCard from "@/components/card/default-card";
import { DataTable } from "@/components/data-table/data-table";
import React, { useMemo } from "react";
import { inventoryColumns } from "./column";
import { useFinanceInventory } from "@/lib/api/service/finance/useFinance";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";

interface Props {
  dateRange: { start: Date | null; end: Date | null };
}

const FinanceInventoryData = ({ dateRange }: Props) => {
  const { data: inventoryData, isLoading, isError } = useFinanceInventory();

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
    if (!inventoryData) return [];
    if (!dateRange.start || !dateRange.end) return inventoryData;
    const start = dateRange.start.getTime();
    const end = dateRange.end.getTime();
    return inventoryData.filter((item) => {
      const t = new Date(item.transactionDate).getTime();
      return t >= start && t <= end;
    });
  }, [inventoryData, dateRange]);

  // Compute reversal info for each item
  const dataWithReversalInfo = useMemo(() => {
    if (!filteredData) return [];
    return filteredData.map((item) => {
      const reversalSource = item.referenceTransactionSourceId
        ? inventoryData?.find(
            (detail) => detail.sourceId === item.referenceTransactionSourceId,
          )
        : null;
      const reversedBy = item.sourceId
        ? inventoryData?.find(
            (detail) =>
              detail.type === "reversal" &&
              detail.referenceTransactionSourceId === item.sourceId,
          )
        : null;

      return {
        ...item,
        reversalSourceId: reversalSource?.sourceId ?? null,
        reversalSourceLabel:
          reversalSource?.id || item.referenceTransactionSourceId || null,
        reversedBySourceId: reversedBy?.sourceId ?? null,
      };
    });
  }, [filteredData, inventoryData]);

  return (
    <DefaultCard>
      <div className="flex justify-end mb-4">
        <Link
          href="/dashboard/inventory"
          className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LuExternalLink />
          Catatan Inventaris
        </Link>
      </div>
      <DataTable columns={inventoryColumns} data={dataWithReversalInfo} />
    </DefaultCard>
  );
};

export default FinanceInventoryData;
