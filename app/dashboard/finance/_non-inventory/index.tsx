"use client";

import DefaultCard from "@/components/card/default-card";
import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { nonInventoryColumns } from "./column";
import PostFinance from "../post";
import { useFinanceNonInventory } from "@/lib/api/service/finance/useFinance";
import { Loader2 } from "lucide-react";

const FinanceNonInventoryData = () => {
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

  return (
    <DefaultCard>
      <div className="flex justify-end mb-4">
        <PostFinance />
      </div>
      <DataTable columns={nonInventoryColumns} data={nonInventoryData || []} />
    </DefaultCard>
  );
};

export default FinanceNonInventoryData;
