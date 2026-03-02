"use client";

import { useRef, useEffect, useState } from "react";
import { LuDownload, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { ExportPreviewTable } from "./export-preview-table";
import { exportTableToPdf } from "./export-utils";
import { usePathname } from "next/navigation";
import dataPath from "@/lib/constants/path";

interface ExportPreviewModalProps {
  open: boolean;
  onClose: () => void;
  /** TanStack Table instance */
  table: any;
  /**
   * Override baris yang dirender. Jika tidak diisi, gunakan semua baris
   * setelah filter (getFilteredRowModel).
   */
  rows?: any[];
  title?: string;
  fileName?: string;
}

export function ExportPreviewModal({
  open,
  onClose,
  table,
  rows,
  title = "Data Export",
  fileName,
}: ExportPreviewModalProps) {
  const pathName = usePathname();
  const tableRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const displayRows = rows ?? table.getFilteredRowModel().rows;
  const exportCols = table
    .getAllColumns()
    .filter(
      (col: any) =>
        col.getIsVisible() &&
        !["select", "action", "actions", "No"].includes(col.id),
    );
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

  async function handleDownload() {
    setExporting(true);
    console.log("pathname", pathName);
    const pathSegments = checkPathname();
    const title = `${pathSegments || "Data"}`;

    // Generate timestamp untuk nama file
    const now = new Date();
    const dateStr = now
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
    const timeStr = now
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/:/g, "-");

    const fileName = `${title.toLowerCase().replace(/\s+/g, "_")}_${dateStr}_${timeStr}.pdf`;
    try {
      await exportTableToPdf(tableRef, { title, fileName });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl flex flex-col w-[92vw] max-w-6xl h-[90vh] overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50 shrink-0">
          <div>
            <p className="font-semibold text-gray-900">Preview Export</p>
            <p className="text-xs text-gray-400">
              {displayRows.length} baris · {exportCols.length} kolom · A4
              Landscape
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownload}
              disabled={exporting}
              className="cursor-pointer bg-primary hover:bg-primary/90 text-white"
            >
              <LuDownload className="mr-2 h-4 w-4" />
              {exporting ? "Memproses..." : "Download PDF"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              <LuX className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview area — scrollable */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="bg-white shadow rounded-md min-w-max">
            <ExportPreviewTable ref={tableRef} table={table} rows={rows} />
          </div>
        </div>
      </div>
    </div>
  );
}
