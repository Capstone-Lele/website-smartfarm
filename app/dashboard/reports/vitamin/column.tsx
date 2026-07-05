"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import Image from "next/image";
import { ImagePopup } from "@/components/image-popup";
import { Vitamin } from "@/types/notes/vitamin.types";
import { formatDate } from "@/lib/utils/format-date";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";
import DetailVitaminSheet from "./detail";

export const columns: ColumnDef<Vitamin>[] = [
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
    accessorKey: "cycleStartDate",
    meta: { label: "SIKLUS" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="SIKLUS" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.cycleStartDate);
    },
  },
  {
    accessorKey: "vitaminName",
    meta: { label: "VITAMIN" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="VITAMIN" />
    ),
  },
  {
    accessorKey: "quantity",
    meta: { label: "JUMLAH PAKAN" },
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="JUMLAH PAKAN"
      />
    ),
  },
  {
    accessorKey: "image",
    meta: { label: "GAMBAR" },
    header: () => <span>GAMBAR</span>,
    cell: ({ row }) => (
      <ImagePopup imageUrl={row.original.image || "/placeholder-image.png"} />
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
    cell: ({ row }) => <DetailVitaminSheet item={row.original} />,
  },
];
