"use client";

import { useEffect, useId, useState } from "react";

import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Nextjs" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "VueJS" },
  { value: "django", label: "Django" },
  { value: "astro", label: "Astro" },
  { value: "remix", label: "Remix" },
  { value: "svelte", label: "Svelte" },
  { value: "solidjs", label: "SolidJS" },
  { value: "qwik", label: "Qwik" },
];

const ComboboxMultiple = ({
  data,
  onValueChange,
  label,
  placeholder,
  isLoading,
  resetValues,
}: {
  data: { value: string; label: string }[];
  onValueChange?: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
  resetValues?: number;
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleSelection = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  useEffect(() => {
    if (onValueChange) {
      onValueChange(selectedValues);
    }
  }, [selectedValues, onValueChange]);

  useEffect(() => {
    if (resetValues !== undefined && resetValues > 0) {
      setSelectedValues([]);
    }
  }, [resetValues]);

  const removeSelection = (value: string) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value));
  };

  return (
    <div className="w-full  space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-8 w-full justify-between hover:bg-transparent"
          >
            <div className="flex flex-wrap items-center gap-1 pr-2.5">
              {selectedValues.length > 0 ? (
                selectedValues.map((val) => {
                  const framework = data.find((c) => c.value === val);

                  return framework ? (
                    <Badge key={val} variant="outline" className="rounded-sm">
                      {framework.label}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelection(val);
                        }}
                        asChild
                      >
                        <span>
                          <XIcon className="size-3" />
                        </span>
                      </Button>
                    </Badge>
                  ) : null;
                })
              ) : (
                <span className="text-muted-foreground">
                  {placeholder || "Pilih ..."}
                </span>
              )}
            </div>
            <ChevronsUpDownIcon
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="data-[state=open]:zoom-in-100 data-[state=open]:slide-in-from-bottom-10 p-0 duration-400 w-(--radix-popper-anchor-width) ">
          <Command>
            <CommandInput placeholder={`Cari ${label || "framework"}...`} />
            <CommandList>
              <CommandEmpty>Tidak ada data ditemukan</CommandEmpty>
              <CommandGroup>
                {data.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={() => toggleSelection(framework.value)}
                  >
                    <span className="truncate">{framework.label}</span>
                    {selectedValues.includes(framework.value) && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ComboboxMultiple;
