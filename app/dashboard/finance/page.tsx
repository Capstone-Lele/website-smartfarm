"use client";
import DefaultCard from "@/components/card/default-card";
import React, { useMemo, useState } from "react";
import { columns } from "./column";
import { Finance } from "@/types/finance/finance";
import { DataTable } from "@/components/data-table/data-table";
import PostFinance from "./post";
import CashFlowChart from "./_components/cash-flow-chart";
import FinancePieCharts from "./_components/finance-pie-charts";
import TransactionCountChart from "./_components/transaction-count-chart";
import TransactionCountPie from "./_components/transaction-count-pie";
import { DatePickerWithRange } from "@/components/date-picker/date-rage-picker";
import { SelectCombobox } from "@/components/combobox/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinanceCommodityData from "./_commodity";
import FinanceInventoryData from "./_inventory";
import FinanceInventorySubmissionData from "./_inventory-submission";
import FinanceNonInventoryData from "./_non-inventory";
import FinanceStatCards from "./_stat-cards";
import FinanceReportTab from "./_report-tab";
import { useFinanceCommodity } from "@/lib/api/service/finance/useFinance";
import { useFinanceInventory } from "@/lib/api/service/finance/useFinance";
import { useFinanceInventorySubmission } from "@/lib/api/service/finance/useFinance";
import { useFinanceNonInventory } from "@/lib/api/service/finance/useFinance";
import { formatDateShort } from "@/lib/utils/format-date";

