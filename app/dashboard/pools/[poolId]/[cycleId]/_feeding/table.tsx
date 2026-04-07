"use client";

import { SimpleDataTable } from "@/components/data-table/simple-data-table";
import { ImagePopup } from "@/components/image-popup";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { useListFeedWithParams } from "@/lib/api/service/notes/feed/useFeed";
import { formatDate } from "@/lib/utils/format-date";
import { Feed } from "@/types/notes/feed.types";
import { ColumnDef } from "@tanstack/react-table";

const FeedingTable = ({
  cycleId,
  cycleStartDate,
}: {
  cycleId: string;
  cycleStartDate: string;
}) => {
  const { data, isLoading } = useListFeedWithParams({ cycleId });

  const columns: ColumnDef<Feed>[] = [
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
        const startDate = new Date(cycleStartDate);
        const ageInDays = Math.floor(
          (reportDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        return ageInDays >= 0 ? ageInDays : "-";
      },
    },
    {
      accessorKey: "foodName",
      header: "NAMA PAKAN",
    },
    {
      accessorKey: "quantity",
      header: "JUMLAH",
      cell: ({ row }) =>
        `${row.original.quantity} ${row.original.unit || ""}`.trim(),
    },
    {
      accessorKey: "type",
      header: "TIPE",
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

export default FeedingTable;
