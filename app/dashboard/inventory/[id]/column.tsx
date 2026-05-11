import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { InventoryDetail } from "@/types/inventory";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  INVENTORY_TRANSACTION_TYPE_OPTIONS,
  INVENTORY_TYPE_OPTIONS,
} from "@/lib/constants/type-inventory";
import { formatDate } from "@/lib/utils/format-date";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { use } from "react";
import { useParams } from "next/navigation";
import { ButtonCopy } from "@/components/button-copy";
import { formatNumber } from "@/lib/utils/format-number";

export const columns: ColumnDef<InventoryDetail>[] = [
  {
    accessorKey: "id",
    header: () => <span>ID CATATAN</span>,
    cell: ({ row }) => (
      <ButtonCopy textToCopy={row.original.id} truncateLength={10} />
    ),
  },
  {
    accessorKey: "reportDate",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.reportDate);
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NOTES" />
    ),
    cell: ({ row }) => {
      const notes = row.original.notes;
      // limit to 20 characters
      return (
        <div>
          {notes ? (
            <div>
              {notes.length > 20 ? `${notes.substring(0, 20)}...` : notes}
            </div>
          ) : (
            "-"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TIPE" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const option = INVENTORY_TYPE_OPTIONS.find((opt) => opt.value === type);
      return (
        <span
          className={` ${
            type === "in"
              ? "text-green-600 bg-green-100 px-2 py-1 rounded-full"
              : type === "out"
                ? "text-destructive bg-red-100 px-2 py-1 rounded-full"
                : ""
          }`}
        >
          {option ? option.label : type || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "transactionType",
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
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DARI" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KUANTITAS" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <span>{formatNumber(row.original.quantity)}</span>
          <p className="font-medium">{row.original.unit ? row.original.unit : "-"}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "pricePerItem",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="HARGA PER ITEM"
      />
    ),
    cell: ({ row }) => {
      // jika transactionType adalah grant maka tambahi text (perkiraan)
      if (row.original.transactionType === "grant") {
        return (
          <div>
            {formatRupiah(
              row.original.pricePerItem ? Number(row.original.pricePerItem) : 0,
            )}
            <span className="text-xs text-muted-foreground ml-2">
              (perkiraan)
            </span>
          </div>
        );
      }
      return row.original.pricePerItem !== null
        ? formatRupiah(Number(row.original.pricePerItem))
        : "-";
    },
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      const { id } = useParams();
      return (
        <div className="flex items-center text-primary gap-0.5">
          <ButtonDetailColumn
            href={`/dashboard/inventory/${id}/detail/?inventoryId=${row.original.id}&&source=${row.original.source}`}
          />
        </div>
      );
    },
  },
];
