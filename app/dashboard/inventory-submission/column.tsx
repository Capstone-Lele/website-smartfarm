import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { formatDate } from "@/lib/utils/format-date";
import { InventorySubmission } from "@/types/inventory";
import { ColumnDef } from "@tanstack/react-table";
import EditSubmissionModal from "./edit";
import { TbPencilMinus } from "react-icons/tb";

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
        <span className={`${colorClass} px-2 py-0.5 rounded-xs font-medium flex items-center w-fit capitalize`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "reviewedDate",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL DITINJAU" />
    ),
    cell: ({ row }) => {
      if( row.original.status === "pending") {
        return <span className="text-muted-foreground">-</span>;
      }
      return formatDate(row.original.updatedAt);
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
          {row.original.status === "pending" ? (
            <EditSubmissionModal submission={row.original} />
          ) : (
            <div className="flex items-center gap-2">
              <div 
                className="h-9 w-9 p-0 cursor-not-allowed opacity-50 text-black flex items-center justify-center rounded-md"
                title={`Tidak bisa diedit (telah ${row.original.status === 'approved' ? 'disetujui' : 'ditolak'})`}
              >
                <TbPencilMinus size={20} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Telah ditinjau
              </span>
            </div>
          )}
        </div>
      );
    },
  },
];
