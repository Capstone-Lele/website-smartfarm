"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Badge } from "@/components/ui/badge";
import { LuEye } from "react-icons/lu";
import { Cycle } from "@/types/cycle";
import { Button } from "@/components/ui/button";

export const columnsCycle: ColumnDef<Cycle>[] = [
  {
    accessorKey: "mulai",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="MULAI" />
    ),
  },
  {
    accessorKey: "selesai",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="SELESAI" />
    ),
  },
  {
    accessorKey: "kondisi",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KONDISI" />
    ),
    cell: ({ row }) => {
      const kondisi = row.original.kondisi;
      return (
        <Badge
          className={`${
            kondisi === "Aktif Budidaya"
              ? "bg-blue-100 text-blue-600 hover:bg-blue-100"
              : "bg-pink-100 text-pink-600 hover:bg-pink-100"
          } font-normal`}
        >
          {kondisi}
        </Badge>
      );
    },
  },
  {
    accessorKey: "jumlah_tebar",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="JUMLAH TEBAR"
      />
    ),
    cell: ({ row }) => (
      <span>{row.original.jumlah_tebar.toLocaleString("id-ID")}</span>
    ),
  },
  {
    accessorKey: "jumlah_terkini",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="JUMLAH TERKINI"
      />
    ),
    cell: ({ row }) => (
      <span>{row.original.jumlah_terkini.toLocaleString("id-ID")}</span>
    ),
  },
  {
    accessorKey: "kematian",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KEMATIAN" />
    ),
    cell: ({ row }) => {
      const kematian = row.original.kematian;
      return (
        <span className={kematian > 0 ? "text-red-500" : ""}>{kematian}</span>
      );
    },
  },
  {
    accessorKey: "umur",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="UMUR" />
    ),
  },
  {
    accessorKey: "pindah_kolam",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="PINDAH KOLAM"
      />
    ),
  },
  {
    id: "actions",
    header: () => <span className=""></span>,
    cell: ({ row }) => {
      // Placeholder for detail action
      return (
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <LuEye className="h-4 w-4 text-gray-500" />
        </Button>
      );
    },
  },
];
