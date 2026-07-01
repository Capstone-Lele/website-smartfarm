"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Badge } from "@/components/ui/badge";
import { LuEye } from "react-icons/lu";
import { Cycle } from "@/types/cycle";
import { Button } from "@/components/ui/button";
import { useParams, useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { ALL_CYCLE_CONDITIONS } from "@/lib/constants/condition";

export const columnsCycle: ColumnDef<Cycle>[] = [
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="MULAI" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.startDate);
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="SELESAI" />
    ),
    cell: ({ row }) => {
      if (!row.original.endDate) {
        return <span className="text-gray-500">-</span>;
      }
      return formatDate(row.original.endDate);
    },
  },
  {
    id: "condition",
    accessorFn: (row) => {
      const condition = ALL_CYCLE_CONDITIONS.find(
        (cond) => cond.value === row.condition
      );
      return condition?.label || "Unknown";
    },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KONDISI" />
    ),
    cell: ({ row }) => {
      const val = row.getValue("condition") as string;
      return (
        <Badge
          className={`${
            row.original.condition === "active_cultivation"
              ? "bg-blue-100 text-blue-600 hover:bg-blue-100"
              : "bg-pink-100 text-pink-600 hover:bg-pink-100"
          } font-normal`}
        >
          {val}
        </Badge>
      );
    },
  },
  {
    accessorKey: "initialQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="JUMLAH TEBAR"
      />
    ),
    cell: ({ row }) => (
      <span>{row.original.initialQuantity?.toLocaleString("id-ID")}</span>
    ),
  },
  {
    accessorKey: "currentQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="JUMLAH TERKINI"
      />
    ),
    cell: ({ row }) => (
      <span>{row.original.currentQuantity?.toLocaleString("id-ID")}</span>
    ),
  },
  {
    accessorKey: "mortality",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KEMATIAN" />
    ),
    cell: ({ row }) => {
      const kematian = row.original.mortality ?? 0;
      return (
        <span className={kematian > 0 ? "text-red-500" : ""}>{kematian}</span>
      );
    },
  },
    {
    accessorKey: "movedQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PINDAH KOLAM" />
    ),
  },
  {
    id: "umur",
    accessorFn: (row) => {
      const { startDate, endDate } = row;
      if (!startDate) return "-";

      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date();

      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return `${diffDays >= 0 ? diffDays : 0} Hari`;
    },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="UMUR" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue("umur")}</span>;
    },
  },
  {
    id: "actions",
    header: () => <span className=""></span>,
    cell: ({ row }) => {
      const params = useParams();
      return (
        <ButtonDetailColumn href={`/dashboard/pools/${params.poolId}/${row.original.id}`} />
        
      );
    },
  },
];
