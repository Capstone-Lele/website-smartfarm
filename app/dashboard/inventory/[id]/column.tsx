import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { InventoryDetail } from "@/types/inventory";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<InventoryDetail>[] = [
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader className="" column={column} title="TANGGAL" />
        ),
    },
    {
        accessorKey: "notes",
        header: ({ column }) => (
            <DataTableColumnHeader className="" column={column} title="NOTES" />
        ),
    },
    {
        accessorKey: "category",
        header: ({ column }) => (
            <DataTableColumnHeader className="" column={column} title="KATEGORI" />
        ),
    },
    {
        accessorKey: "from",
        header: ({ column }) => (
            <DataTableColumnHeader className="" column={column} title="DARI" />
        ),
    },
    {
        accessorKey: "unit",
        header: ({ column }) => (
            <DataTableColumnHeader className="" column={column} title="SATUAN" />
        ),
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => (
            <DataTableColumnHeader className="" column={column} title="KUANTITAS" />
        ),
     },
];