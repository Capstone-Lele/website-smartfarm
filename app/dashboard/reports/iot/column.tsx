"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IOTData, IOTDataHistorical } from "@/types/notes/iot";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { format } from "date-fns";

export const getColumns = (
  filterType: "ph" | "temp" | "all",
): ColumnDef<IOTDataHistorical>[] => {
  const baseColumns: ColumnDef<IOTDataHistorical>[] = [
    {
      accessorKey: "node_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Node ID" />
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Waktu" />
      ),
      cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string;
        if (!dateStr) return "-";
        return format(new Date(dateStr), "dd MMM yyyy, HH:mm");
      },
    },
  ];

  if (filterType === "ph" || filterType === "all") {
    baseColumns.push({
      accessorKey: "ph",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="pH Air" />
      ),
    });
  }

  if (filterType === "temp" || filterType === "all") {
    baseColumns.push({
      accessorKey: "temp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Suhu (°C)" />
      ),
    });
  }

  return baseColumns;
};
