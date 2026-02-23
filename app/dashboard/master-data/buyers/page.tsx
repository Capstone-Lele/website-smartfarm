'use client';
import DefaultCard from "@/components/card/default-card";
import { DataTable } from "@/components/data-table/data-table";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { useGetBuyers } from "@/lib/api/service/master-data/buyer/useBuyer";
import React from "react";
import { columnsBuyer } from "./column";
import PostBuyerModal from "./post";

const page = () => {
    const { data, isLoading } = useGetBuyers();

  return (
     <>
      <DefaultCard>
        <div className="w-full">
          {isLoading ? (
            <TableSkeleton columns={6} rows={8} />
          ) : (
            <div>
              <div className="flex justify-end">
                <PostBuyerModal />
              </div>
              <DataTable
                columns={columnsBuyer}
                data={data?.data || []}
                // facetedFilter={exampleFilter}
              />
            </div>
          )}
        </div>
      </DefaultCard>
    </>
  );
};

export default page;
