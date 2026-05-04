"use client";

import React from "react";
import { SimpleDataTable } from "@/components/data-table/simple-data-table";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { formatDate } from "@/lib/utils/format-date";

// Contoh column
const columns = [
  {
    accessorKey: "createdAt",
    header: "WAKTU",
    cell: ({ row }: any) => {
      return formatDate(row.getValue("createdAt"));
    },
  },
  {
    accessorKey: "ph",
    header: "pH AIR",
  },
  {
    accessorKey: "temp",
    header: "SUHU (°C)",
  },
];

export const WaterQualityTable = ({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) => {
  return (
    <div className="w-full max-h-75 overflow-auto">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <SimpleDataTable columns={columns as any} data={data || []} />
      )}
    </div>
  );
};
