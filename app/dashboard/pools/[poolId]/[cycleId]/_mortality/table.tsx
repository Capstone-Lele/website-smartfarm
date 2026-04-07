"use client";

import { SimpleDataTable } from "@/components/data-table/simple-data-table";
import { ImagePopup } from "@/components/image-popup";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { useListMortalityWithParams } from "@/lib/api/service/notes/mortality/useMortality";
import { formatDate } from "@/lib/utils/format-date";
import { Mortality } from "@/types/notes/mortality";
import { ColumnDef } from "@tanstack/react-table";

const MortalityTable = ({
  cycleId,
  cycleStartDate,
}: {
  cycleId: string;
  cycleStartDate: string;
}) => {
  const { data, isLoading } = useListMortalityWithParams({ cycleId });

  const columns: ColumnDef<Mortality>[] = [
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
      cell: ({ row }) => formatDate(row.original.reportDate),
    },
    {
      id: "age",
      header: "USIA (hari)",
      cell: ({ row }) => {
        const reportDate = new Date(row.original.reportDate);
        const poolCreatedDate = new Date(cycleStartDate);
        const ageInDays = Math.floor(
          (reportDate.getTime() - poolCreatedDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        return ageInDays;
      },
    },
    {
      accessorKey: "quantity",
      header: "JUMLAH MATI (ekor)",
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

export default MortalityTable;
