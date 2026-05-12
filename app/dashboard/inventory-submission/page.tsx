"use client";
import useSubNavbarTab from "@/lib/hooks/useSubNavbarTab";
import React, { useEffect, useState, useMemo } from "react";
import InventoryNavTabs from "../inventory/_components/inventory-nav-tabs";
import {
  LuClipboardList,
  LuClock,
  LuCircleX,
  LuCircleCheck,
} from "react-icons/lu";
import CardStatistic from "@/components/card/card-statistic";
import DefaultCard from "@/components/card/default-card";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./column";
import { useGetInventorySubmissions } from "@/lib/api/service/inventory-submission/useInventorySubmission";
import { TableFacetedFilter } from "@/types/table-faceted-filter";
import { INVENTORY_SUBMISSION_STATUS } from "@/lib/constants/type-inventory";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { DatePickerWithRange } from "@/components/date-picker/date-rage-picker";

const tableFilter: TableFacetedFilter = [
  {
    column: "status",
    option: INVENTORY_SUBMISSION_STATUS.map((status) => ({
      label: status.label,
      value: status.value,
    })),
  },
];

const tableDateFilter = [
  {
    column: "createdAt",
    label: "Tanggal",
  },
];

const Page = () => {
  const { data, isLoading } = useGetInventorySubmissions();
  const { setTabComponent } = useSubNavbarTab();

  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    setTabComponent(<InventoryNavTabs />);
    return () => setTabComponent(null);
  }, [setTabComponent]);

  const filteredData = useMemo(() => {
    if (!data?.data) return [];

    return data.data
      .filter((item) => {
        const itemDate = new Date(item.createdAt).getTime();

        if (dateRange.start && dateRange.end) {
          return (
            itemDate >= dateRange.start.getTime() &&
            itemDate <= dateRange.end.getTime()
          );
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [data?.data, dateRange]);

  const cardData = [
    {
      title: "Total Pengajuan",
      value: filteredData.length.toString() || "0",
      icon: <LuClipboardList className="text-primary" />,
    },
    {
      title: "Pengajuan Pending",
      value:
        filteredData
          .filter((item) => item.status === "pending")
          .length.toString() || "0",
      icon: <LuClock className="text-amber-500" />,
    },
    {
      title: "Pengajuan Disetujui",
      value:
        filteredData
          .filter((item) => item.status === "approved")
          .length.toString() || "0",
      icon: <LuCircleCheck className="text-emerald-500" />,
    },
    {
      title: "Pengajuan Ditolak",
      value:
        filteredData
          .filter((item) => item.status === "rejected")
          .length.toString() || "0",
      icon: <LuCircleX className="text-red-500" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4 mt-2">
        <h1 className="text-2xl font-semibold">Pengajuan Inventaris</h1>
        <div className="w-full md:w-72">
          <DatePickerWithRange
            label="Pilih Rentang Waktu"
            onValueChange={(start, end) =>
              setDateRange({ start: start || null, end: end || null })
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {cardData.map((card, index) => (
          <CardStatistic
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
          />
        ))}
      </div>
      <DefaultCard>
        <div className="w-full">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div>
              <div className="flex justify-end">{/* <PostStockInOut /> */}</div>
              <DataTable
                columns={columns}
                data={filteredData}
                // facetedFilter={tableFilter}
                // dateFilter={tableDateFilter}
              />
            </div>
          )}
        </div>
      </DefaultCard>
    </div>
  );
};

export default Page;
