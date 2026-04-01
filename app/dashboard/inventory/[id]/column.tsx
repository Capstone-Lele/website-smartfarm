import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { InventoryDetail } from "@/types/inventory";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { INVENTORY_TRANSACTION_TYPE_OPTIONS, INVENTORY_TYPE_OPTIONS } from "@/lib/constants/type-inventory";
import { formatDate } from "@/lib/utils/format-date";

export const columns: ColumnDef<InventoryDetail>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NOTES" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TIPE" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
         const option = INVENTORY_TYPE_OPTIONS.find(
        (opt) => opt.value === type,
      );
      return (
        <span
          className={`font-medium ${
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
      <DataTableColumnHeader className="" column={column} title="SUMBER DANA" />
    ),
    cell: ({ row }) => {
      const transactionType = row.original.transactionType;
      const option = INVENTORY_TRANSACTION_TYPE_OPTIONS.find(
        (opt) => opt.value === transactionType,
      );
      return (
        <Badge variant="outline">
          {option ? option.label : transactionType || "-"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KATEGORI" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KUANTITAS (KG)" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const quantity = row.original.quantity;
      
      return (
        <span
          className={`font-semibold ${
            type === "in" ? "text-green-500" : type === "out" ? "text-destructive" : ""
          }`}
        >
          {quantity}
        </span>
      );
    },
  },
];
