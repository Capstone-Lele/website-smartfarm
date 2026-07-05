"use client";
import { ColumnDef, Row } from "@tanstack/react-table";
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
import { getWaterStatus } from "@/lib/utils/read-water-status";
import { formatNumber, formatNumberFloor } from "@/lib/utils/format-number";
import { calculatePoolVolume } from "@/lib/utils/volume-pool";
import { useEffect } from "react";
import { useSocketStore } from "@/lib/store/useSocketStore";
import { IOTData } from "@/types/notes/iot";

function StatusAirCell({ row }: { row: Row<Pool> }) {
  const node = parseInt(row.original.name.replace(/\D/g, ""));
  const socket = useSocketStore((s) => s.socket);
  const data = useSocketStore((s) => s.iotData[node] ?? null);

  useEffect(() => {
    if (!socket) return;
    console.log(
      `[WS] join-pool emit → nodeId: "${node}" (pool: "${row.original.name}")`,
    );
    socket.emit("join-pool", { nodeId: node.toString() });
  }, [socket, node]);

  if (data === null) {
    console.log(
      `[IoT] "${row.original.name}" (node: ${node}): belum ada data dari socket`,
    );
    return <span>-</span>;
  }

  const { ph, temp } = data;

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
    console.log(
      `[IoT] "${row.original.name}" (node: ${node}): parameter kolam belum diset`,
      {
        ph,
        temp,
        acidityMin: row.original.acidityMin,
        acidityMax: row.original.acidityMax,
        acidityNormal: row.original.acidityNormal,
        temperatureMin: row.original.temperatureMin,
        temperatureMax: row.original.temperatureMax,
        temperatureNormal: row.original.temperatureNormal,
      },
    );
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
}

export const columnsPool: ColumnDef<Pool>[] = [
  {
    id: "Nama Kolam",
    meta: { label: "NAMA KOLAM" },
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
    id: "category",
    meta: { label: "KATEGORI" },
    accessorFn: (row) => translateCategoryPool(row.category),
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KATEGORI" />
    ),
    cell: ({ row }) => {
      return (
        <Badge className="px-2" variant={"outline"}>
          {row.getValue("category")}
        </Badge>
      );
    },
  },
  {
    id: "cycle",
    meta: { label: "KONDISI" },
    accessorFn: (row) => {
      const condition = ALL_CYCLE_CONDITIONS.find(
        (cond) => cond.value === row.cycle,
      );
      return condition ? condition.label : "-";
    },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KONDISI" />
    ),
    cell: ({ row }) => {
      const val = row.getValue("cycle") as string;
      return val !== "-" ? (
        <Badge className="px-2" variant={"outline"}>
          {val}
        </Badge>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    accessorKey: "petugas",
    meta: { label: "PETUGAS" },
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
    meta: { label: "UKURAN (m)" },
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
    meta: { label: "SIKLUS" },
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
    meta: { label: "JUMLAH IKAN" },
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
    meta: { label: "KEPADATAN" },
    accessorFn: (row) => {
      const quantity = row.currentQuantity;
      const { length, width, height, diameter } = row;

      if (quantity === null || quantity === undefined || !height) {
        return "-";
      }

      const volume = calculatePoolVolume({ height, diameter, length, width });

      if (volume <= 0) return "-";

      const batasKepadatan = volume * 250;
      return quantity <= batasKepadatan ? "Aman" : "Overload";
    },
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
      const batasKepadatan = volume * 250;
      const val = row.getValue("density") as string;
      const isAman = val === "Aman";

      return (
        <div className="flex flex-col gap-1.5">
          <div
            className={`w-fit px-2 py-0.5 rounded text-xs font-medium border ${
              isAman
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            {val}
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
    meta: { label: "KEMATIAN" },
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
    meta: { label: "PINDAH KOLAM" },
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
    meta: { label: "UMUR SIKLUS" },
    accessorFn: (row) => {
      const { cycleStartDate, cycleEndDate } = row;

      if (!cycleStartDate) {
        return "-";
      }

      const start = new Date(cycleStartDate);
      start.setHours(0, 0, 0, 0);

      const end = cycleEndDate ? new Date(cycleEndDate) : new Date();
      end.setHours(0, 0, 0, 0);

      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return `${diffDays >= 0 ? diffDays : 0} hari`;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UMUR SIKLUS" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue("umur")}</span>;
    },
  },
  {
    accessorKey: "status_air",
    meta: { label: "STATUS AIR" },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="STATUS AIR" />
    ),
    cell: ({ row }) => <StatusAirCell row={row} />,
  },
  {
    id: "isActive",
    meta: { label: "STATUS" },
    accessorFn: (row) => (row.deletedAt === null ? "Aktif" : "Nonaktif"),
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

      const val = row.getValue("isActive") as string;
      const isActive = val === "Aktif";
      return (
        <div>
          <ButtonSwitchColumn
            isActive={isActive}
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
