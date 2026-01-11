"use client";
import { DataTable } from "@/components/data-table/data-table";
import { useKolam } from "@/lib/api/service/kolam/useKolam";
import React, { useEffect } from "react";
import { columnsKolam } from "./column";
import PostKolamModal from "./post";
import TableSkeleton from "@/components/sekeleton/table-skeleton";

const page = () => {
  const { data, isLoading, error } = useKolam();

  useEffect(() => {
    if (data) {
      console.log("Kolam Data:", data);
    }
    if (error) {
      console.error("Error fetching kolam:", error);
    }
  }, [data, error]);

  return (
    <div className="w-full p-4">
      <div className="w-full">
        {isLoading ? (
          <TableSkeleton columns={6} rows={8} />
        ) : (
          <div>
            <div className="flex justify-end">
              <PostKolamModal />
            </div>
            <DataTable
              columns={columnsKolam}
              data={data?.data || []}
              // facetedFilter={exampleFilter}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
