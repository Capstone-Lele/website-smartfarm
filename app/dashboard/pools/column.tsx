"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LuEye, LuTrash } from "react-icons/lu";
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
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";
import { ALL_CYCLE_CONDITIONS } from "@/lib/constants/condition";
import { formatDate } from "@/lib/utils/format-date";
import ButtonSwitchColumn from "@/components/button-column/button-switch-column";
import { useIotLiveByNode } from "@/lib/api/service/iot/useIot";
import { getWaterStatus } from "@/lib/utils/read-water-status";
import { formatNumber, formatNumberFloor } from "@/lib/utils/format-number";
import { calculatePoolVolume } from "@/lib/utils/volume-pool";

export const columnsPool: ColumnDef<Pool>[] = [
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
      
      const volume = calculatePoolVolume({ height, diameter, length, width });

      if (diameter) {
        return (
          <div className="flex flex-col">
            <span>{`${nF(diameter)} x ${nF(height)}`}</span>
            <span>{volume.toFixed(2)} m³</span>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col">
            <span>{`${nF(length)} x ${nF(width)} x ${nF(height)}`}</span>
            <span>{volume.toFixed(2)} m³</span>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "cycleStartDate",
    header: () => <span className="">SIKLUS</span>,
    cell: ({ row }) => {
      if (!row.original.cycleStartDate) {
        return <span>-</span>;
      }
      return formatDate(row.original.cycleStartDate);
    },
  },
  {
    accessorKey: "currentQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="JUMLAH IKAN" />
    ),
    cell: ({ row }) => {
      const quantity = row.original.currentQuantity;
      return quantity !== null && quantity !== undefined ? (
        <div>
          <div>{quantity}</div>
          <div className="font-medium">ekor</div>
        </div>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    id: "density",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="KEPADATAN" />
    ),
    cell: ({ row }) => {
      const quantity = row.original.currentQuantity;
      const { length, width, height, diameter } = row.original;

      if (quantity === null || quantity === undefined || !height) {
        return <span>-</span>;
      }

      const volume = calculatePoolVolume({ height, diameter, length, width });

      if (volume <= 0) return <span>-</span>;

      const batasKepadatan = volume * 250; // Batas kepadatan berdasarkan volume
      const isAman = quantity <= batasKepadatan;

      return (
        <div className="flex flex-col gap-1.5">
          <div
            className={`w-fit px-2 py-0.5 rounded text-xs font-medium border ${
              isAman
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            {isAman ? "Aman" : "Overload"}
          </div>
          <span>
            {formatNumberFloor(batasKepadatan)} / {formatNumberFloor(quantity)}{" "}
            ekor
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "mortality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="KEMATIAN" />
    ),
    cell: ({ row }) => {
      const mortality = row.original.mortality;
      return mortality !== null && mortality !== undefined ? (
        <div>
          <div>{mortality}</div>
          <div className="font-medium">ekor</div>
        </div>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    accessorKey: "movedQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PINDAH KOLAM" />
    ),
    cell: ({ row }) => {
      const moved = row.original.movedQuantity;
      return moved !== null && moved !== undefined ? (
        <div>
          <div>{moved}</div>
          <div className="font-medium">ekor</div>
        </div>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    id: "umur",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UMUR SIKLUS" />
    ),
    cell: ({ row }) => {
      const { cycleStartDate, cycleEndDate } = row.original;

      if (!cycleStartDate) {
        return <span>-</span>;
      }

      const start = new Date(cycleStartDate);
      start.setHours(0, 0, 0, 0);

      const end = cycleEndDate ? new Date(cycleEndDate) : new Date();
      end.setHours(0, 0, 0, 0);

      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return <span>{diffDays >= 0 ? diffDays : 0} hari</span>;
    },
  },
  {
    accessorKey: "status_air",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="STATUS AIR" />
    ),
    cell: ({ row }) => {
      // node berasal dari nama kolam, misal "Kolam 1" -> node_id = 1
      const node = parseInt(row.original.name.replace(/\D/g, ""));
      const { data: iotData } = useIotLiveByNode(node.toString());
      const ph = iotData?.ph;
      const temp = iotData?.temp;

      if (
        ph === undefined ||
        temp === undefined ||
        row.original.acidityMin === null ||
        row.original.acidityMax === null ||
        row.original.acidityNormal === null ||
        row.original.temperatureMin === null ||
        row.original.temperatureMax === null ||
        row.original.temperatureNormal === null
      ) {
        return <span>-</span>;
      }

      const phStatus = getWaterStatus(
        ph,
        row.original.acidityMin,
        row.original.acidityMax,
        row.original.acidityNormal,
      );

      const tempStatus = getWaterStatus(
        temp,
        row.original.temperatureMin,
        row.original.temperatureMax,
        row.original.temperatureNormal,
      );

      const statusColors = {
        danger: "bg-red-50 text-red-600 border-red-200",
        warning: "bg-yellow-50 text-yellow-600 border-yellow-200",
        normal: "bg-green-50 text-green-600 border-green-200",
        "invalid-parameter": "bg-gray-50 text-gray-500 border-gray-200",
        unknown: "bg-gray-50 text-gray-500 border-gray-200",
      };

      return (
        <div className="flex flex-col gap-1.5 min-w-[100px]">
          <div
            className={`flex items-center justify-between px-2 py-0.5 rounded text-xs font-medium border ${statusColors[phStatus]}`}
          >
            <span>pH</span>
            <span>{ph}</span>
          </div>
          <div
            className={`flex items-center justify-between px-2 py-0.5 rounded text-xs font-medium border ${statusColors[tempStatus]}`}
          >
            <span>Suhu</span>
            <span>{temp}°C</span>
          </div>
        </div>
      );
    },
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
            href={`/dashboard/pools/${row.original.id}/${row.original.cycleId}`}
          />
          <Separator orientation="vertical" className="h-6" />
          <EditPoolModal pool={row.original} />
        </div>
      );
    },
  },
];
