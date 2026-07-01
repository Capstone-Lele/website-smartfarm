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
import { formatRupiahTypeTransactionColumn } from "@/lib/utils/format-rupiah-type-transaction-column";

export const nonInventoryColumns: ColumnDef<FinanceNonInventory>[] = [
  {
    id: "transactionDate",
    accessorFn: (row) => formatDate(row.transactionDate),
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
    cell: ({ row }) => {
      return row.getValue("transactionDate");
    },
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
    id: "quantity",
    accessorFn: (row) => {
      if (row.unit.toLowerCase() == "uang") {
        return "-";
      }
      return `${row.quantity}`;
    },
    header: () => <span>JUMLAH</span>,
    cell: ({ row }) => {
      return row.getValue("quantity");
    },
  },
  {
    id: "pricePerItem",
    accessorFn: (row) => {
      const priceStr =
        row.pricePerItem !== null && row.pricePerItem !== undefined
          ? formatRupiah(Number(row.pricePerItem))
          : "-";
      return row.transactionType === "grant"
        ? `${priceStr} (perkiraan)`
        : priceStr;
    },
    header: () => <span>HARGA/UNIT</span>,
    cell: ({ row }) => {
      return formatRupiahTypeTransactionColumn(
        row.original.pricePerItem,
        row.original.transactionType,
      );
    },
  },
  {
    accessorKey: "unit",
    header: () => <span>UNIT</span>,
  },
  {
    id: "totalPrice",
    accessorFn: (row) => {
      const priceStr =
        row.totalPrice !== null && row.totalPrice !== undefined
          ? formatRupiah(Number(row.totalPrice))
          : "-";
      return row.transactionType === "grant"
        ? `${priceStr} (perkiraan)`
        : priceStr;
    },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TOTAL HARGA" />
    ),
    cell: ({ row }) => {
      return formatRupiahTypeTransactionColumn(
        row.original.totalPrice,
        row.original.transactionType,
      );
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
