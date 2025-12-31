"use client";
import { columnsData, paymentsData } from "@/components/data-table/column";
import { DataTable } from "@/components/data-table/data-table";
import { useCategory } from "@/lib/hooks/services/master-data/useCategory";
import React, { useEffect } from "react";
import { columnsCategory } from "./column";

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
    <div className="w-full p-4">
      <div className="w-full">
        {!isLoading && (
          <DataTable
            columns={columnsCategory}
            data={data?.data || []}
            // facetedFilter={exampleFilter}
          />
        )}
      </div>
    </div>
  );
};

export default page;
