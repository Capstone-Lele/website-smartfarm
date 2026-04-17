"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LuTrash } from "react-icons/lu";
import PopupConfirmation from "@/components/popup-confimation";
import { toast } from "sonner";
import { ImagePopup } from "@/components/image-popup";
import { User } from "@/types/user.types";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABEL } from "@/lib/constants/role";
import EditUserModal from "./edit";
import { useDeleteUser } from "@/lib/api/service/users/useUser";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDeleteColumn from "@/components/button-column/button-delete-column";

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
      const deleteUserMutation = useDeleteUser();

      const handleDeleteUser = async (id: string) => {
        try {
          const res = await deleteUserMutation.mutateAsync(id);
          toast.success(res.message || "User berhasil dihapus");
        } catch (error: any) {
          toast.error("Gagal menghapus user", {
            description: error?.message || "Silakan coba lagi.",
          });
        }
      };

      return (
        <div className="flex items-center text-primary gap-0.5">
          <EditUserModal user={row.original} />
          <Separator orientation="vertical" className="h-6" />
          <PopupConfirmation
            title="Hapus User"
            message={`Apakah anda yakin menghapus user ( ${row.original.name} ) ini?`}
            type="error"
            onConfirm={() => handleDeleteUser(row.original.id)}
            isLoading={deleteUserMutation.isPending}
          >
            <ButtonDeleteColumn />
          </PopupConfirmation>
        </div>
      );
    },
  },
];
