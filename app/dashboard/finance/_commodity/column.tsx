"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { FinanceCommodity } from "@/types/finance/finance-commodity";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { ButtonCopy } from "@/components/button-copy";

export const commodityColumns: ColumnDef<FinanceCommodity>[] = [
  {
    accessorKey: "id",
    header: () => <span>ID TRANSAKSI</span>,
    cell: ({ row }) => (
      <ButtonCopy textToCopy={row.original.id} truncateLength={10} />
    ),
  },
  {
    accessorKey: "transactionDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="TANGGAL TRANSAKSI"
      />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.transactionDate);
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TIPE" />
    ),
    cell: ({ row }) => {
      return row.original.type === "in" ? (
        <span className="text-green-500">Pemasukan</span>
      ) : (
        <span className="text-red-500">Pengeluaran</span>
      );
    },
  },
  {
    accessorKey: "transactionSource",
    header: () => <span>SUMBER TRANSAKSI</span>,
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="CATATAN TRANSAKSI"
      />
    ),
    cell: ({ row }) =>
      row.original.notes.length > 50
        ? `${row.original.notes.substring(0, 50)}...`
        : row.original.notes,
  },
  {
    accessorKey: "buyer",
    header: () => <span>PEMBELI</span>,
  },
  {
    accessorKey: "totalOrder",
    header: () => <span>JML PESANAN</span>,
  },
  {
    accessorKey: "totalItem",
    header: () => <span>JML EKOR</span>,
  },
  {
    accessorKey: "totalKg",
    header: () => <span>TOTAL (KG)</span>,
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TOTAL HARGA" />
    ),
    cell: ({ row }) => {
      return <span>{formatRupiah(row.original.totalPrice)}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DIBUAT" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    },
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center text-primary gap-0.5">
          <ButtonDetailColumn
            href={`/dashboard/finance/commodity/${row.original.id}`}
          />
        </div>
      );
    },
  },
];
