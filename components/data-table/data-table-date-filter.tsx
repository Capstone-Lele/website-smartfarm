"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { LuCalendar, LuX } from "react-icons/lu";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface DataTableDateFilterProps<TData, TValue> {
  column: Column<TData, TValue> | undefined;
  label: string;
}

// Konversi Date → "yyyy-MM-dd" string untuk filterFn
function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function DataTableDateFilter<TData, TValue>({
  column,
  label,
}: DataTableDateFilterProps<TData, TValue>) {
  const filterValue = column?.getFilterValue() as [string, string] | undefined;

  // Sinkronisasi state lokal dengan filter yang aktif dari tabel
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (!filterValue) return undefined;
    return {
      from: filterValue[0] ? new Date(filterValue[0] + "T00:00:00") : undefined,
      to: filterValue[1] ? new Date(filterValue[1] + "T00:00:00") : undefined,
    };
  });

  const [open, setOpen] = useState(false);

  const hasFilter = !!filterValue?.[0] || !!filterValue?.[1];

  // Reset lokal state saat filter dari luar di-clear
  useEffect(() => {
    if (!filterValue) {
      setRange(undefined);
    }
  }, [filterValue]);

  // Terapkan filter ke column setiap kali range berubah
  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);

    if (!selectedRange || (!selectedRange.from && !selectedRange.to)) {
      column?.setFilterValue(undefined);
      return;
    }

    column?.setFilterValue([
      selectedRange.from ? toIsoDate(selectedRange.from) : "",
      selectedRange.to ? toIsoDate(selectedRange.to) : "",
    ]);
  };

  const clearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRange(undefined);
    column?.setFilterValue(undefined);
  };

  // Label ringkas yang ditampilkan di tombol
  const displayLabel = useMemo(() => {
    if (!hasFilter) return null;
    const from = filterValue?.[0]
      ? format(new Date(filterValue[0] + "T00:00:00"), "d MMM yyyy", {
          locale: localeId,
        })
      : null;
    const to = filterValue?.[1]
      ? format(new Date(filterValue[1] + "T00:00:00"), "d MMM yyyy", {
          locale: localeId,
        })
      : null;

    if (from && to) return `${from} – ${to}`;
    if (from) return `Dari ${from}`;
    if (to) return `Sampai ${to}`;
    return null;
  }, [filterValue, hasFilter]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 border-dashed gap-1.5 text-xs font-medium"
          )}
        >
          <LuCalendar className="h-3.5 w-3.5 shrink-0" />
          {label}
          {displayLabel && (
            <>
              <span className="text-muted-foreground">:</span>
              <span className="font-semibold">{displayLabel}</span>
              <Separator orientation="vertical" className="h-4" />
              <span
                role="button"
                aria-label="Hapus filter tanggal"
                onClick={clearFilter}
                className="flex items-center justify-center hover:text-destructive cursor-pointer"
              >
                <LuX className="h-4 w-4" />
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <p className="text-sm font-semibold">Filter Tanggal — {label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pilih rentang tanggal (klik awal lalu akhir)
          </p>
        </div>
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
          locale={localeId}
        />
      </PopoverContent>
    </Popover>
  );
}
