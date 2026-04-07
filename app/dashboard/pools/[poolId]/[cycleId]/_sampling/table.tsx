"use client";

import { DataTable } from "@/components/data-table/data-table";
import { SimpleDataTable } from "@/components/data-table/simple-data-table";
import { ImagePopup } from "@/components/image-popup";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { useListSamplingWithParams } from "@/lib/api/service/notes/sampling/useSampling";
import { formatDate } from "@/lib/utils/format-date";
import { Sampling } from "@/types/notes/sampling.types";
import { ColumnDef } from "@tanstack/react-table";

const SamplingTable = ({
  cycleId,
  poolCreateDate,
}: {
  cycleId: string;
  poolCreateDate: string;
}) => {
  const { data, isLoading, error } = useListSamplingWithParams({
    cycleId,
  });

  console.log("Sampling data:", data);

  const columns: ColumnDef<Sampling>[] = [
    {
      accessorKey: "image",
      header: () => <span>GAMBAR</span>,
      cell: ({ row }) => (
        <ImagePopup imageUrl={row.original.image || "/placeholder-image.png"} />
      ),
    },
    {
      accessorKey: "reportDate",
      header: "TANGGAL",
      cell: ({ row }) => {
        return formatDate(row.original.reportDate);
      },
    },
    {
      id: "age",
      header: "USIA (hari)",
      cell: ({ row }) => {
        const reportDate = new Date(row.original.reportDate);
        const poolCreatedDate = new Date(poolCreateDate);
        const ageInDays = Math.floor(
          (reportDate.getTime() - poolCreatedDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        return ageInDays;
      },
    },
    {
      accessorKey: "quantity",
      header: "JUMLAH (ekor)",
    },
    {
      accessorKey: "averageWeight",
      header: "BERAT RATA-RATA (gram)",
    },
    {
      accessorKey: "user",
      header: "PETUGAS",
    },
  ];

  return (
    <div className="w-full max-h-75 overflow-auto">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <SimpleDataTable columns={columns} data={data?.data || []} />
      )}
    </div>
  );
};

export default SamplingTable;
