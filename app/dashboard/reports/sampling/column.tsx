"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { ImagePopup } from "@/components/image-popup";
import { formatDate } from "@/lib/utils/format-date";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";
import { Sampling } from "@/types/notes/sampling.types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Sampling>[] = [
  {
    accessorKey: "reportDate",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.reportDate);
    },
  },
  {
    accessorKey: "poolName",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KOLAM" />
    ),
    cell: ({ row }) => {
          return (
            <div className="flex flex-col">
              <span className="font-semibold">{row.original.poolName}</span>
              <span className="text-xs">{translateCategoryPool(row.original.poolCategory)}</span>
            </div>
          );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="JUMLAH (ekor)" />
    ),
  },
  {
    accessorKey: "averageWeight",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="BERAT RATA-RATA (gram)"
      />
    ),
  },
  {
    accessorKey: "image",
    header: () => <span>GAMBAR</span>,
    cell: ({ row }) => (
      <ImagePopup imageUrl={row.original.image || "/placeholder-image.png"} />
    ),
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="PETUGAS" />
    ),
  },
];
