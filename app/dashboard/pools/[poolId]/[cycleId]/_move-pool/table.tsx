"use client";

import { SimpleDataTable } from "@/components/data-table/simple-data-table";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { useListMoveWithParams } from "@/lib/api/service/notes/move/useMove";
import { columns } from "@/app/dashboard/reports/move/column";

const MovePoolTable = ({
  cycleId,
}: {
  cycleId: string;
}) => {
  const { data, isLoading } = useListMoveWithParams({ cycleId });

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

export default MovePoolTable;
