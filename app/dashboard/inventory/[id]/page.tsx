"use client";
import useSubNavbarTab from "@/lib/hooks/useSubNavbarTab";
import React, { useEffect, use, useState } from "react";
import CardStatistic from "@/components/card/card-statistic";
import DefaultCard from "@/components/card/default-card";
import {
  LuPackage,
  LuCircleArrowDown,
  LuCircleArrowUp,
  LuArrowUpDown,
} from "react-icons/lu";
import {
  useGetInventoryConsumptionByIdWithParams,
  useGetInventoryNotesByIdWithParams,
  useGetInventorySubmissionByIdWithParams,
  useInventory,
} from "@/lib/api/service/inventory/useInventory";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./column";
import PostStockInOut from "./post";
import { useBreadcrumbStore } from "@/lib/store/useBreadcrumbStore";
import { InventoryDetail } from "@/types/inventory";
import { DatePickerWithRange } from "@/components/date-picker/date-rage-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryOverview } from "./_components/inventory-overview";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { setTabComponent } = useSubNavbarTab();
  const { setLabel, removeLabel } = useBreadcrumbStore();
  const [dateRange, setDateRange] = useState<{
    start: Date | null | undefined;
    end: Date | null | undefined;
  }>({ start: null, end: null });

  const { data: inventoryData } = useInventory();
  const {
    data: inventoryDetailDataNotes,
    isLoading: isLoadingInventoryDetailNotes,
  } = useGetInventoryNotesByIdWithParams(id, { inventoryType: "note" });
  const {
    data: inventoryDetailDataSubmissions,
    isLoading: isLoadingInventoryDetailSubmissions,
  } = useGetInventorySubmissionByIdWithParams(id, {
    inventoryType: "submission",
  });
  const {
    data: inventoryDetailDataConsumption,
    isLoading: isLoadingInventoryDetailConsumption,
  } = useGetInventoryConsumptionByIdWithParams(id, {
    inventoryType: "consumption",
  });

  const isLoading =
    isLoadingInventoryDetailNotes ||
    isLoadingInventoryDetailSubmissions ||
    isLoadingInventoryDetailConsumption;

  // Merge tiga sumber data menjadi satu array InventoryDetail[]
  const mergedInventoryDetails: InventoryDetail[] = [
    // 1. Notes → kategori "Inventaris", gunakan reportDate sebagai createdAt
    ...((inventoryDetailDataNotes as any)?.data ?? []).map((item: any) => ({
      id: item.id,
      notes: item.notes ?? "",
      type: item.type,
      category: "Inventaris",
      source:"inventory-notes",
      unit: "",
      quantity: item.quantity,
      pricePerItem: item.pricePerItem ?? null,
      transactionType: item.transactionType ?? "-",
      createdAt: item.reportDate ?? item.createdAt,
      updatedAt: item.updatedAt,
      deletedAt: item.deletedAt ?? null,
    })),
    // 2. Submission → kategori "Pengajuan Inventaris", type selalu "in", hanya status "approve"
    ...((inventoryDetailDataSubmissions as any)?.data ?? [])
      .filter((item: any) => item.status === "approved")
      .map((item: any) => ({
        id: item.id,
        notes: item.notes ?? "",
        type: "in" as const,
        category: "Pengajuan Inventaris",
        source:"inventory-submission",
        unit: "",
        quantity: item.quantity,
        pricePerItem: item.pricePerItem ?? null,
        transactionType: item.transaction_type ?? "-",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt ?? null,
      })),
    // 3. Consumption → kategori "Inventaris", type selalu "out", gunakan reportDate sebagai createdAt
    ...((inventoryDetailDataConsumption as any)?.data ?? []).map(
      (item: any) => ({
        id: item.id,
        notes: "",
        type: "out" as const,
        category: "Inventaris",
        source:"inventory-consumption",
        unit: "",
        quantity: item.quantity,
        pricePerItem: item.pricePerItem ?? null,
        transactionType: item.transaction_type ?? "-",
        createdAt: item.reportDate ?? item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt ?? null,
      }),
    ),
  ];

  const filteredInventoryDetails = mergedInventoryDetails.filter((item) => {
    if (!dateRange.start && !dateRange.end) return true;
    const itemDate = new Date(item.createdAt);
    if (dateRange.start && dateRange.end) {
      return itemDate >= dateRange.start && itemDate <= dateRange.end;
    }
    if (dateRange.start) return itemDate >= dateRange.start;
    if (dateRange.end) return itemDate <= dateRange.end;
    return true;
  });

  useEffect(() => {
    if (inventoryData?.data) {
      const inventory = inventoryData.data.find((item) => item.id === id);
      if (inventory?.product) {
        setLabel("inventory", inventory.product);
      }
    }
    return () => removeLabel("inventory");
  }, [inventoryData?.data, id, setLabel, removeLabel]);

  const currentInventory = inventoryData?.data?.find((item) => item.id === id);

  const totalIn = mergedInventoryDetails
    .filter((item) => item.type === "in")
    .reduce((sum, item) => sum + Number(item.quantity), 0);

  const totalOut = mergedInventoryDetails
    .filter((item) => item.type === "out")
    .reduce((sum, item) => sum + Number(item.quantity), 0);

  const cardData = [
    {
      title: "Total Stok Saat Ini",
      value: `${currentInventory?.totalQuantity ?? 0} ${currentInventory?.unit ?? ""}`,
      icon: <LuPackage />,
    },
    {
      title: "Total Barang Masuk",
      value: `${totalIn} ${currentInventory?.unit ?? ""}`,
      icon: <LuCircleArrowDown className="text-green-500" />,
    },
    {
      title: "Total Barang Keluar",
      value: `${totalOut} ${currentInventory?.unit ?? ""}`,
      icon: <LuCircleArrowUp className="text-red-500" />,
    },
    {
      title: "Total Kejadian In/Out",
      value: `${mergedInventoryDetails.length}`,
      icon: <LuArrowUpDown className="text-amber-500" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header — date range picker top-right */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mt-2">
        <h1 className="text-2xl font-semibold">Detail Inventaris</h1>
        <div className="w-full md:w-72">
          <DatePickerWithRange
            label="Pilih Rentang Waktu"
            onValueChange={(start, end) =>
              setDateRange({ start: start ?? null, end: end ?? null })
            }
          />
        </div>
      </div>

      {/* 4 CardStatistic cards */}
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

      <Tabs defaultValue="ringkasan" className="w-full">
        <TabsList>
          <TabsTrigger value="ringkasan">Ringkasan &amp; Grafik</TabsTrigger>
          <TabsTrigger value="tabel">Data Tabel</TabsTrigger>
        </TabsList>

        <TabsContent value="ringkasan" className="mt-4">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <InventoryOverview
              details={filteredInventoryDetails}
              currentInventory={currentInventory}
            />
          )}
        </TabsContent>

        <TabsContent value="tabel" className="mt-4">
          <div className="space-y-4">
            <DefaultCard>
              <div className="w-full">
                {isLoading ? (
                  <TableSkeleton />
                ) : (
                  <div>
                    <div className="flex justify-end items-center mb-4">
                      <PostStockInOut />
                    </div>
                    <DataTable
                      columns={columns}
                      data={filteredInventoryDetails}
                    />
                  </div>
                )}
              </div>
            </DefaultCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
