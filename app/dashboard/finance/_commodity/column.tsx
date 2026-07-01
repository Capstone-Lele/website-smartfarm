"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { FinanceCommodity } from "@/types/finance/finance-commodity";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { ButtonCopy } from "@/components/button-copy";
import { sourceLabelTranslation } from "@/lib/constants/type-finance";

export const commodityColumns: ColumnDef<FinanceCommodity>[] = [
  {
    accessorKey: "id",
    header: () => <span>ID TRANSAKSI</span>,
    cell: ({ row }) => (
      <ButtonCopy textToCopy={row.original.id} truncateLength={10} />
    ),
  },
  {
    id: "transactionDate",
    accessorFn: (row) => formatDate(row.transactionDate),
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="TANGGAL TRANSAKSI"
      />
    ),
    cell: ({ row }) => row.getValue("transactionDate"),
  },
  {
    id: "type",
    accessorFn: (row) => (row.type === "in" ? "Pemasukan" : "Pengeluaran"),
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
    id: "transactionSource",
    accessorFn: (row) => sourceLabelTranslation(row.transactionSource),
    header: () => <span>SUMBER TRANSAKSI</span>,
    cell: ({ row }) => row.getValue("transactionSource"),
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
    id: "totalPrice",
    accessorFn: (row) => formatRupiah(row.totalPrice),
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TOTAL HARGA" />
    ),
    cell: ({ row }) => <span>{row.getValue("totalPrice")}</span>,
  },
  {
    id: "createdAt",
    accessorFn: (row) => formatDate(row.createdAt),
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DIBUAT" />
    ),
    cell: ({ row }) => row.getValue("createdAt"),
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center text-primary gap-0.5">
          <ButtonDetailColumn
            href={`/dashboard/finance/${row.original.sourceId}?type=commodity_sales`}
          />
        </div>
      );
    },
  },
];
