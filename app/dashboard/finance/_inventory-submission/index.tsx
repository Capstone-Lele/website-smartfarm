"use client";

import DefaultCard from "@/components/card/default-card";
import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { inventorySubmissionColumns } from "./column";
import PostFinance from "../post";
import { useFinanceInventorySubmission } from "@/lib/api/service/finance/useFinance";
import { Loader2 } from "lucide-react";
import { LuExternalLink } from "react-icons/lu";
import Link from "next/link";

const FinanceInventorySubmissionData = () => {
  const {
    data: inventorySubmissionData,
    isLoading,
    isError,
  } = useFinanceInventorySubmission();

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
        <Link href="/dashboard/inventory-submission" className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <LuExternalLink />
          Catatan Pengajuan Inventaris
        </Link>
      </div>
      <DataTable
        columns={inventorySubmissionColumns}
        data={inventorySubmissionData || []}
      />
    </DefaultCard>
  );
};

export default FinanceInventorySubmissionData;
