import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { formatDate } from "@/lib/utils/format-date";
import { Commodity } from "@/types/comodity";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Commodity>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
    cell: ({ row }) => formatDate(row.original.date),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TIPE" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            type === "in"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {type === "in" ? "Masuk" : "Keluar"}
        </div>
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
      <DataTableColumnHeader
        className=""
        column={column}
        title="TOTAL STOK (ekor)"
      />
    ),
  },
  {
    accessorKey: "soldQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="STOK TERJUAL (ekor)"
      />
    ),
    cell: ({ row }) => row.original.soldQuantity ?? "-",
  },
  {
    accessorKey: "currentStock",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="STOK SAAT INI (ekor)"
      />
    ),
    cell: ({ row }) => {
      const currentStock =
        Number(row.original.quantity) -
        (Number(row.original.soldQuantity) || 0);
      return currentStock;
    },
  },
  {
    id: "actions",
    header: () => <span>ACTION</span>,
    cell: ({ row }) => (
      <div className="flex items-center text-primary gap-0.5">
        <ButtonDetailColumn href={`/dashboard/commodity/${row.original.id}`} />
      </div>
    ),
  },
];
