"use client";
import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { columns, DailyReport } from "./column";
import DefaultCard from "@/components/card/default-card";

const dummyData: DailyReport[] = [
  {
    id: "1",
    date: "2024-01-19 00:00",
    activity: "Pemberian Pakan",
    pool: "A1-25",
    cycle: "2024-01-15",
    actor: "Riko",
    image: "",
  },
  {
    id: "2",
    date: "2024-01-18 00:00",
    activity: "Pemberian Vitamin",
    pool: "A1-25",
    cycle: "2024-01-15",
    actor: "Riko",
    image: "",
  },
];

const page = () => {
  return (
    <>
      <DefaultCard>
        <div className="w-full">
          <div>
            <DataTable columns={columns} data={dummyData} />
          </div>
        </div>
      </DefaultCard>
    </>
  );
};

export default page;
