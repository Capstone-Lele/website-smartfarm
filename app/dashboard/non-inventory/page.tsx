"use client";

import DefaultCard from "@/components/card/default-card";
import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { nonInventoryColumns } from "./column";
import PostFinance from "./post";
import { useFinanceNonInventory } from "@/lib/api/service/finance/useFinance";
import CardStatistic from "@/components/card/card-statistic";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import {
  LuArrowDownFromLine,
  LuArrowUpToLine,
  LuFileText,
} from "react-icons/lu";

export default function NonInventoryPage() {
  const {
    data: nonInventoryData,
    isLoading,
    isError,
  } = useFinanceNonInventory();

  const cardData = [
    {
      title: "Total Transaksi",
      value: nonInventoryData?.length.toString() || "0",
      icon: <LuFileText />,
    },
    {
      title: "Pemasukan",
      value:
        nonInventoryData
          ?.filter((item) => item.type === "in")
          .length.toString() || "0",
      icon: <LuArrowDownFromLine className="text-green-500" />,
    },
    {
      title: "Pengeluaran",
      value:
        nonInventoryData
          ?.filter((item) => item.type === "out")
          .length.toString() || "0",
      icon: <LuArrowUpToLine className="text-red-500" />,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
            <TableSkeleton columns={6} rows={8} />
          ) : (
            <div>
              <div className="flex justify-end mb-4">
                <PostFinance />
              </div>
              <DataTable
                columns={nonInventoryColumns}
                data={nonInventoryData || []}
              />
            </div>
          )}
        </div>
      </DefaultCard>
    </>
  );
}
