"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DatePickerWithRange } from "@/components/date-picker/date-rage-picker";
import { getColumns } from "./column";
import { useIot } from "@/lib/api/service/iot/useIot";
import { DataTable } from "@/components/data-table/data-table";
import DefaultCard from "@/components/card/default-card";
import { ResetFilterButton } from "@/components/button/reset-filter";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import FilterSkeleton from "@/components/sekeleton/filter-skeleton";
import { SelectCombobox } from "@/components/combobox/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IotOverview } from "./_components/iot-overview";

const page = () => {
  const { data, isLoading, error } = useIot();

  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const [filteredData, setFilteredData] = useState(data || []);
  const [filterType, setFilterType] = useState<string>("all");
  const [resetTrigger, setResetTrigger] = useState(0);

  const columns = useMemo(() => getColumns(filterType as any), [filterType]);

  const handleDateRangeChange = (
    startDate?: Date | null,
    endDate?: Date | null,
  ) => {
    setSelectedDateRange({
      startDate: startDate || null,
      endDate: endDate || null,
    });
  };

  const formReset = () => {
    setSelectedDateRange({ startDate: null, endDate: null });
    setFilterType("all");
    setResetTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!data) {
      setFilteredData([]);
      return;
    }

    const filtered = data.filter((item) => {
      if (!item.createdAt) return false;

      const itemDate = new Date(item.createdAt);
      const { startDate, endDate } = selectedDateRange;

      const isDateMatch =
        (!startDate && !endDate) ||
        (startDate &&
          endDate &&
          itemDate >= startDate &&
          itemDate <= endDate) ||
        (startDate && !endDate && itemDate >= startDate) ||
        (!startDate && endDate && itemDate <= endDate);

      if (!isDateMatch) return false;

      return true;
    });

    setFilteredData(filtered);
  }, [selectedDateRange, data, filterType]);

  return (
    <div className="flex flex-col gap-4">
      <DefaultCard>
        {isLoading ? (
          <FilterSkeleton />
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-lg">Filter Laporan IOT</span>
              <ResetFilterButton onReset={formReset} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DatePickerWithRange
                placeholder="Pilih rentang tanggal"
                label="Tanggal"
                onValueChange={handleDateRangeChange}
                resetValues={resetTrigger}
              />
              <SelectCombobox
                data={[
                  { label: "Semua (pH & Suhu)", value: "all" },
                  { label: "pH Air", value: "ph" },
                  { label: "Suhu (°C)", value: "temp" },
                ]}
                onValueChange={(val) => setFilterType(val || "all")}
                label="Parameter"
                resetValues={resetTrigger}
              />
            </div>
          </div>
        )}
      </DefaultCard>

      <Tabs defaultValue="visualisasi" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="visualisasi">Ringkasan & Grafik</TabsTrigger>
          <TabsTrigger value="tabel">Data Tabel</TabsTrigger>
        </TabsList>

        <TabsContent value="visualisasi">
          {!isLoading && !error && <IotOverview data={filteredData} />}
        </TabsContent>

        <TabsContent value="tabel">
          <DefaultCard>
            <div className="w-full">
              {isLoading ? (
                <TableSkeleton />
              ) : error ? (
                <div className="p-4 text-red-500">Gagal memuat data IOT</div>
              ) : (
                <DataTable columns={columns} data={filteredData} />
              )}
            </div>
          </DefaultCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
