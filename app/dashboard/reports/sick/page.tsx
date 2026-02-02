"use client";
import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { columns, SickReport } from "./column";
import DefaultCard from "@/components/card/default-card";

const dummyData: SickReport[] = [
  {
    id: "1",
    cycle: "Siklus 2",
    sourcePool: "Kolam A",
    amount: 15,
    date: "18 Januari 2026, 14:58",
    actor: "Pak Budi",
    image: "/images/kolam.jpg",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    cycle: "Siklus 1",
    sourcePool: "Kolam B",
    amount: 10,
    date: "18 Januari 2026, 14:58",
    actor: "Pak Budi",
    image: "/images/kolam.jpg",
    createdAt: "2024-01-21",
    updatedAt: "2024-01-21",
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
