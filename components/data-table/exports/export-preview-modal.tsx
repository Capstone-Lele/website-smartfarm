"use client";

import { useRef, useEffect, useState } from "react";
import { LuDownload, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { ExportPreviewTable } from "./export-preview-table";
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

  function handlePrint() {
    if (!tableRef.current) return;
    
    // Buat iframe tersembunyi untuk mencetak khusus template ini
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const pathSegments = checkPathname();
    const reportTitle = `${pathSegments || "Data"}`;

    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <title>${reportTitle}</title>
            <style>
              @media print {
                @page { size: landscape; margin: 10mm; }
                body { font-family: sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                table { page-break-inside: auto; }
                tr { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
              }
              body { padding: 0; margin: 0; }
              .header { display: flex; flex-direction: column; text-align: center; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; font-family: sans-serif;}
              .header-title { font-size: 16px; font-weight: bold; margin: 0; text-transform: uppercase; }
              .header-sub { font-size: 12px; margin-top: 10px; display: flex; justify-content: space-between; }
              .system-info { text-align: left; }
              .print-info { text-align: right; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2 class="header-title">${reportTitle}</h2>
              <div class="header-sub">
                <div class="system-info">
                  <strong>SmartFarm</strong><br/>
                  <span style="font-size: 10px">Sistem Monitoring Budidaya Lele</span>
                </div>
                <div class="print-info">
                  Dicetak: ${dateStr}<br/>
                  <span style="font-size: 10px">${timeStr} WIB</span>
                </div>
              </div>
            </div>
            ${tableRef.current.outerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 250);
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
              onClick={handlePrint}
              className="cursor-pointer bg-primary hover:bg-primary/90 text-white"
            >
              <LuDownload className="mr-2 h-4 w-4" />
              Print Data
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
