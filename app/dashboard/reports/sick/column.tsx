"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { ImagePopup } from "@/components/image-popup";

export type SickReport = {
  id: string;
  cycle: string;
  sourcePool: string;
  amount: number;
  date: string;
  actor: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<SickReport>[] = [
  {
    accessorKey: "image",
    header: () => <span>GAMBAR</span>,
    cell: ({ row }) => (
      <ImagePopup imageUrl={row.original.image || "/placeholder-image.png"} />
    ),
  },

  {
    accessorKey: "cycle",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="SIKLUS" />
    ),
  },
  {
    accessorKey: "sourcePool",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KOLAM ASAL" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="JUMLAH" />
    ),
    cell: ({ row }) => <span>{row.original.amount} Ekor</span>,
  },
  {
    accessorKey: "actor",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="PETUGAS" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
  },
];
