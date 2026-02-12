"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuDownload } from "react-icons/lu";
import { ExportCsv } from "./export-csv";
import { ChevronDown } from "lucide-react";

export function ExportOptions({ columns, data }: { columns: any; data: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <LuDownload className="" />
          Export
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50" align="end" side="bottom">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              ExportCsv({ columns, data });
            }}
          >
            Export ke CSV
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Export ke PDF
          </DropdownMenuItem>

          {/* <DropdownMenuItem className="cursor-pointer">Export Selected as Pdf</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">Export Selected as Csv</DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
