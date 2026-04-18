"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IOTData } from "@/types/notes/iot";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { format } from "date-fns";

export const getColumns = (
  filterType: "ph" | "temp" | "all",
): ColumnDef<IOTData>[] => {
  const baseColumns: ColumnDef<IOTData>[] = [
    {
      accessorKey: "node_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Node ID" />
      ),
    },
    {
      accessorKey: "receivedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Waktu" />
      ),
      cell: ({ row }) => {
        const dateStr = row.getValue("receivedAt") as string;
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
