"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { FinanceNonInventory } from "@/types/finance/finance-non-inventory";
import { formatRupiahTypeTransactionColumn } from "@/lib/utils/format-rupiah-type-transaction-column";
import { ButtonCopy } from "@/components/button-copy";
import { Badge } from "@/components/ui/badge";
import { INVENTORY_TRANSACTION_TYPE_OPTIONS } from "@/lib/constants/type-inventory";
import { formatRupiah } from "@/lib/utils/format-rupiah";

export const nonInventoryColumns: ColumnDef<FinanceNonInventory>[] = [
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
    header: () => <span>KATEGORI PRODUK</span>,
  },
  {
    accessorKey: "product",
    header: () => <span>PRODUK</span>,
  },
  {
    id: "transactionType",
    accessorFn: (row) => {
      const option = INVENTORY_TRANSACTION_TYPE_OPTIONS.find(
        (opt) => opt.value === row.transactionType,
      );
      return option ? option.label : row.transactionType || "-";
    },
    header: () => <span>TIPE TRANSAKSI</span>,
    cell: ({ row }) => {
      const transactionType = row.original.transactionType;
      const option = INVENTORY_TRANSACTION_TYPE_OPTIONS.find(
        (opt) => opt.value === transactionType,
      );
      return <div>{option ? option.label : transactionType || "-"}</div>;
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="CATATAN" />
    ),
    cell: ({ row }) =>
      row.original.notes.length > 20
        ? `${row.original.notes.substring(0, 20)}...`
        : row.original.notes,
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
    cell: ({ row }) => row.getValue("quantity"),
  },
  {
    accessorKey: "unit",
    header: () => <span>UNIT</span>,
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
    id: "createdAt",
    accessorFn: (row) => formatDate(row.createdAt),
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DIBUAT" />
    ),
    cell: ({ row }) => row.getValue("createdAt"),
  },
  {
    id: "reversalSource",
    accessorFn: (row) => {
      if (row.type === "reversal") {
        return (
          row.reversalSourceLabel || row.referenceTransactionSourceId || "-"
        );
      }
      return row.reversedBySourceId ? "Direversal" : "-";
    },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="REVERSAL" />
    ),
    cell: ({ row }) => {
      const item = row.original;

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
      return (
        <div className="flex items-center text-primary gap-0.5">
          <ButtonDetailColumn
            href={`/dashboard/finance/${row.original.sourceId}?type=non_inventory`}
          />
        </div>
      );
    },
  },
];
