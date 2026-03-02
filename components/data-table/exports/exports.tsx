"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuDownload } from "react-icons/lu";
import { ChevronDown } from "lucide-react";
import { ExportPreviewModal } from "./export-preview-modal";

interface ExportOptionsProps {
  /** TanStack Table instance */
  table: any;
  title?: string;
  fileName?: string;
}

export function ExportOptions({ table, title, fileName }: ExportOptionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <LuDownload />
            Export
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <LuDownload className="mr-2 h-4 w-4" />
              Export ke PDF
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExportPreviewModal
        open={open}
        onClose={() => setOpen(false)}
        table={table}
        title={title ?? "Data Export"}
        fileName={fileName}
      />
    </>
  );
}
