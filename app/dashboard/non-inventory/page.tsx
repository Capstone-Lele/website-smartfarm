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
  LuUndo2,
} from "react-icons/lu";
import { DatePickerWithRange } from "@/components/date-picker/date-rage-picker";

export default function NonInventoryPage() {
  const {
    data: nonInventoryData,
    isLoading,
    isError,
  } = useFinanceNonInventory();

  const [dateRange, setDateRange] = React.useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  const filteredData = React.useMemo(() => {
    if (!nonInventoryData) return [];

    return nonInventoryData
      .filter((item) => {
        const itemDate = new Date(item.transactionDate || item.createdAt).getTime();

        if (dateRange.start && dateRange.end) {
          // Normalize start and end to beginning and end of day
          const startDay = new Date(dateRange.start);
          startDay.setHours(0, 0, 0, 0);
          
          const endDay = new Date(dateRange.end);
          endDay.setHours(23, 59, 59, 999);

          return (
            itemDate >= startDay.getTime() &&
            itemDate <= endDay.getTime()
          );
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.transactionDate || b.createdAt).getTime() - new Date(a.transactionDate || a.createdAt).getTime(),
      );
  }, [nonInventoryData, dateRange]);

  const dataWithReversalInfo = React.useMemo(() => {
    if (!filteredData) return [];
    return filteredData.map((item) => {
      const reversalSource = item.referenceTransactionSourceId
        ? nonInventoryData?.find(
            (detail) => detail.sourceId === item.referenceTransactionSourceId,
          )
        : null;
      const reversedBy = item.sourceId
        ? nonInventoryData?.find(
            (detail) =>
              detail.type === "reversal" &&
              detail.referenceTransactionSourceId === item.sourceId,
          )
        : null;

      return {
        ...item,
        reversalSourceId: reversalSource?.sourceId ?? null,
        reversalSourceLabel:
          reversalSource?.id || item.referenceTransactionSourceId || null,
        reversedBySourceId: reversedBy?.sourceId ?? null,
      };
    });
  }, [filteredData, nonInventoryData]);

  const activeData = React.useMemo(() => {
    return dataWithReversalInfo.filter(
      (item) => item.type !== "reversal" && !item.reversedBySourceId,
    );
  }, [dataWithReversalInfo]);

  const totalReversal = React.useMemo(() => {
    if (!nonInventoryData) return 0;
    return nonInventoryData.filter((item) => item.type === "reversal").length;
  }, [nonInventoryData]);

  const cardData = [
    {
      title: "Total Transaksi",
      value: activeData.length.toString() || "0",
      icon: <LuFileText />,
    },
    {
      title: "Pemasukan",
      value:
        activeData
          .filter((item) => item.type === "in")
          .length.toString() || "0",
      icon: <LuArrowDownFromLine className="text-green-500" />,
    },
    {
      title: "Pengeluaran",
      value:
        activeData
          .filter((item) => item.type === "out")
          .length.toString() || "0",
      icon: <LuArrowUpToLine className="text-red-500" />,
    },
    {
      title: "Total Reversal",
      value: totalReversal.toString(),
      icon: <LuUndo2 className="text-blue-500" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4 mt-2">
        <h1 className="text-2xl font-semibold">Keuangan Non-Inventaris</h1>
        <div className="w-full md:w-72">
          <DatePickerWithRange
            label="Pilih Rentang Waktu"
            onValueChange={(start, end) =>
              setDateRange({ start: start || null, end: end || null })
            }
          />
        </div>
      </div>
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
                data={dataWithReversalInfo}
              />
            </div>
          )}
        </div>
      </DefaultCard>
    </div>
  );
}
