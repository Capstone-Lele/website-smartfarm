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
    header: () => <span>GAMBAR</span>,
    cell: ({ row }) => (
      <ImagePopup imageUrl={row.original.image || "/placeholder-image.png"} />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NAMA" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="EMAIL" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="ROLE" />
    ),
    cell: ({ row }) => {
      const role = ROLE_LABEL.find((r) => r.value === row.original.role);
      return (
        <Badge className="px-2" variant={"outline"}>
          {role?.label || row.original.role}
        </Badge>
      );
    },
  },
  {
    id: "jumlah_akses",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="JUMLAH AKSES" />
    ),
    cell: ({ row }) => {
      const data = row.original.permission?.length || 0;
      return <span>{data}</span>;
    }
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
    id: "isActive",
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
