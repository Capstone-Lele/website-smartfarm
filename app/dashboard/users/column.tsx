"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LuTrash } from "react-icons/lu";
import { toast } from "sonner";
import { ImagePopup } from "@/components/image-popup";
import { User } from "@/types/user.types";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABEL } from "@/lib/constants/role";
import EditUserModal from "./edit";
import { useDeleteUser } from "@/lib/api/service/users/useUser";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDeleteColumn from "@/components/button-column/button-delete-column";
import ButtonSwitchColumn from "@/components/button-column/button-switch-column";

import DetailUserSheet from "./detail";

export const columnsUser: ColumnDef<User>[] = [
 
  {
    accessorKey: "image",
    meta: { label: "GAMBAR" },
    header: () => <span>GAMBAR</span>,
    cell: ({ row }) => (
      <ImagePopup imageUrl={row.original.image || "/placeholder-image.png"} />
    ),
  },
  {
    accessorKey: "name",
    meta: { label: "NAMA" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NAMA" />
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
    id: "role",
    meta: { label: "ROLE" },
    accessorFn: (row) => ROLE_LABEL.find((r) => r.value === row.role)?.label || row.role,
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="ROLE" />
    ),
    cell: ({ row }) => {
      return (
        <Badge className="px-2" variant={"outline"}>
          {row.getValue("role")}
        </Badge>
      );
    },
  },
  {
    id: "jumlah_akses", 
    meta: { label: "JUMLAH AKSES" },
    accessorFn: (row) => row.permission?.length || 0,
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="JUMLAH AKSES" />
    ),
    cell: ({ row }) => {
      return row.getValue("jumlah_akses");
    }
  },
  {
    id: "createdAt",
    meta: { label: "DI BUAT" },
    accessorFn: (row) => formatDate(row.createdAt),
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DI BUAT" />
    ),
    cell: ({ row }) => {
      return row.getValue("createdAt");
    },
  },
  {
    id: "isActive",
    meta: { label: "STATUS" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const deleteUserMutation = useDeleteUser();

      const handleCheckedChange = async () => {
        try {
          const res = await deleteUserMutation.mutateAsync(row.original.id);
          toast.success(`User ${row.original.name} berhasil ${row.original.deletedAt ? "diaktifkan" : "dinonaktifkan"}`);
        } catch (error) {
          toast.error("Gagal mengubah status user", {
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
              isLoading={deleteUserMutation.isPending}
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
          <DetailUserSheet user={row.original} />
          <EditUserModal user={row.original} />
        </div>
      );
    },
  },
];
