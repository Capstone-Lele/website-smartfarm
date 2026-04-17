"use client";
import useSubNavbarTab from "@/lib/hooks/useSubNavbarTab";
import React, { useEffect } from "react";
import InventoryNavTabs from "../inventory/_components/inventory-nav-tabs";
import { LuClipboardList, LuClock, LuCircleX, LuCircleCheck } from "react-icons/lu";
import CardStatistic from "@/components/card/card-statistic";
import DefaultCard from "@/components/card/default-card";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./column";
import {
  useGetInventorySubmissionById,
  useGetInventorySubmissions,
} from "@/lib/api/service/inventory-submission/useInventorySubmission";
import { TableFacetedFilter } from "@/types/table-faceted-filter";
import { INVENTORY_SUBMISSION_STATUS } from "@/lib/constants/type-inventory";

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

  useEffect(() => {
    setTabComponent(<InventoryNavTabs />);
    return () => setTabComponent(null);
  }, [setTabComponent]);

  const cardData = [
    {
      title: "Total Pengajuan",
      value: data?.data.length.toString() || "0",
      icon: <LuClipboardList className="text-primary" />,
    },
    {
      title: "Pengajuan Pending",
      value:
        data?.data
          .filter((item) => item.status === "pending")
          .length.toString() || "0",
      icon: <LuClock className="text-amber-500" />,
    },
    {
      title: "Pengajuan Disetujui",
      value:
        data?.data
          .filter((item) => item.status === "approved")
          .length.toString() || "0",
      icon: <LuCircleCheck className="text-emerald-500" />,
    },
    {
      title: "Pengajuan Ditolak",
      value:
        data?.data
          .filter((item) => item.status === "rejected")
          .length.toString() || "0",
      icon: <LuCircleX className="text-red-500" />,
    },
  ];

  return (
    <div className="space-y-4">
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
          {/* {isLoading ? (
            <TableSkeleton />
          ) : ( */}
          <div>
            <div className="flex justify-end">{/* <PostStockInOut /> */}</div>
            <DataTable
              columns={columns}
              data={data?.data || []}
              facetedFilter={tableFilter}
              dateFilter={tableDateFilter}
            />
          </div>
          {/* )} */}
        </div>
      </DefaultCard>
    </div>
  );
};

export default Page;
