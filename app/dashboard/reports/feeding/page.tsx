"use client";
import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { columns, FeedingReport } from "./column";
import DefaultCard from "@/components/card/default-card";

const dummyData: FeedingReport[] = [
  {
    id: "1",
    image: "/images/kolam.jpg",
    age: 15,
    feedWeight: 20.5,
    feedType: "Pelet A",
    actor: "Pak Budi",
    date: "2024-01-20",
  },
  {
    id: "2",
    image: "/images/kolam.jpg",
    age: 16,
    feedWeight: 21.0,
    feedType: "Pelet B",
    actor: "Pak Budi",
    date: "2024-01-21",
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
