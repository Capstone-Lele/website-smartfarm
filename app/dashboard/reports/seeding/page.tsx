"use client";
import { DataTable } from "@/components/data-table/data-table";
import React, { useEffect, useState, useMemo } from "react";
import { columns } from "./column";
import DefaultCard from "@/components/card/default-card";
import { useListSeeding } from "@/lib/api/service/notes/seeding/useSeeding";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { usePool } from "@/lib/api/service/pools/usePool";
import { useGetUsers } from "@/lib/api/service/users/useUser";
import FilterSkeleton from "@/components/sekeleton/filter-skeleton";
import { DatePickerWithRange } from "@/components/date-picker/date-rage-picker";
import { SelectCombobox } from "@/components/combobox/select";
import { ResetFilterButton } from "@/components/button/reset-filter";
import ComboboxMultiple from "@/components/combobox/multibple";
import { useListCycle } from "@/lib/api/service/cycles/useCycle";
import { formatDate } from "@/lib/utils/format-date";
import { SeedingOverview } from "./_components/seeding-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = () => {
  const { data, isLoading, error } = useListSeeding();
  const {
    data: dataPool,
    isLoading: isLoadingPool,
    error: errorPool,
  } = usePool();
  const {
    data: dataUsers,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useGetUsers();
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });
  const [selectedPools, setSelectedPools] = useState<string>();
  const [selectedCycles, setSelectedCycles] = useState<string>();
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>();
  const {
    data: dataCycles,
    isLoading: isLoadingCycles,
    error: errorCycles,
  } = useListCycle(selectedPools || "");
  const [resetTrigger, setResetTrigger] = useState(0);

  const dataWithOutCategory = useMemo(() => {
    return data?.data?.filter((pool) => pool.poolCategory === "breeding");
  }, [data?.data]);

  const [filteredData, setFilteredData] = useState(dataWithOutCategory || []);

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
    setSelectedPools(undefined);
    setSelectedCycles(undefined);
    setSelectedStaffs(undefined);
    setResetTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    setSelectedCycles(undefined);
  }, [selectedPools]);

  useEffect(() => {
    if (!dataWithOutCategory) {
      setFilteredData([]);
      return;
    }

    const filtered = dataWithOutCategory?.filter((item) => {
      const itemDate = new Date(item.reportDate);
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

      const isPoolMatch = !selectedPools || item.poolId === selectedPools;
      if (!isPoolMatch) return false;

      const isCycleMatch = !selectedCycles || item.id === selectedCycles;
      if (!isCycleMatch) return false;

      const isStaffMatch =
        !selectedStaffs ||
        selectedStaffs.length === 0 ||
        selectedStaffs.includes(item.userId);
      if (!isStaffMatch) return false;

      return true;
    });
    setFilteredData(filtered);
  }, [
    dataWithOutCategory,
    selectedDateRange,
    selectedPools,
    selectedCycles,
    selectedStaffs,
  ]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <DefaultCard>
          {isLoading || isLoadingPool || isLoadingUsers ? (
            <FilterSkeleton />
          ) : (
            <div className=" flex flex-col gap-1">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-lg">
                  Filter Laporan Penebaran
                </span>
                <ResetFilterButton onReset={formReset} />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <DatePickerWithRange
                  placeholder="Pilih rentang tanggal"
                  label="Tanggal"
                  onValueChange={handleDateRangeChange}
                  resetValues={resetTrigger}
                />
                <SelectCombobox
                  data={
                    dataPool?.data
                      ?.filter((pool) => pool.category === "breeding")
                      .map((pool) => ({
                        label: pool.name,
                        value: pool.id,
                      })) || []
                  }
                  onValueChange={setSelectedPools}
                  label="Kolam"
                  resetValues={resetTrigger}
                />
                <SelectCombobox
                  data={
                    dataCycles?.data?.map((cycle) => ({
                      label: formatDate(cycle.startDate),
                      value: cycle.id,
                    })) || []
                  }
                  onValueChange={setSelectedCycles}
                  label="Siklus"
                  disable={!selectedPools}
                  resetValues={resetTrigger}
                />
                <ComboboxMultiple
                  data={
                    dataUsers?.data
                      ?.filter((user) => user.role === "staff")
                      .map((user) => ({
                        label: user.name,
                        value: user.id,
                      })) || []
                  }
                  onValueChange={setSelectedStaffs}
                  label="Petugas"
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
            {!isLoading && !isLoadingPool && !isLoadingUsers && (
              <SeedingOverview data={filteredData} />
            )}
          </TabsContent>

          <TabsContent value="tabel">
            <DefaultCard>
              <div className="w-full">
                {isLoading ? (
                  <TableSkeleton />
                ) : (
                  <DataTable columns={columns} data={filteredData} />
                )}
              </div>
            </DefaultCard>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default page;
