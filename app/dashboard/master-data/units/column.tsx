"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LuTrash } from "react-icons/lu";
import EditUnitModal from "./edit";
import { useDeleteUnit } from "@/lib/api/service/master-data/unit/useUnit";
import { toast } from "sonner";
import ButtonDeleteColumn from "@/components/button-column/button-delete-column";
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import { Unit } from "@/types/master-data/unit.types";
import ButtonSwitchColumn from "@/components/button-column/button-switch-column";
import { Spinner } from "@/components/ui/spinner";

export const columnsUnit: ColumnDef<Unit>[] = [
  {
    accessorKey: "name",
    meta: { label: "NAMA" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NAMA" />
    ),
  },
  {
    id: "isActive",
    meta: { label: "STATUS" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const deleteUnitMutation = useDeleteUnit();

      const disabledUnits = ["liter", "kg", "meter", "ml", "uang"];
      const isDisabled = disabledUnits.includes(
        row.original.name.toLowerCase(),
      );

      const handleCheckedChange = async () => {
        try {
          const res = await deleteUnitMutation.mutateAsync(row.original.id);
          toast.success(`Satuan ${row.original.name} berhasil ${row.original.deletedAt ? "diaktifkan" : "dinonaktifkan"}`);
        } catch (error) {
          toast.error("Gagal mengubah status satuan", {
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
              isLoading={deleteUnitMutation.isPending}
            />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {

      const disabledUnits = ["liter", "kg", "meter", "ml", "uang"];
      const isDisabled = disabledUnits.includes(
        row.original.name.toLowerCase(),
      );

      return (
        <div className="flex items-center text-primary gap-0.5">
          {isDisabled ? (
            <ButtonEditColumn disabled={true} />
          ) : (
            <EditUnitModal unit={row.original} />
          )}
        </div>
      );
    },
  },
];
