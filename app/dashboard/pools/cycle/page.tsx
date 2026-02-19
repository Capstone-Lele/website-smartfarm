"use client";
import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { columnsCycle } from "./column";
import DefaultCard from "@/components/card/default-card";
import { cycles } from "@/lib/constants/dummy-respoonse/cycle";
import { useSearchParams } from "next/navigation";

const page = () => {
const poolId = useSearchParams().get("id");
  return (
    <>
      <DefaultCard>
        <div className="w-full">
          <div>
            <DataTable columns={columnsCycle} data={cycles} />
          </div>
        </div>
      </DefaultCard>
    </>
  );
};

export default page;
