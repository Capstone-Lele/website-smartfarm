import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { formatDate } from "@/lib/utils/format-date";
import { InventorySubmission } from "@/types/inventory";
import { ColumnDef } from "@tanstack/react-table";
import EditSubmissionModal from "./edit";

export const columns: ColumnDef<InventorySubmission>[] = [
  {
    accessorKey: "createdAt",
    // Gunakan custom filterFn yang terdaftar di DataTable
    filterFn: "dateRange" as never,
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="PENGAJU" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const colorMap: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        cancelled: "bg-gray-200 text-gray-700",
      };
      const colorClass =
        colorMap[status?.toLowerCase()] ?? "bg-gray-200 text-gray-700";
      return (
        <span className={`${colorClass} px-2 py-0.5 rounded-xs font-medium`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="PRODUK" />
    ),
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
      <DataTableColumnHeader className="" column={column} title="JUMLAH" />
    ),
  },
  {
    accessorKey: "unit",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="SATUAN" />
    ),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NOTES" />
    ),
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center text-primary gap-0.5">
          <EditSubmissionModal submission={row.original} />
        </div>
      );
    },
  },
];
