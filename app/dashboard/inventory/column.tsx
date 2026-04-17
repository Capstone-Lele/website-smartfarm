import ButtonDeleteColumn from "@/components/button-column/button-delete-column";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import ButtonTransactionColumn from "@/components/button-column/button-transaction-column";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import PopupConfirmation from "@/components/popup-confimation";
import { Separator } from "@/components/ui/separator";
import { useDeleteInventory } from "@/lib/api/service/inventory/useInventory";
import { Inventory } from "@/types/inventory";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import EditInventoryModal from "./edit";

export const columns: ColumnDef<Inventory>[] = [
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="PRODUK" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 hover:bg-primary-surface rounded-md px-2 py-1 w-fit cursor-pointer">
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
      <DataTableColumnHeader className="" column={column} title="STATUS" />
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
    id: "action",
    header: () => <span>ACTION</span>,
    cell: ({ row }) => {
      const deleteInventoryMutation = useDeleteInventory();

      const handleDeleteInventory = async (id: string) => {
        try {
          const res = await deleteInventoryMutation.mutateAsync(id);
          toast.success(res.message || "Inventaris berhasil dihapus");
        } catch (error: any) {
          toast.error("Gagal menghapus inventaris", {
            description: error?.message || "Silakan coba lagi.",
          });
        }
      };
      return (
        <div className="flex items-center text-primary gap-0.5">
          <ButtonTransactionColumn
            href={`/dashboard/inventory/${row.original.id}`}
          />
          <Separator orientation="vertical" className="h-6" />
          <EditInventoryModal inventory={row.original} />
          <Separator orientation="vertical" className="h-6" />
          <PopupConfirmation
            title="Hapus Inventaris"
            message={`Apakah anda yakin menghapus inventaris ( ${row.original.product} ) ini?`}
            type="error"
            onConfirm={() => handleDeleteInventory(row.original.id)}
            isLoading={deleteInventoryMutation.isPending}
          >
            <ButtonDeleteColumn />
          </PopupConfirmation>
        </div>
      );
    },
  },
];
