"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LuEye, LuTrash } from "react-icons/lu";
import PopupConfirmation from "@/components/popup-confimation";
import EditPoolModal from "./edit";
import { useDeletePool } from "@/lib/api/service/pools/usePool";
import { toast } from "sonner";
import ButtonDeleteColumn from "@/components/button-column/button-delete-column";
import Link from "next/link";
import { Pool } from "@/types/pool.types";
import { POOLS_CATEGORY } from "@/lib/constants/category";
import { Badge } from "@/components/ui/badge";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import Image from "next/image";
import { getAvatarUrl } from "@/lib/utils/avatar";
import AssignPoolModal from "./assign";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";
import { ALL_CYCLE_CONDITIONS } from "@/lib/constants/condition";

export const columnsPool: ColumnDef<Pool>[] = [
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
      <DataTableColumnHeader className="" column={column} title="NAMA KOLAM" />
    ),
    cell: ({ row }) => {
      const { diameter } = row.original;
      return (
        <div>
          <h3 className="font-medium">{row.original.name}</h3>
          <span className="text-xs">
            {diameter ? "Kolam Bundar" : "Kolam Persegi"}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KATEGORI" />
    ),
    cell: ({ row }) => {
      return (
        <Badge className="px-2" variant={"outline"}>
          {translateCategoryPool(row.original.category)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "cycle",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KONDISI" />
    ),
    cell: ({ row }) => {
       const condition = ALL_CYCLE_CONDITIONS.find(
        (cond) => cond.value === row.original.cycle
      );
      return condition ? (
        <Badge className="px-2" variant={'outline'}>
          {condition.label}
        </Badge>
      ) : (
        <span>-</span>
      );
    },

  },
  {
    accessorKey: "petugas",
    cell: ({ row }) => {
      const staff = [
        {
          name: "John Doe",
        },
        { name: "Jane Smith" },
        { name: "Jane Smith" },
        { name: "Jane Smith" },
      ];
      return (
        <div className="flex flex-row items-center">
          {staff.length > 0 &&
            staff.map((member, index) => {
              if (index < 2) {
                return (
                  <Image
                    src={getAvatarUrl(member.name)}
                    alt={member.name}
                    width={30}
                    height={30}
                    key={index}
                    className={"rounded-full border border-primary"}
                    style={
                      index === 0
                        ? { position: "relative", zIndex: staff.length }
                        : { marginLeft: "-8px", zIndex: staff.length - index }
                    }
                  />
                );
              } else if (index < 3) {
                return (
                  <div
                    key={index}
                    className="rounded-full h-7.5 w-7.5 border bg-gray-200 flex items-center justify-center"
                    style={{ marginLeft: "-8px", zIndex: staff.length - index }}
                  >
                    +{staff.length - 2}
                  </div>
                );
              }
            })}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: () => <span className="">UKURAN (m)</span>,
    cell: ({ row }) => {
      const { length, width, height, diameter } = row.original;
      const nF = (value: any) => {
        return Number(value);
      };
      if (diameter) {
        const volumeCylinder = (
          Math.PI *
          Math.pow(nF(diameter) / 2, 2) *
          nF(height)
        ).toFixed(2);
        return (
          <div className="flex flex-col">
            <span>{`${nF(diameter)} x ${nF(height)}`}</span>
            <span>{nF(volumeCylinder)} m³</span>
          </div>
        );
      } else {
        const volumeRectangular = (nF(length) * nF(width) * nF(height)).toFixed(
          2,
        );
        return (
          <div className="flex flex-col">
            <span>{`${nF(length)} x ${nF(width)} x ${nF(height)}`}</span>
            <span>{nF(volumeRectangular)} m³</span>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "siklus",
    header: () => <span className="">SIKLUS</span>,
  },
  {
    accessorKey: "currentQuantity",
    header: ({column}) => <DataTableColumnHeader column={column} title="JUMLAH IKAN" />,
  },
  {
    accessorKey: "kematian",
    header: ({column}) => <DataTableColumnHeader column={column} title="KEMATIAN" />,
  },
  {
    accessorKey: "umur",
    header: ({column}) => <DataTableColumnHeader column={column} title="UMUR" />,
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
      const deletePoolMutation = useDeletePool();

      const handleDeletePool = async (id: string) => {
        try {
          const res = await deletePoolMutation.mutateAsync(id);
          toast.success(res.message || "Kolam berhasil dihapus");
        } catch (error: any) {
          toast.error("Gagal menghapus kolam", {
            description: error?.message || "Silakan coba lagi.",
          });
        }
      };

      return (
        <div className="flex items-center text-primary gap-0.5">
          <ButtonDetailColumn href={`/dashboard/pools/${row.original.id}/${row.original.cycleId}`} />
          <Separator orientation="vertical" className="h-6" />
          <AssignPoolModal pool={row.original} />
          <Separator orientation="vertical" className="h-6" />
          <EditPoolModal pool={row.original} />
          <Separator orientation="vertical" className="h-6" />
          <PopupConfirmation
            title="Hapus Kolam"
            message={`Apakah anda yakin menghapus kolam ( ${row.original.name} ) ini?`}
            type="error"
            onConfirm={() => handleDeletePool(row.original.id)}
            isLoading={deletePoolMutation.isPending}
          >
            <ButtonDeleteColumn />
          </PopupConfirmation>
        </div>
      );
    },
  },
];
