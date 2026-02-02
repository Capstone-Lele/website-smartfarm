"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import Image from "next/image";
import { ImagePopup } from "@/components/image-popup";

export type VitaminReport = {
  id: string;
  image: string;
  age: number;
  vitaminType: string;
  feedWeight: number;
  actor: string;
  date: string;
};

export const columns: ColumnDef<VitaminReport>[] = [
  {
    accessorKey: "image",
    header: () => <span>GAMBAR</span>,
    cell: ({ row }) => (
      <ImagePopup imageUrl={row.original.image || "/placeholder-image.png"} />
    ),
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="UMUR" />
    ),
    cell: ({ row }) => <span>{row.original.age} Hari</span>,
  },
  {
    accessorKey: "feedWeight",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="BERAT PAKAN" />
    ),
    cell: ({ row }) => <span>{row.original.feedWeight} kg</span>,
  },
  {
    accessorKey: "vitaminType",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="JENIS VITAMIN"
      />
    ),
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
