"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import Image from "next/image";
import { ImagePopup } from "@/components/image-popup";
import { Feed } from "@/types/notes/feed.types";
import { formatDate } from "@/lib/utils/format-date";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";
import DetailFeedingSheet from "./detail";

export const columns: ColumnDef<Feed>[] = [
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
    accessorKey: "startDate",
    meta: { label: "SIKLUS" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="SIKLUS" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.startDate);
    },
  },
  {
    accessorKey: "foodName",
    meta: { label: "PAKAN" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="PAKAN" />
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
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-semibold">{row.original.quantity}</span>
          <span className="text-xs">{row.original.unit}</span>
        </div>
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
    cell: ({ row }) => <DetailFeedingSheet item={row.original} />,
  },
];
