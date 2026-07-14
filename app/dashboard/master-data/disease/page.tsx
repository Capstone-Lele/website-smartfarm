"use client";
import { DataTable } from "@/components/data-table/data-table";
import { useDisease } from "@/lib/api/service/master-data/disease/useDisease";
import React, { useEffect } from "react";
import { columnsDisease } from "./column";
import PostDiseaseModal from "./post";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import DefaultCard from "@/components/card/default-card";

const DiseasePage = () => {
  const { data, isLoading, error } = useDisease();

  useEffect(() => {
    if (error) {
      console.error("Error fetching diseases:", error);
    }
  }, [data, error]);

  return (
    <>
      <DefaultCard>
        <div className="w-full">
          {isLoading ? (
            <TableSkeleton columns={6} rows={8} />
          ) : (
            <div>
              <div className="flex justify-end mb-4">
                <PostDiseaseModal />
              </div>
              <DataTable
                columns={columnsDisease}
                data={data?.data || []}
              />
            </div>
          )}
        </div>
      </DefaultCard>
    </>
  );
};

export default DiseasePage;
