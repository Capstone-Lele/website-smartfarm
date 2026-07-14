"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import EditDiseaseModal from "./edit";
import DetailDiseaseSheet from "./detail";
import { useDeleteDisease } from "@/lib/api/service/master-data/disease/useDisease";
import { toast } from "sonner";
import { Disease } from "@/types/master-data/disease.types";
import ButtonSwitchColumn from "@/components/button-column/button-switch-column";

export const columnsDisease: ColumnDef<Disease>[] = [
  {
    accessorKey: "name",
    meta: { label: "NAMA" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NAMA" />
    ),
  },
  {
    accessorKey: "description",
    meta: { label: "DESKRIPSI" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DESKRIPSI" />
    ),
    cell: ({ row }) => {
      const desc = row.original.description || "-";
      return (
        <div className="max-w-[300px]">
          {desc.length > 50 ? `${desc.substring(0, 50)}...` : desc}
        </div>
      );
    }
  },
  {
    id: "isActive",
    meta: { label: "STATUS" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const deleteDiseaseMutation = useDeleteDisease();

      const handleCheckedChange = async () => {
        try {
          const res = await deleteDiseaseMutation.mutateAsync(row.original.id);
          toast.success(
            `Penyakit ${row.original.name} berhasil ${row.original.deletedAt ? "diaktifkan" : "dinonaktifkan"}`
          );
        } catch (error) {
          toast.error("Gagal mengubah status penyakit", {
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
            isLoading={deleteDiseaseMutation.isPending}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center text-primary gap-0.5">
          <DetailDiseaseSheet disease={row.original} />
          <EditDiseaseModal disease={row.original} />
        </div>
      );
    },
  },
];
