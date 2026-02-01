"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LuTrash } from "react-icons/lu";
import PopupConfirmation from "@/components/popup-confimation";
import EditKolamModal from "./edit";
import { useDeleteKolam } from "@/lib/api/service/kolam/useKolam";
import { toast } from "sonner";
import ButtonDeleteColumn from "@/components/button-column/button-delete-column";

type Kolam = {
  id: string;
  name: string;
  kategori: string;
  ukuran: string;
  kondisi: string;
  siklus: string;
  ikan: number;
  kematian: number;
  umur: string;
  status_air: string;
};

export const columnsKolam: ColumnDef<Kolam>[] = [
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
      <DataTableColumnHeader className="" column={column} title="NAMA KOLAM" />
    ),
  },
  {
    accessorKey: "kategori",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KATEGORI" />
    ),
  },
  {
    accessorKey: "ukuran",
    header: () => <span className="">UKURAN</span>,
  },
  {
    accessorKey: "kondisi",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KONDISI" />
    ),
  },
  {
    accessorKey: "siklus",
    header: () => <span className="">SIKLUS</span>,
  },
  {
    accessorKey: "ikan",
    header: () => <span className="">JUMLAH IKAN</span>,
  },
  {
    accessorKey: "kematian",
    header: () => <span className="">KEMATIAN</span>,
  },
  {
    accessorKey: "umur",
    header: () => <span className="">UMUR</span>,
  },
  {
    accessorKey: "status_air",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="STATUS AIR" />
    ),
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      const deleteKolamMutation = useDeleteKolam();

      const handleDeleteKolam = async (id: string) => {
        try {
          const res = await deleteKolamMutation.mutateAsync(id);
          toast.success(res.message || "Kolam berhasil dihapus");
        } catch (error: any) {
          toast.error("Gagal menghapus kolam", {
            description: error?.message || "Silakan coba lagi.",
          });
        }
      };

      return (
        <div className="flex items-center text-primary gap-0.5">
          <EditKolamModal kolam={row.original} />
          <Separator orientation="vertical" className="h-6" />
          <PopupConfirmation
            title="Hapus Kolam"
            message={`Apakah anda yakin menghapus kolam ( ${row.original.name} ) ini?`}
            type="error"
            onConfirm={() => handleDeleteKolam(row.original.id)}
            isLoading={deleteKolamMutation.isPending}
          >
            <ButtonDeleteColumn/>
          </PopupConfirmation>
        </div>
      );
    },
  },
];
