"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { ImagePopup } from "@/components/image-popup";
import { FinanceNonInventory } from "@/types/finance/finance-non-inventory";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { ButtonCopy } from "@/components/button-copy";

export const nonInventoryColumns: ColumnDef<FinanceNonInventory>[] = [
  {
    accessorKey: "transactionDate",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
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
    accessorKey: "productCategory",
    header: () => <span>KATEGORI PRODUK</span>,
  },
  {
    accessorKey: "product",
    header: () => <span>PRODUK</span>,
  },
  {
    accessorKey: "transactionType",
    header: () => <span>TIPE TRANSAKSI</span>,
  },
  {
    accessorKey: "quantity",
    header: () => <span>JUMLAH</span>,
    cell: ({ row }) => {
      return `${row.original.quantity} ${row.original.unit}`;
    },
  },
  {
    accessorKey: "pricePerItem",
    header: () => <span>HARGA/UNIT</span>,
    cell: ({ row }) => {
      return (
        <span>
          {formatRupiah(row.original.pricePerItem ?? 0)} / {row.original.unit}
        </span>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TOTAL HARGA" />
    ),
    cell: ({ row }) => {
      return formatRupiah(row.original.totalPrice ?? 0);
    },
  },

  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center text-primary gap-0.5">
          <ButtonDetailColumn
            href={`/dashboard/non-inventory/${row.original.sourceId}`}
          />
        </div>
      );
    },
  },
];
