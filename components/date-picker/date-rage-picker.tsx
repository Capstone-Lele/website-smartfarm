"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { SelectCombobox } from "../combobox/select";

export function DatePickerWithRange({
  onValueChange,
  label,
  placeholder,
  resetValues,
  hideLabel,
  initialDate,
}: {
  onValueChange?: (startDate?: Date | null, endDate?: Date | null) => void;
  label?: string;
  placeholder?: string;
  resetValues?: number;
  hideLabel?: boolean;
  initialDate?: DateRange;
}) {
  const [date, setDate] = useState<DateRange | undefined>(initialDate);

  useEffect(() => {
    if (onValueChange) {
      const startDate = date?.from
        ? new Date(
            date.from.getFullYear(),
            date.from.getMonth(),
            date.from.getDate(),
          )
        : null;

      const endDate = date?.to
        ? new Date(
            date.to.getFullYear(),
            date.to.getMonth(),
            date.to.getDate(),
            23,
            59,
            59,
            999,
          )
        : null;

      onValueChange(startDate, endDate);
    }
  }, [date]);

  useEffect(() => {
    if (resetValues !== undefined && resetValues > 0) {
      setDate(initialDate);
    }
  }, [resetValues, initialDate]);

  return (
    <Field className="w-full ">
      {!hideLabel && (
        <FieldLabel htmlFor="date-picker-range" className="mb-px">
          {label ?? "Date Picker Range"}
        </FieldLabel>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-between h-auto min-h-8 px-2.5 font-normal mt-[-7]"
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span className="text-muted-foreground">
                {placeholder ?? "Pick a date"}
              </span>
            )}
            <CalendarIcon className="text-muted-foreground/80 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
