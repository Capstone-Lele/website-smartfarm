"use client";

import ButtonDeleteColumn from "@/components/button-column/button-delete-column";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { useDeleteBuyer } from "@/lib/api/service/master-data/buyer/useBuyer";
import { formatDate } from "@/lib/utils/format-date";
import { Buyer } from "@/types/master-data/buyer.types";
import { ColumnDef } from "@tanstack/react-table";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { TYPE_BUYER } from "@/lib/constants/tye-buyer";
import EditBuyerModal from "./edit";
import ButtonSwitchColumn from "@/components/button-column/button-switch-column";

export const columnsBuyer: ColumnDef<Buyer>[] = [
  {
    accessorKey: "name",
    meta: { label: "NAMA" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NAMA" />
    ),
  },
  {
    accessorKey: "type",
    meta: { label: "JENIS" },
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
    meta: { label: "NOMOR TELEPON" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NOMOR TELEPON" />
    ),
  },
  {
    accessorKey: "email",
    meta: { label: "EMAIL" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="EMAIL" />
    ),
  },
  {
    accessorKey: "address",
    meta: { label: "ALAMAT" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="ALAMAT" />
    ),
  },
  {
    accessorKey: "createdAt",
    meta: { label: "DI BUAT" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DI BUAT" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    },
  },
  {
    accessorKey: "updatedAt",
    meta: { label: "DI UBAH" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DI UBAH" />
    ),
    cell: ({ row }) => {
      return formatDate(row.original.updatedAt);
    },
  },
  {
    id: "isActive",
    meta: { label: "STATUS" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const deleteBuyerMutation = useDeleteBuyer();

      const handleCheckedChange = async () => {
        try {
          const res = await deleteBuyerMutation.mutateAsync(row.original.id);
          toast.success(`Pembeli ${row.original.name} berhasil ${row.original.deletedAt ? "diaktifkan" : "dinonaktifkan"}`);
        } catch (error) {
          toast.error("Gagal mengubah status pembeli", {
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
              isLoading={deleteBuyerMutation.isPending}
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
          <EditBuyerModal buyer={row.original} />
        </div>
      );
    },
  },
];
