"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import Image from "next/image";

export type FeedingReport = {
  id: string;
  image: string;
  age: number;
  feedWeight: number;
  feedType: string;
  actor: string;
  date: string;
};

export const columns: ColumnDef<FeedingReport>[] = [
  {
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="GAMBAR" />
    ),
    cell: ({ row }) => {
      const image = row.original.image;
      return (
        <div className="relative h-16 w-16 overflow-hidden rounded-md">
          <Image src={image} alt="Feeding" fill className="object-cover" />
        </div>
      );
    },
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
    accessorKey: "feedType",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="JENIS PAKAN" />
    ),
  },
  {
    accessorKey: "actor",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="AKTOR" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
  },
];
