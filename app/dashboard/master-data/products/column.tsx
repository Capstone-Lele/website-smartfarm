"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LuTrash } from "react-icons/lu";
import PopupConfirmation from "@/components/popup-confimation";
import EditProductModal from "./edit";
import { useDeleteProduct } from "@/lib/api/service/master-data/product/useProduct";
import { toast } from "sonner";
import { Product } from "@/types/master-data/product.types";
import ButtonDeleteColumn from "@/components/button-column/button-delete-column";

export const columnsUnit: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    id: "No",
    accessorKey: "No",
    header: () => <span className="">NO</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NAMA" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KATEGORI" />
    ),
  },
  {
    accessorKey: "unit",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="SATUAN" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TIPE" />
    ),
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      const deleteProductMutation = useDeleteProduct();

      const handleDeleteProduct = async (id: string) => {
        try {
          const res = await deleteProductMutation.mutateAsync(id);
          toast.success(res.message || "Produk berhasil dihapus");
        } catch (error: any) {
          toast.error("Gagal menghapus produk", {
            description: error?.message || "Silakan coba lagi.",
          });
        }
      };

      return (
        <div className="flex items-center text-primary gap-0.5">
          <EditProductModal product={row.original} />
          <Separator orientation="vertical" className="h-6" />
          <PopupConfirmation
            title="Hapus Produk"
            message={`Apakah anda yakin menghapus produk ( ${row.original.name} ) ini?`}
            type="error"
            onConfirm={() => handleDeleteProduct(row.original.id)}
            isLoading={deleteProductMutation.isPending}
          >
            <ButtonDeleteColumn/>
          </PopupConfirmation>
        </div>
      );
    },
  },
];
