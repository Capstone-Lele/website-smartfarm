"use client";
import { DataTable } from "@/components/data-table/data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./column";
import DefaultCard from "@/components/card/default-card";
import { DatePickerWithRange } from "@/components/date-picker/date-rage-picker";
import { ResetFilterButton } from "@/components/button/reset-filter";
import ComboboxMultiple from "@/components/combobox/multibple";
import { useListSick } from "@/lib/api/service/notes/sick/useSick";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import FilterSkeleton from "@/components/sekeleton/filter-skeleton";
import { Combobox } from "@/components/combobox";
import { usePool } from "@/lib/api/service/pools/usePool";
import { Field, FieldLabel } from "@/components/ui/field";
import { SelectCombobox } from "@/components/combobox/select";
import { useGetUsers } from "@/lib/api/service/users/useUser";

const page = () => {
  const { data, isLoading, error } = useListSick();
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
  const [filteredData, setFilteredData] = useState(data?.data || []);
  const [selectedOriginPools, setSelectedOriginPools] = useState<string>();
  const [selectedDestinationPools, setSelectedDestinationPools] =
    useState<string>();
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>();
  const [resetTrigger, setResetTrigger] = useState(0);

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
    // Reset form fields here
    setSelectedDateRange({ startDate: null, endDate: null });
    setSelectedOriginPools(undefined);
    setSelectedDestinationPools(undefined);
    setSelectedStaffs(undefined);
    setResetTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!data?.data) {
      setFilteredData([]);
      return;
    }

    const filteredData = data.data.filter((item) => {
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

      const isOriginPoolMatch =
        !selectedOriginPools || item.originPoolName === selectedOriginPools;

      if (!isOriginPoolMatch) return false;

      const isDestinationPoolMatch =
        !selectedDestinationPools ||
        item.destinationPoolName === selectedDestinationPools;

      if (!isDestinationPoolMatch) return false;

      const isStaffMatch =
        !selectedStaffs ||
        selectedStaffs.length === 0 ||
        selectedStaffs.includes(item.user);

      if (!isStaffMatch) return false;

      return true;
    });

    setFilteredData(filteredData);
  }, [
    selectedDateRange,
    data,
    selectedOriginPools,
    selectedDestinationPools,
    selectedStaffs,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <DefaultCard>
        {isLoading || isLoadingPool || isLoadingUsers ? (
          <FilterSkeleton />
        ) : (
          <div className=" flex flex-col gap-1">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-lg">Filter Laporan Sakit</span>
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
                  dataPool?.data?.map((pool) => ({
                    label: pool.name,
                    value: pool.name,
                  })) || []
                }
                onValueChange={setSelectedOriginPools}
                label="Kolam Asal"
                resetValues={resetTrigger}
              />
              <SelectCombobox
                data={
                  dataPool?.data?.map((pool) => ({
                    label: pool.name,
                    value: pool.name,
                  })) || []
                }
                onValueChange={setSelectedDestinationPools}
                label="Kolam Tujuan"
                resetValues={resetTrigger}
              />
              <ComboboxMultiple
                data={
                  dataUsers?.data
                    ?.filter((user) => user.role === "staff")
                    .map((user) => ({
                      label: user.name,
                      value: user.name,
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
      <DefaultCard>
        <div className="w-full">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable columns={columns} data={filteredData} />
          )}
        </div>
      </DefaultCard>
    </div>
  );
};

export default page;
