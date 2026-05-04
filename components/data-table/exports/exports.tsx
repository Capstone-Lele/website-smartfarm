"use client";

import { useRef } from "react";
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
import { ChevronDown, Printer } from "lucide-react";
import { ExportPreviewTable } from "./export-preview-table";
import { usePathname } from "next/navigation";
import dataPath from "@/lib/constants/path";
import { useReactToPrint } from "react-to-print";

interface ExportOptionsProps {
  /** TanStack Table instance */
  table: any;
  title?: string;
  fileName?: string;
}

export function ExportOptions({ table, title, fileName }: ExportOptionsProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();

  const checkPathname = () => {
    for (const item of dataPath) {
      if (pathName === item.path) {
        return item.name;
      }
      if (item.sub_paths) {
        for (const subItem of item.sub_paths) {
          if (pathName === subItem.path) {
            return subItem.name;
          }
        }
      }
    }
    return "";
  };

  const pathSegments = checkPathname();
  const reportTitle = title ?? `${pathSegments || "Data"}`;

  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: reportTitle,
    pageStyle: `
      @media print {
        @page { size: landscape; margin: 10mm; }
        body { font-family: sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
      }
    `,
  });

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
              onClick={() => handlePrint()}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print / Preview
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Render hidden template for print referencing */}
      <div className="hidden">
        <ExportPreviewTable ref={tableRef} table={table} title={reportTitle} />
      </div>
    </>
  );
}
