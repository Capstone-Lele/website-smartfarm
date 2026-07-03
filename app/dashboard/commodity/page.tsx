"use client";
import CardStatistic from "@/components/card/card-statistic";
import DefaultCard from "@/components/card/default-card";
import { DataTable } from "@/components/data-table/data-table";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import React, { useState, useMemo } from "react";
import { RiResetRightLine } from "react-icons/ri";
import { FaFish, FaWater } from "react-icons/fa";
import { IoFish } from "react-icons/io5";
import { LuUndo2 } from "react-icons/lu";
import { columns } from "./column";
import PostSellCommodity from "./post";
import { useCommodity } from "@/lib/api/service/commodity/useCommodity";
import { TableFacetedFilter } from "@/types/table-faceted-filter";
import { INVENTORY_TYPE_OPTIONS } from "@/lib/constants/type-inventory";
import { DatePickerWithRange } from "@/components/date-picker/date-rage-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns_out } from "./column-out";
import CommodityReportTab from "./_report-tab";
import { formatDateShort } from "@/lib/utils/format-date";

const tableFilter: TableFacetedFilter = [
  {
    column: "type",
    option: INVENTORY_TYPE_OPTIONS.map((status) => ({
      label: status.label,
      value: status.value,
    })),
  },
];

const page = () => {
  const { data, isLoading } = useCommodity();

  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [resetKey, setResetKey] = useState(0);

  const handleResetDate = () => {
    setDateRange({ start: null, end: null });
    setResetKey((prev) => prev + 1);
  };

  const filteredCommodities = useMemo(() => {
    const all = data?.data || [];
    if (!dateRange.start && !dateRange.end) return all;
    return all.filter((item) => {
      const itemDate = new Date(item.date).getTime();
      if (dateRange.start && dateRange.end) {
        return (
          itemDate >= dateRange.start.getTime() &&
          itemDate <= dateRange.end.getTime()
        );
      }
      if (dateRange.start) return itemDate >= dateRange.start.getTime();
      if (dateRange.end) return itemDate <= dateRange.end.getTime();
      return true;
    });
  }, [data, dateRange]);

  const dataWithReversalInfo = useMemo(() => {
    if (!filteredCommodities) return [];
    const all = data?.data || [];
    return filteredCommodities.map((item) => {
      const reversalSource = item.referenceSourceId
        ? all.find(
            (detail) => detail.sourceId === item.referenceSourceId,
          )
        : null;
      const reversedBy = item.sourceId
        ? all.find(
            (detail) =>
              detail.type === "reversal" &&
              detail.referenceSourceId === item.sourceId,
          )
        : null;

      return {
        ...item,
        reversalSourceId: reversalSource?.sourceId ?? null,
        reversalSourceLabel:
          reversalSource?.id || item.referenceSourceId || null,
        reversedBySourceId: reversedBy?.sourceId ?? null,
      };
    });
  }, [filteredCommodities, data]);

  const activeData = useMemo(() => {
    return dataWithReversalInfo.filter(
      (item) => item.type !== "reversal" && !item.reversedBySourceId,
    );
  }, [dataWithReversalInfo]);

  const totalReversal = useMemo(() => {
    const all = data?.data || [];
    return all.filter((item) => item.type === "reversal").length;
  }, [data]);

  const totalMasuk = activeData
    .filter((item) => item.type === "in")
    .reduce((sum, item) => sum + Number(item.quantity), 0);

  const totalKeluar = activeData
    .filter((item) => item.type === "out")
    .reduce((sum, item) => sum + Math.abs(Number(item.quantity)), 0);

  const totalStock = totalMasuk - totalKeluar;

  const cardData = [
    {
      title: "Total Stock Ikan",
      value: `${totalStock.toLocaleString("id-ID")} ekor`,
      icon: <FaWater />,
    },
    {
      title: "Ikan Keluar",
      value: `${totalKeluar.toLocaleString("id-ID")} ekor`,
      icon: <IoFish className="text-red-500" />,
    },
    {
      title: "Ikan Masuk",
      value: `${totalMasuk.toLocaleString("id-ID")} ekor`,
      icon: <FaFish className="text-emerald-500" />,
    },
    {
      title: "Total Reversal",
      value: `${totalReversal.toLocaleString("id-ID")} trx`,
      icon: <LuUndo2 className="text-blue-500" />,
    },
  ];

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4 mt-2">
        <h1 className="text-2xl font-semibold">Komoditas</h1>
        <div className="flex items-end gap-2">
          <div className="w-full md:w-72">
            <DatePickerWithRange
              label="Pilih Rentang Waktu"
              resetValues={resetKey}
              onValueChange={(start, end) =>
                setDateRange({ start: start ?? null, end: end ?? null })
              }
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleResetDate}
                  className="flex items-center justify-center self-end h-9.5 w-9.5 cursor-pointer rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
                >
                  <RiResetRightLine className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Reset tanggal</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 w-full">
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
              <div className="flex justify-end mb-4">
                <PostSellCommodity dataCommodity={data} />
              </div>
              <Tabs defaultValue="table-in" className="w-full">
                <TabsList className="mb-4 flex-wrap">
                  <TabsTrigger value="table-in">Ikan Masuk</TabsTrigger>
                  <TabsTrigger value="table-out">Ikan Keluar</TabsTrigger>
                  <TabsTrigger value="laporan">Laporan</TabsTrigger>
                </TabsList>
                <TabsContent value="table-in">
                  <div>
                    <DataTable
                      columns={columns}
                      data={dataWithReversalInfo.filter(
                        (item) => item.type === "in",
                      )}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="table-out">
                  <div>
                    <DataTable
                      columns={columns_out}
                      data={dataWithReversalInfo.filter(
                        (item) => item.type === "out" || item.type === "reversal",
                      )}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="laporan">
                  <CommodityReportTab
                    data={activeData}
                    rentang_tanggal={
                      dateRange.start && dateRange.end
                        ? `Rentang: ${formatDateShort(dateRange.start.toISOString())} - ${formatDateShort(dateRange.end.toISOString())}`
                        : ""
                    }
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DefaultCard>
    </div>
  );
};

export default page;
