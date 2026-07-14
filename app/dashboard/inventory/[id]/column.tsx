import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { InventoryDetail } from "@/types/inventory";
import { ColumnDef } from "@tanstack/react-table";
import {
  INVENTORY_TRANSACTION_TYPE_OPTIONS,
  INVENTORY_TYPE_OPTIONS,
} from "@/lib/constants/type-inventory";
import { formatDate } from "@/lib/utils/format-date";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { useParams } from "next/navigation";
import { ButtonCopy } from "@/components/button-copy";
import { formatNumber } from "@/lib/utils/format-number";
import { Badge } from "@/components/ui/badge";

const InventoryDetailActions = ({ row }: { row: InventoryDetail }) => {
  const { id } = useParams();

  return (
    <div className="flex items-center text-primary gap-0.5">
      <ButtonDetailColumn
        href={`/dashboard/inventory/${id}/detail/?inventoryId=${row.id}&&source=${row.source == "inventory-notes" && row.type == "out" ? "inventory-notes-out" : row.source}`}
      />
    </div>
  );
};

export const columns: ColumnDef<InventoryDetail>[] = [
  {
    accessorKey: "id",
    meta: { label: "ID CATATAN" },
    header: () => <span>ID CATATAN</span>,
    cell: ({ row }) => (
      <ButtonCopy textToCopy={row.original.id} truncateLength={10} />
    ),
  },
  {
    id: "reportDate",
    meta: { label: "TANGGAL" },
    accessorFn: (row) => formatDate(row.reportDate),
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
    cell: ({ row }) => {
      return row.getValue("reportDate");
    },
  },
  {
    accessorKey: "notes",
    meta: { label: "NOTES" },
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
    id: "type",
    meta: { label: "TIPE" },
    accessorFn: (row) => {
      const option = INVENTORY_TYPE_OPTIONS.find(
        (opt) => opt.value === row.type,
      );
      return option ? option.label : row.type || "-";
    },
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
              ? "text-green-600 "
              : type === "out"
                ? "text-destructive "
                : type === "reversal"
                  ? "text-blue-600 "
                  : ""
          }`}
        >
          {option ? option.label : type || "-"}
        </span>
      );
    },
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
    accessorKey: "category",
    meta: { label: "DARI" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DARI" />
    ),
  },
  {
    id: "quantity",
    meta: { label: "KUANTITAS" },
    accessorFn: (row) => formatNumber(row.quantity).toString(),
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KUANTITAS" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <span>{formatNumber(row.original.quantity)}</span>
          <p className="font-medium">
            {row.original.unit ? row.original.unit : "-"}
          </p>
        </div>
      );
    },
  },
  {
    id: "pricePerItem",
    meta: { label: "HARGA PER ITEM" },
    accessorFn: (row) => {
      if (row.transactionType === "grant") {
        const val =
          row.pricePerItem !== null
            ? formatRupiah(Number(row.pricePerItem))
            : formatRupiah(0);
        return `${val} (perkiraan)`;
      }
      return row.pricePerItem !== null
        ? formatRupiah(Number(row.pricePerItem))
        : "-";
    },
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
          <div className="flex flex-col">
            {formatRupiah(
              row.original.pricePerItem ? Number(row.original.pricePerItem) : 0,
            )}
            <span className="text-xs text-muted-foreground mt-0.5">
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
          <Badge
            variant="outline"
            className="text-orange-700 border-orange-200"
          >
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
      return <InventoryDetailActions row={row.original} />;
    },
  },
];
