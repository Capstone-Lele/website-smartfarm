"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function DateTimePicker24h({
  value,
  onValueChange,
  label,
  placeholder,
  hideLabel,
  description,
  error,
}: {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  hideLabel?: boolean;
  description?: string;
  error?: any;
}) {
  function handleDateSelect(date: Date | undefined) {
    if (date) {
      const newDate = new Date(date);
      if (value) {
        newDate.setHours(value.getHours(), value.getMinutes(), 0, 0);
      }
      onValueChange?.(newDate);
    } else {
      onValueChange?.(undefined);
    }
  }

  function handleTimeChange(type: "hour" | "minute", timeValue: string) {
    const currentDate = value || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      newDate.setHours(parseInt(timeValue, 10));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(timeValue, 10));
    }

    onValueChange?.(newDate);
  }

  return (
    <Field className="w-full">
      {!hideLabel && (
        <FieldLabel htmlFor="datetime-picker" className="mb-px">
          {label ?? "Date & Time"}
        </FieldLabel>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="datetime-picker"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              format(value, "dd MMMM yyyy HH:mm")
            ) : (
              <span>{placeholder ?? "DD/MM/YYYY HH:MM"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="sm:flex">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              captionLayout="dropdown"
              disabled={(date) => date > new Date()}
              initialFocus
            />
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 24 }, (_, i) => i)
                    .reverse()
                    .map((hour) => (
                      <Button
                        key={hour}
                        size="icon"
                        variant={
                          value && value.getHours() === hour
                            ? "default"
                            : "ghost"
                        }
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() =>
                          handleTimeChange("hour", hour.toString())
                        }
                      >
                        {hour}
                      </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={
                        value && value.getMinutes() === minute
                          ? "default"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() =>
                        handleTimeChange("minute", minute.toString())
                      }
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error ? (
        <FieldError errors={[error]} />
      ) : description ? (
        <FieldDescription>{description}</FieldDescription>
      ) : null}
    </Field>
  );
}
