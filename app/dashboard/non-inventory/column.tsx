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
import { Badge } from "@/components/ui/badge";
import { INVENTORY_TRANSACTION_TYPE_OPTIONS } from "@/lib/constants/type-inventory";

const NonInventoryActions = ({ row }: { row: FinanceNonInventory }) => {
  return (
    <div className="flex items-center text-primary gap-0.5">
      <ButtonDetailColumn href={`/dashboard/non-inventory/${row.sourceId}`} />
    </div>
  );
};

export const nonInventoryColumns: ColumnDef<FinanceNonInventory>[] = [
  {
    accessorKey: "sourceId",
    meta: { label: "ID CATATAN" },
    header: () => <span>ID CATATAN</span>,
    cell: ({ row }) => (
      <ButtonCopy textToCopy={row.original.sourceId} truncateLength={10} />
    ),
  },
  {
    id: "transactionDate",
    meta: { label: "TANGGAL" },
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
    meta: { label: "TIPE" },
    accessorFn: (row) =>
      row.type === "in"
        ? "Pemasukan"
        : row.type === "out"
          ? "Pengeluaran"
          : row.type === "reversal"
            ? "Reversal"
            : "-",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TIPE" />
    ),
    cell: ({ row }) => {
      return row.original.type === "in" ? (
        <span className="text-green-500">Pemasukan</span>
      ) : row.original.type === "out" ? (
        <span className="text-red-500">Pengeluaran</span>
      ) : row.original.type === "reversal" ? (
        <span className="text-blue-500">Reversal</span>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    accessorKey: "productCategory",
    meta: { label: "KATEGORI PRODUK" },
    header: () => <span>KATEGORI PRODUK</span>,
  },
  {
    accessorKey: "product",
    meta: { label: "PRODUK" },
    header: () => <span>PRODUK</span>,
  },
  {
    id: "transactionType",
    meta: { label: "TIPE TRANSAKSI" },
    accessorFn: (row) => {
      const option = INVENTORY_TRANSACTION_TYPE_OPTIONS.find(
        (opt) => opt.value === row.transactionType,
      );
      return option ? option.label : row.transactionType || "-";
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="TIPE TRANSAKSI"
      />
    ),
    cell: ({ row }) => {
      const transactionType = row.original.transactionType;
      const option = INVENTORY_TRANSACTION_TYPE_OPTIONS.find(
        (opt) => opt.value === transactionType,
      );
      return <div>{option ? option.label : transactionType || "-"}</div>;
    },
  },
  {
    id: "quantity",
    meta: { label: "JUMLAH" },
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
    meta: { label: "HARGA/UNIT" },
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
    meta: { label: "UNIT" },
    header: () => <span>UNIT</span>,
  },
  {
    id: "totalPrice",
    meta: { label: "TOTAL HARGA" },
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
    id: "reversalSource",
    meta: { label: "REVERSAL" },
    accessorFn: (row) => {
      const item = row as any;
      if (item.type === "reversal") {
        return (
          item.reversalSourceLabel || item.referenceTransactionSourceId || "-"
        );
      }
      return item.reversedBySourceId ? "Direversal" : "-";
    },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="REVERSAL" />
    ),
    cell: ({ row }) => {
      const item = row.original as any;

      if (item.type === "reversal") {
        return (
          <div className="flex flex-col space-y-0.5">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Dari data
            </Badge>
            {item.reversalSourceLabel ? (
              <ButtonCopy
                textToCopy={item.reversalSourceId || item.reversalSourceLabel}
                truncateLength={5}
              />
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        );
      }

      if (item.reversedBySourceId) {
        return (
          <Badge variant="outline" className="text-orange-700 border-orange-200">
            Direversal
          </Badge>
        );
      }

      return <span className="text-muted-foreground">-</span>;
    },
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      return <NonInventoryActions row={row.original} />;
    },
  },
];
