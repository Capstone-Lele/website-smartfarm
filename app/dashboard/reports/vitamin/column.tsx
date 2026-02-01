"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import Image from "next/image";

export type VitaminReport = {
  id: string;
  image: string;
  age: number;
  vitaminType: string;
  actor: string;
  date: string;
};

export const columns: ColumnDef<VitaminReport>[] = [
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
