import ButtonDeleteColumn from "@/components/button-column/button-delete-column";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import ButtonTransactionColumn from "@/components/button-column/button-transaction-column";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Separator } from "@/components/ui/separator";
import { useDeleteInventory } from "@/lib/api/service/inventory/useInventory";
import { Inventory } from "@/types/inventory";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import EditInventoryModal from "./edit";
import ButtonSwitchColumn from "@/components/button-column/button-switch-column";
import { formatNumber } from "@/lib/utils/format-number";

export const columns: ColumnDef<Inventory>[] = [
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="PRODUK" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{row.original.product}</span>
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
    accessorKey: "totalQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TOTAL STOK" />
    ),
    cell: ({ row }) => {
      return (
        <span className="">{formatNumber(row.original.totalQuantity)}</span>
      );
    },
  },
  {
    accessorKey: "minQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="STOK MINIMUM"
      />
    ),
    cell: ({ row }) => {
      return <span className="">{formatNumber(row.original.minQuantity)}</span>;
    },
  },
  {
    accessorKey: "unit",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="SATUAN" />
    ),
  },
  {
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="STATUS STOCK"
      />
    ),
    cell: ({ row }) => {
      const totalQuantity = Number(row.original.totalQuantity);
      const minQuantity = Number(row.original.minQuantity);
      let status = "Tersedia";
      let statusClass = "text-green-600 bg-green-100";

      if (totalQuantity === 0) {
        status = "Habis";
        statusClass = "text-red-600 bg-red-100";
      } else if (totalQuantity <= minQuantity) {
        status = "Stok Rendah";
        statusClass = "text-yellow-600 bg-yellow-100";
      }

      return (
        <span className={`font-medium ${statusClass} px-2 py-1 rounded-full`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const deleteInventoryMutation = useDeleteInventory();

      const handleCheckedChange = async () => {
        try {
          const res = await deleteInventoryMutation.mutateAsync(
            row.original.id,
          );
          toast.success(
            `Inventaris ${row.original.product} berhasil ${row.original.deletedAt ? "diaktifkan" : "dinonaktifkan"}`,
          );
        } catch (error) {
          toast.error("Gagal mengubah status inventaris", {
            description: "Silakan coba lagi.",
          });
        }
      };

      const isDeleted = row.original.deletedAt !== null;
      return (
        <div>
          <ButtonSwitchColumn
            isActive={!isDeleted}
            onCheckedChange={handleCheckedChange}
            isLoading={deleteInventoryMutation.isPending}
          />
        </div>
      );
    },
  },
  {
    id: "action",
    header: () => <span>ACTION</span>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center text-primary gap-0.5">
          <ButtonTransactionColumn
            href={`/dashboard/inventory/${row.original.id}`}
          />
          <Separator orientation="vertical" className="h-6" />
          <EditInventoryModal inventory={row.original} />
        </div>
      );
    },
  },
];
