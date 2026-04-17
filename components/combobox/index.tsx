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

export function Combobox({
  data,
  onValueChange,
  isLoading,
  name,
  selectedValue,
  disable,
}: {
  data: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  isLoading?: boolean;
  name?: string;
  selectedValue?: string;
  disable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue || "");

  useEffect(() => {
    if (selectedValue !== undefined) {
      setValue(selectedValue);
    }
  }, [selectedValue]);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disable}
          className={`w-full justify-between ${value ? "" : "text-muted-foreground "}`}
        >
          {value
            ? data.find((framework) => framework.value === value)?.label
            : `Pilih ${name || ""}...`}
          {/* <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
            <ChevronDown className={`ml-2 h-4 w-4 shrink-0 opacity-50 ${open ? "rotate-180" : ""}`} />
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
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    onValueChange(newValue);
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
  );
}
