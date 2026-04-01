"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { ImagePopup } from "@/components/image-popup";
import { MovePool } from "@/types/notes/move";
import { formatDate } from "@/lib/utils/format-date";
import { Finance } from "@/types/finance";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";

export const columns: ColumnDef<Finance>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.date);
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TIPE" />
    ),
    cell: ({ row }) => {
      return row.original.type === "in" ? 
      (<span className="text-green-500">Pemasukan</span>) : (<span className="text-red-500">Pengeluaran</span>);
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KATEGORI" />
    ),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="CATATAN" />
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
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TOTAL" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DIBUAT" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.createdAt || "");
    },
  },
  {
      id: "actions",
      header: () => <span className="">Actions</span>,
      cell: ({ row }) => {

  
        return (
          <div className="flex items-center text-primary gap-0.5">
            <ButtonDetailColumn href={`/dashboard/pools/${row.original.id}}`} />
            
          </div>
        );
      },
    },
];