const page = () => {
  const { data: commodityData, isLoading: loadingCommodity } =
    useFinanceCommodity();
  const { data: inventoryData, isLoading: loadingInventory } =
    useFinanceInventory();
  const {
    data: inventorySubmissionData,
    isLoading: loadingInventorySubmission,
  } = useFinanceInventorySubmission();
  const { data: nonInventoryData, isLoading: loadingNonInventory } =
    useFinanceNonInventory();

  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [txTypeFilter, setTxTypeFilter] = useState<string>("all");

  const memoizedValue: Finance[] = useMemo(() => {
    const allData: Finance[] = [];

    if (commodityData) {
      commodityData.forEach((item) => {
        allData.push({
          id: item.id,
          transactionDate: item.transactionDate,
          sourceId: item.sourceId,
          type: item.type,
          transactionSource: item.transactionSource,
          transactionType: "-",
          productCategory: "-",
          product: "-",
          notes: item.notes,
          totalPrice: item.totalPrice,
          createdAt: item.createdAt,
        });
      });
    }

    if (inventoryData) {
      inventoryData.forEach((item) => {
        allData.push({
          id: item.id,
          transactionDate: item.transactionDate,
          sourceId: item.sourceId,
          type: item.type,
          transactionSource: item.transactionSource,
          productCategory: item.productCategory,
          product: item.product,
          transactionType: item.transactionType || undefined,
          notes: item.notes,
          totalPrice: item.totalPrice,
          createdAt: item.createdAt,
        });
      });
    }

    if (inventorySubmissionData) {
      inventorySubmissionData.forEach((item) => {
        allData.push({
          id: item.id,
          transactionDate: item.transactionDate,
          sourceId: item.sourceId,
          type: item.type,
          transactionSource: item.transactionSource,
          productCategory: item.productCategory,
          product: item.product,
          transactionType: item.transactionType || undefined,
          notes: item.notes,
          totalPrice: item.totalPrice,
          createdAt: item.createdAt,
        });
      });
    }

    if (nonInventoryData) {
      nonInventoryData.forEach((item) => {
        allData.push({
          id: item.id,
          transactionDate: item.transactionDate,
          sourceId: item.sourceId,
          type: item.type,
          transactionSource: "non_inventory",
          productCategory: item.productCategory,
          product: item.product,
          transactionType: item.transactionType,
          notes: item.notes,
          totalPrice: item.totalPrice || 0,
          createdAt: item.createdAt,
        });
      });
    }

    const filteredData = allData.filter((item) => {
      const itemDate = new Date(item.transactionDate).getTime();

      if (dateRange.start && dateRange.end) {
        return (
          itemDate >= dateRange.start.getTime() &&
          itemDate <= dateRange.end.getTime()
        );
      }
      return true;
    });

    return filteredData.sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime(),
    );
  }, [
    commodityData,
    inventoryData,
    inventorySubmissionData,
    nonInventoryData,
    dateRange,
  ]);

  const { totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;

    memoizedValue.forEach((item) => {
      if (item.transactionType === "grant") return;

      if (item.type === "in" || item.type === "IN") {
        income += item.totalPrice || 0;
      } else if (item.type === "out" || item.type === "OUT") {
        expense += item.totalPrice || 0;
      }
    });

    return { totalIncome: income, totalExpense: expense };
  }, [memoizedValue]);

  const chartDataFiltered = useMemo(() => {
    if (txTypeFilter === "grant") {
      return memoizedValue.filter((item) => item.transactionType === "grant");
    }
    if (txTypeFilter === "non-grant") {
      return memoizedValue.filter((item) => item.transactionType !== "grant");
    }
    return memoizedValue;
  }, [memoizedValue, txTypeFilter]);

  return (
    <div className="">
      <>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4 mt-2">
          <h1 className="text-2xl font-semibold">Keuangan</h1>
          <div className="w-full md:w-72">
            <DatePickerWithRange
              label="Pilih Rentang Waktu"
              onValueChange={(start, end) =>
                setDateRange({ start: start || null, end: end || null })
              }
            />
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4 w-full">
            <FinanceStatCards income={totalIncome} expense={totalExpense} />
          </div>
          <div className="mb-4 text-xs text-muted-foreground px-2">
            Data pada kartu statistik di atas ini akan disesuaikan dengan
            rentang waktu yang dipilih dan menggunakan tipe transakasi{" "}
            <b>Pembelian Reguler(non-grant.)</b>
          </div>
        </div>

        <Tabs defaultValue="ringkasan-grafik" className="w-full">
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="ringkasan-grafik">
              Ringkasan & Grafik
            </TabsTrigger>
            <TabsTrigger value="laporan">Laporan</TabsTrigger>
            <TabsTrigger value="semua-data">Semua Data (Ringkas)</TabsTrigger>
            <TabsTrigger value="komoditas">Komoditas</TabsTrigger>
            <TabsTrigger value="inventaris">Inventaris</TabsTrigger>
            <TabsTrigger value="pengajuan-inventaris">
              Pengajuan Inventaris
            </TabsTrigger>
            <TabsTrigger value="non-inventaris">Non Inventaris</TabsTrigger>
          </TabsList>
          <TabsContent value="ringkasan-grafik">
            <div className="flex justify-end mb-4">
              <div className="w-full md:w-64">
                <SelectCombobox
                  data={[
                    { label: "Semua Transaksi", value: "all" },
                    { label: "Reguler (Non-Grant)", value: "non-grant" },
                    { label: "Hibah (Grant)", value: "grant" },
                  ]}
                  onValueChange={setTxTypeFilter}
                  label="Filter Tipe Transaksi"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <CashFlowChart data={chartDataFiltered} />
              <FinancePieCharts data={chartDataFiltered} />
              <TransactionCountChart data={chartDataFiltered} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TransactionCountPie data={chartDataFiltered} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="laporan">
            <FinanceReportTab
              data={memoizedValue}
              rentang_tanggal={
                dateRange.start && dateRange.end
                  ? `Rentang: ${formatDateShort(dateRange.start.toISOString())} - ${formatDateShort(dateRange.end.toISOString())}`
                  : ""
              }
            />
          </TabsContent>
          <TabsContent value="semua-data">
            <DefaultCard>
              <DataTable columns={columns} data={memoizedValue} />
            </DefaultCard>
          </TabsContent>
          <TabsContent value="komoditas">
            <FinanceCommodityData />
          </TabsContent>
          <TabsContent value="inventaris">
            <FinanceInventoryData />
          </TabsContent>
          <TabsContent value="pengajuan-inventaris">
            <FinanceInventorySubmissionData />
          </TabsContent>
          <TabsContent value="non-inventaris">
            <FinanceNonInventoryData />
          </TabsContent>
        </Tabs>
      </>
    </div>
  );
};

export default page;
