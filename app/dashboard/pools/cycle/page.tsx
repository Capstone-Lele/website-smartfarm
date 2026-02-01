"use client";
import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { columnsCycle } from "./column";
import DefaultCard from "@/components/card/default-card";
import { cycles } from "@/lib/constants/dummy-respoonse/cycle";

const page = () => {
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
