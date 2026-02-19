"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";

export type DailyReport = {
  id: string;
  date: string;
  activity: string;
  pool: string;
  cycle: string;
  actor: string;
  image: string;
};

export const columns: ColumnDef<DailyReport>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
  },
  {
    accessorKey: "image",
    header: () => <span>GAMBAR</span>,
    cell: ({ row }) => <span>{row.original.image ? "Ada" : "-"}</span>,
  },

  {
    accessorKey: "activity",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="AKTIVITAS" />
    ),
  },
  {
    accessorKey: "pool",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KOLAM" />
    ),
  },
  {
    accessorKey: "cycle",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="SIKLUS" />
    ),
  },
  {
    accessorKey: "actor",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="PETUGAS" />
    ),
  },
];
