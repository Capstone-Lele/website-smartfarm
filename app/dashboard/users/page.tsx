"use client";
import { DataTable } from "@/components/data-table/data-table";
import { useUnit } from "@/lib/api/service/master-data/unit/useUnit";
import React, { useEffect } from "react";
import { columnsUser } from "./column";
import PostUnitModal from "./post";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { useGetProducts } from "@/lib/api/service/master-data/product/useProduct";
import PostProductModal from "./post";
import { useGetUsers } from "@/lib/api/service/users/useUser";

const page = () => {
  const { data, isLoading, error } = useGetUsers();

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
        {isLoading ? (
          <TableSkeleton columns={6} rows={8} />
        ) : (
          <div>
            <div className="flex justify-end">
              <PostProductModal />
            </div>
            <DataTable
              columns={columnsUser}
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
