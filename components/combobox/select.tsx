"use client";

import { CheckIcon, ChevronDown, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

export function SelectCombobox({
  data,
  onValueChange,
  isLoading,
  name,
  selectedValue,
  disable,
  label,
  id,
  resetValues,
}: {
  data: { value: string; label: string }[];
  onValueChange?: (value: string) => void;
  isLoading?: boolean;
  name?: string;
  selectedValue?: string;
  disable?: boolean;
  label?: string;
  id?: string;
  resetValues?: number;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue || "");

  useEffect(() => {
    if (selectedValue !== undefined) {
      setValue(selectedValue);
    }
  }, [selectedValue]);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(value);
    }
  }, [value, onValueChange]);

  useEffect(() => {
    if (resetValues !== undefined && resetValues > 0) {
      setValue("");
    }
  }, [resetValues]);

  return (
    <div className="w-full space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full h-auto min-h-8 justify-between ${value ? "" : "text-muted-foreground "}`}
            disabled={disable}
          >
            {value
              ? data.find((framework) => framework.value === value)?.label
              : `Pilih ${name || ""}...`}
            {/* <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 opacity-50 ${open ? "rotate-180" : ""}`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          align="start"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command>
            <CommandInput
              placeholder={`Cari ${name || ""}...`}
              disabled={disable}
            />
            <CommandList>
              <CommandEmpty>No Data found.</CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
