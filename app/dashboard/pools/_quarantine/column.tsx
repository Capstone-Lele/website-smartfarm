"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LuEye, LuTrash } from "react-icons/lu";
import EditPoolQuarantineModal from "./edit";
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
import { useParams } from "next/navigation";
import ButtonSwitchColumn from "@/components/button-column/button-switch-column";
import { ALL_CYCLE_CONDITIONS } from "@/lib/constants/condition";

export const columnsPoolQuarantine: ColumnDef<Pool>[] = [
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
      const category = POOLS_CATEGORY.find(
        (cat) => cat.value === row.original.category,
      );
      return (
        <Badge className="px-2" variant={"outline"}>
          {category?.label || row.original.category}
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
          (cond) => cond.value === row.original.cycle,
        );
        return condition ? (
          <Badge className="px-2" variant={"outline"}>
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
      const staff = row.original.actor;
      if (!staff || staff.length === 0) {
        return <span>-</span>;
      }
      return (
        <div className="flex flex-row items-center">
          {staff &&
            staff.length > 0 &&
            staff.map((member, index) => {
              if (index < 2) {
                return (
                  <Image
                    src={
                      member.image?.startsWith("http")
                        ? member.image
                        : getAvatarUrl(member.userName || "User")
                    }
                    alt={member.userName}
                    width={30}
                    height={30}
                    key={index}
                    className={
                      "rounded-full border border-primary h-8 w-8 object-cover"
                    }
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
    accessorKey: "currentQuantity",
    header: () => <span className="">JUMLAH IKAN</span>,
  },
  {
    id: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const deletePoolMutation = useDeletePool();

      const handleCheckedChange = async () => {
        try {
          const res = await deletePoolMutation.mutateAsync(row.original.id);
          toast.success(
            `Kolam ${row.original.name} berhasil ${row.original.deletedAt ? "diaktifkan" : "dinonaktifkan"}`,
          );
        } catch (error) {
          toast.error("Gagal mengubah status kolam", {
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
            isLoading={deletePoolMutation.isPending}
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
          <ButtonDetailColumn
            href={`/dashboard/pools/quarantine?poolId=${row.original.id}&cycleId=${row.original.cycleId}`}
          />
          <Separator orientation="vertical" className="h-6" />
          <AssignPoolModal pool={row.original} />
          <Separator orientation="vertical" className="h-6" />
          <EditPoolQuarantineModal pool={row.original} />
        </div>
      );
    },
  },
];
