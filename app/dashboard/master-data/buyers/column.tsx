"use client";

import ButtonDeleteColumn from "@/components/button-column/button-delete-column";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { useDeleteBuyer } from "@/lib/api/service/master-data/buyer/useBuyer";
import { formatDate } from "@/lib/utils/format-date";
import { Buyer } from "@/types/master-data/buyer.types";
import { ColumnDef } from "@tanstack/react-table";
import PopupConfirmation from '@/components/popup-confimation';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { TYPE_BUYER } from "@/lib/constants/tye-buyer";
import EditBuyerModal from "./edit";

export const columnsBuyer: ColumnDef<Buyer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NAMA" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="JENIS" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const typeLabel = TYPE_BUYER.find((item) => item.value === type)?.label || type;
      return <span>{typeLabel}</span>;
    }
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NOMOR TELEPON" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="EMAIL" />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="ALAMAT" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DI BUAT" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DI UBAH" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.updatedAt);
    },
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => {
      const deleteBuyerMutation = useDeleteBuyer();

      const handleDeleteBuyer = async (id: string) => {
        try {
          const res = await deleteBuyerMutation.mutateAsync(id);
          toast.success(res.message || "Pembeli berhasil dihapus");
        } catch (error: any) {
          toast.error("Gagal menghapus pembeli", {
            description: error?.message || "Silakan coba lagi.",
          });
        }
      };

      return (
        <div className="flex items-center text-primary gap-0.5">
          <EditBuyerModal buyer={row.original} />
          <Separator orientation="vertical" className="h-6" />
          <PopupConfirmation
            title="Hapus Pembeli"
            message={`Apakah anda yakin menghapus pembeli ( ${row.original.name} ) ini?`}
            type="error"
            onConfirm={() => handleDeleteBuyer(row.original.id)}
            isLoading={deleteBuyerMutation.isPending}
          >
            <ButtonDeleteColumn/>
          </PopupConfirmation>
        </div>
      );
    },
  },
];
