"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LuTrash } from "react-icons/lu";
import PopupConfirmation from "@/components/popup-confimation";
import EditUnitModal from "./edit";
import { useDeleteUnit } from "@/lib/api/service/master-data/unit/useUnit";
import { toast } from "sonner";
import ButtonDeleteColumn from "@/components/button-column/button-delete-column";

type Unit = {
  id: string;
  name: string;
};


export const columnsUnit: ColumnDef<Unit>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NAMA" />
    ),
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      const deleteUnitMutation = useDeleteUnit();

      const handleDeleteUnit = async (id: string) => {
        try{
          const res = await deleteUnitMutation.mutateAsync(id);
          toast.success(res.message || "Satuan berhasil dihapus");
        }catch (error: any) {
          toast.error("Gagal menghapus satuan", {
            description: error?.message || "Silakan coba lagi.",
          });
        }
      }


      return (
        <div className="flex items-center text-primary gap-0.5">
          <EditUnitModal unit={row.original} />
          <Separator orientation="vertical" className="h-6" />
          <PopupConfirmation
            title="Hapus Satuan"
            message={`Apakah anda yakin menghapus satuan ( ${row.original.name} ) ini?`}
            type="error"
            onConfirm={() => handleDeleteUnit(row.original.id)}
            isLoading={deleteUnitMutation.isPending}
          >
            <ButtonDeleteColumn/>
          </PopupConfirmation>
        </div>
      );
    },
  },
];
