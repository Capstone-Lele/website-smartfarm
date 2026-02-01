"use client";
import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { columns, VitaminReport } from "./column";
import DefaultCard from "@/components/card/default-card";

const dummyData: VitaminReport[] = [
  {
    id: "1",
    image: "/images/kolam.jpg",
    age: 15,
    vitaminType: "Vitamin A",
    actor: "Pak Budi",
    date: "2024-01-20",
  },
  {
    id: "2",
    image: "/images/kolam.jpg",
    age: 16,
    vitaminType: "Vitamin B",
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
