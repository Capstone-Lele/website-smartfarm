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

export const columnsUser: ColumnDef<User>[] = [
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
    accessorKey: "image",
    cell: ({ row }) => {
      return (
        <>
          <ImagePopup imageUrl={row.original.image || "/placeholder-image.png"} />
        </>
      );
    },
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
      const role = ROLE_LABEL.find(r => r.value === row.original.role);
      return <Badge className="px-2" variant={"outline"}>{role?.label || row.original.role}</Badge>;
    }
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DI BUAT" />
    ),
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="DI UBAH" />
    ),
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
            <div className="h-8 w-8 p-0 cursor-pointer flex items-center justify-center text-red-600 hover:bg-red-100 rounded-md">
              <LuTrash />
            </div>
          </PopupConfirmation>
        </div>
      );
    },
  },
];
