"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { ImagePopup } from "@/components/image-popup";
import { MovePool } from "@/types/notes/move";
import { formatDate } from "@/lib/utils/format-date";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";

export const columns: ColumnDef<MovePool>[] = [
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
    accessorKey: "originPoolName",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KOLAM ASAL" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-semibold">{row.original.originPoolName}</span>
          <span className="text-xs">
            {translateCategoryPool(row.original.originCategory)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "originStartDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="SIKLUS KOLAM ASAL"
      />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.originStartDate);
    },
  },
  {
    accessorKey: "destinationPoolName",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="KOLAM TUJUAN"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-semibold">
            {row.original.destinationPoolName}
          </span>
          <span className="text-xs">
            {translateCategoryPool(row.original.destinationCategory)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "destinationStartDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="SIKLUS KOLAM TUJUAN"
      />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.destinationStartDate);
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="JUMLAH (ekor)"
      />
    ),
    cell: ({ row }) => <span>{row.original.quantity}</span>,
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
