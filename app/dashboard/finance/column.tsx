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

export const columns: ColumnDef<Finance>[] = [
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
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="CATATAN TRANSAKSI"
      />
    ),
    cell: ({ row }) =>
      // Batas panjang teks catatan transaksi yang ditampilkan di tabel
      row.original.notes.length > 50
        ? `${row.original.notes.substring(0, 50)}...`
        : row.original.notes,
  },
  {
    accessorKey: "transactionSource",
    header: () => <span>SUMBER TRANSAKSI</span>,
    cell: ({ row }) => {
      return sourceLabelTranslation(row.original.transactionSource);
    }
  },

  {
    accessorKey: "transactionType",
    header: () => <span>TIPE TRANSAKSI</span>,
    cell: ({ row }) => {
      return inventoryTransactionTypeTranslation(row.original.transactionType);
    }
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
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TOTAL" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DIBUAT" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.createdAt || "");
    },
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      const pathname = usePathname();
      let detailLink = "";
      if(row.original.transactionSource === "non_inventory") {
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
