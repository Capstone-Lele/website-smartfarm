"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { ImagePopup } from "@/components/image-popup";
import { MovePool } from "@/types/notes/move";
import { formatDate } from "@/lib/utils/format-date";
import { Finance } from "@/types/finance/finance";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { ButtonCopy } from "@/components/button-copy";
import { sourceLabelTranslation } from "@/lib/constants/type-finance";
import { inventoryTransactionTypeTranslation } from "@/lib/constants/type-inventory";
import { usePathname } from "next/navigation";
import { formatRupiahTypeTransactionColumn } from "@/lib/utils/format-rupiah-type-transaction-column";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Finance>[] = [
  {
    accessorKey: "id",
    meta: { label: "ID TRANSAKSI" },
    header: () => <span>ID TRANSAKSI</span>,
    cell: ({ row }) => (
      <ButtonCopy textToCopy={row.original.id} truncateLength={10} />
    ),
  },
  {
    id: "transactionDate",
    meta: { label: "TANGGAL TRANSAKSI" },
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
    accessorKey: "notes",
    meta: { label: "CATATAN TRANSAKSI" },
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="CATATAN TRANSAKSI"
      />
    ),
    cell: ({ row }) =>
      // Batas panjang teks catatan transaksi yang ditampilkan di tabel
      row.original.notes.length > 20
        ? `${row.original.notes.substring(0, 20)}...`
        : row.original.notes,
  },
  {
    id: "transactionSource",
    meta: { label: "SUMBER TRANSAKSI" },
    accessorFn: (row) => sourceLabelTranslation(row.transactionSource),
    header: () => <span>SUMBER TRANSAKSI</span>,
    cell: ({ row }) => row.getValue("transactionSource"),
  },

  {
    id: "transactionType",
    meta: { label: "TIPE TRANSAKSI" },
    accessorFn: (row) =>
      inventoryTransactionTypeTranslation(row.transactionType),
    header: () => <span>TIPE TRANSAKSI</span>,
    cell: ({ row }) => row.getValue("transactionType"),
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
    id: "totalPrice",
    meta: { label: "TOTAL" },
    accessorFn: (row) => {
      const priceStr =
        row.totalPrice !== null && row.totalPrice !== undefined
          ? formatRupiahTypeTransactionColumn(
              row.totalPrice,
              row.transactionType,
            )
          : "-";
      return row.transactionType === "grant"
        ? `${priceStr} (perkiraan)`
        : priceStr;
    },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TOTAL" />
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
    meta: { label: "DIBUAT" },
    accessorFn: (row) => formatDate(row.createdAt || ""),
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DIBUAT" />
    ),
    cell: ({ row }) => row.getValue("createdAt"),
  },
  {
    id: "reversalSource",
    meta: { label: "REVERSAL" },
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
      const pathname = usePathname();
      let detailLink = "";
      if (row.original.transactionSource === "non_inventory") {
        detailLink = `${pathname}/${row.original.sourceId}?type=non_inventory`;
      } else if (row.original.transactionSource === "commodity_sales") {
        detailLink = `${pathname}/${row.original.sourceId}?type=commodity_sales`;
      } else if (row.original.transactionSource === "inventory_notes") {
        detailLink = `${pathname}/${row.original.sourceId}?type=inventory_notes`;
      } else if (row.original.transactionSource === "inventory_submissions") {
        detailLink = `${pathname}/${row.original.sourceId}?type=inventory_submissions`;
      }
      return (
        <div className="flex items-center text-primary gap-0.5">
          <ButtonDetailColumn href={detailLink} />
        </div>
      );
    },
  },
];
