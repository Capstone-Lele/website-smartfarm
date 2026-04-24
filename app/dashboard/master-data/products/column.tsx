"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LuTrash } from "react-icons/lu";
import EditProductModal from "./edit";
import { useDeleteProduct } from "@/lib/api/service/master-data/product/useProduct";
import { toast } from "sonner";
import { Product } from "@/types/master-data/product.types";
import ButtonDeleteColumn from "@/components/button-column/button-delete-column";
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import ButtonSwitchColumn from "@/components/button-column/button-switch-column";
import { useDeleteUnit } from "@/lib/api/service/master-data/unit/useUnit";

export const columnsUnit: ColumnDef<Product>[] = [
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
      <DataTableColumnHeader className="" column={column} title="UNIT" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TIPE" />
    ),
  },
  {
    id: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const deleteProductMutation = useDeleteProduct();

      const disabledProducts = ["pendanaan desa"];
      const isDisabled = disabledProducts.includes(
        row.original.name.toLowerCase(),
      );

      const handleCheckedChange = async () => {
        try {
          const res = await deleteProductMutation.mutateAsync(row.original.id);
          toast.success(`Produk ${row.original.name} berhasil ${row.original.deletedAt ? "diaktifkan" : "dinonaktifkan"}`);
        } catch (error) {
          toast.error("Gagal mengubah status produk", {
            description: "Silakan coba lagi.",
          });
        }
      };

      const isDeleted = row.original.deletedAt !== null;
      return (
        <div>
            <ButtonSwitchColumn
              isActive={!isDeleted}
              isDisabled={isDisabled}
              onCheckedChange={handleCheckedChange}
              isLoading={deleteProductMutation.isPending}
            />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      const disabledProducts = ["pendanaan desa"];
      const isDisabled = disabledProducts.includes(
        row.original.name.toLowerCase(),
      );

      return (
        <div className="flex items-center text-primary gap-0.5">
          {isDisabled ? (
            <ButtonEditColumn disabled={true} />
          ) : (
          <EditProductModal product={row.original} />
          )}
        </div>
      );
    },
  },
];
