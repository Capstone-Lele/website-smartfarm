"use client";
import { DataTable } from "@/components/data-table/data-table";
import React, { useState } from "react";
import { columns, DailyReport } from "./column";
import DefaultCard from "@/components/card/default-card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import ComboboxMultiple from "@/components/combobox/multibple";
import { DatePickerWithRange } from "@/components/date-picker/date-rage-picker";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RiResetRightLine } from "react-icons/ri";

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
  {
    id: "3",
    date: "2024-02-2 00:00",
    activity: "Pemberian Vitamin",
    pool: "A1-25",
    cycle: "2024-01-15",
    actor: "Riko",
    image: "",
  },
];

const dataUser = [
  { value: "2c57a1dc-7819-4bba-b344-4c8276a53af9", label: "Riko" },
  { value: "582be3e1-6a4e-4f38-aebb-470fa35c999f", label: "Andi" },
  { value: "529c76cb-c408-4c63-9d64-2d5c072d44f7", label: "Budi" },
];

const page = () => {
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const handleValueChange = (value: string[]) => {
    console.log("Selected values:", value);
  };

  const formReset = () => {
    // Reset form fields here
  };
  return (
    <div className="flex flex-col gap-4">
      <DefaultCard>
        <div className=" flex flex-col gap-1">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-lg">Filter Laporan Harian</span>
            <Button
              variant="outline"
              className=" cursor-pointer flex items-center gap-2"
              type="button"
              onClick={formReset}
            >
              <RiResetRightLine />
              Reset Filter
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DatePickerWithRange
              placeholder="Pilih rentang tanggal"
              label="Tanggal"
            />
            <ComboboxMultiple
              data={dataUser}
              onValueChange={handleValueChange}
              placeholder="Pilih kolam"
              label="Kolam"
            />
            <ComboboxMultiple
              data={dataUser}
              onValueChange={handleValueChange}
              placeholder="Pilih petugas"
              label="Petugas"
            />
          </div>
        </div>
      </DefaultCard>
      <DefaultCard>
        <div className="w-full">
          <DataTable columns={columns} data={dummyData} />
        </div>
      </DefaultCard>
    </div>
  );
};

export default page;
