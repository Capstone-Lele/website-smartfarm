"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { FinanceInventorySubmission } from "@/types/finance/finance-inventory-submission";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { ButtonCopy } from "@/components/button-copy";
import { sourceLabelTranslation } from "@/lib/constants/type-finance";

export const inventorySubmissionColumns: ColumnDef<FinanceInventorySubmission>[] =
  [
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
      cell: ({ row }) => {
        return sourceLabelTranslation(row.original.transactionSource);
      },
    },
    {
      accessorKey: "applicant",
      header: () => <span>PENGAJU</span>,
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
      accessorKey: "notes",
      header: ({ column }) => (
        <DataTableColumnHeader className="" column={column} title="CATATAN" />
      ),
      cell: ({ row }) =>
        row.original.notes.length > 50
          ? `${row.original.notes.substring(0, 50)}...`
          : row.original.notes,
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
        <DataTableColumnHeader
          className=""
          column={column}
          title="TOTAL HARGA"
        />
      ),
      cell: ({ row }) => {
        return formatRupiah(row.original.totalPrice ?? 0);
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
              href={`/dashboard/finance/${row.original.sourceId}?type=inventory_submissions`}
            />
          </div>
        );
      },
    },
  ];
