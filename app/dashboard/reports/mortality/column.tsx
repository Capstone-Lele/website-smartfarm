"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { ImagePopup } from "@/components/image-popup";
import { MovePool } from "@/types/notes/move";
import { formatDate } from "@/lib/utils/format-date";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";
import { Mortality } from "@/types/notes/mortality";
import DetailMortalitySheet from "./detail";

export const columns: ColumnDef<Mortality>[] = [
  {
    accessorKey: "reportDate",
    meta: { label: "TANGGAL" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.reportDate);
    },
  },
  {
    accessorKey: "poolName",
    meta: { label: "KOLAM" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KOLAM" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-semibold">{row.original.poolName}</span>
          <span className="text-xs">
            {translateCategoryPool(row.original.poolCategory)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "cycle",
    meta: { label: "SIKLUS" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="SIKLUS" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.cycle);
    },
  },
  {
    accessorKey: "quantity",
    meta: { label: "JUMLAH MATI (ekor)" },
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="JUMLAH MATI (ekor)"
      />
    ),
    cell: ({ row }) => {
      return (
        <span className="font-semibold text-red-500">
          {row.original.quantity}
        </span>
      );
    },
  },
  {
    accessorKey: "image",
    meta: { label: "GAMBAR" },
    header: () => <span>GAMBAR</span>,
    cell: ({ row }) => (
      <ImagePopup imageUrl={row.original.image || "/placeholder-image.png"} />
    ),
  },
  {    accessorKey: "notes",
    meta: { label: "CATATAN" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="CATATAN" />
    ),
  },
  {
    accessorKey: "user",
    meta: { label: "PETUGAS" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="PETUGAS" />
    ),
  },
  {
    id: "actions",
    header: () => <span>ACTION</span>,
    cell: ({ row }) => <DetailMortalitySheet item={row.original} />,
  },
];
