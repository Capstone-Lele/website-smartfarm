"use client";
import { columnsData, paymentsData } from "@/components/data-table/column";
import { DataTable } from "@/components/data-table/data-table";
import { useCategory } from "@/lib/api/service/master-data/category/useCategory";
import React, { useEffect } from "react";
import { columnsCategory } from "./column";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import DefaultCard from "@/components/card/default-card";

const page = () => {
  const exampleFilter = [
    {
      column: "status",
      option: [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
      ],
    },
  ];

  const { data, isLoading, error } = useCategory();

  useEffect(() => {
    if (data) {
      console.log("Category Data:", data);
    }
    if (error) {
      console.error("Error fetching categories:", error);
    }
  }, [data, error]);

  return (
    <DefaultCard>
      <div className="w-full">
        {isLoading ? (
          <TableSkeleton columns={6} rows={8} />
        ) : (
          <DataTable
            columns={columnsCategory}
            data={data?.data || []}
            // facetedFilter={exampleFilter}
          />
        )}
      </div>
    </DefaultCard>
  );
};

export default page;
