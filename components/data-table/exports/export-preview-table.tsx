"use client";

import { flexRender } from "@tanstack/react-table";
import { forwardRef } from "react";

const EXCLUDED_COLS = new Set(["select", "action", "actions", "No"]);

// Removed extractHeaderLabel as we will use flexRender

interface ExportPreviewTableProps {
  /** TanStack Table instance */
  table: any;
  /**
   * Override baris yang dirender. Jika tidak diisi, gunakan
   * table.getFilteredRowModel().rows (semua baris setelah filter).
   */
  rows?: any[];
  title?: string;
}

export const ExportPreviewTable = forwardRef<
  HTMLDivElement,
  ExportPreviewTableProps
>(function ExportPreviewTable({ table, rows, title }, ref) {
  // Kolom visible, exclude select/action
  const exportCols = table
    .getAllColumns()
    .filter((col: any) => col.getIsVisible() && !EXCLUDED_COLS.has(col.id));

  // Semua baris (atau override jika di-pass)
  const allRows = rows ?? table.getFilteredRowModel().rows;

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

  return (
    <div ref={ref} style={{ background: "#ffffff", padding: "32px", color: "black", width: "100%" }}>
      {/* HEADER LAPORAN */}
      <div style={{ display: "flex", flexDirection: "column", textAlign: "center", marginBottom: "20px", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px", fontFamily: "sans-serif" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: "0", textTransform: "uppercase" }}>{title || "Data Laporan"}</h2>
        <div style={{ fontSize: "12px", marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
          <div style={{ textAlign: "left" }}>
            <strong>SmartFarm</strong><br />
            <span style={{ fontSize: "10px" }}>Sistem Monitoring Budidaya Lele</span>
          </div>
          <div style={{ textAlign: "right" }}>
            Dicetak: {dateStr}<br />
            <span style={{ fontSize: "10px" }}>{timeStr} WIB</span>
          </div>
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
          fontFamily: "sans-serif",
        }}
      >
        {/* HEAD */}
        <thead>
          {table.getHeaderGroups().map((headerGroup: any) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers
                .filter((header: any) => !EXCLUDED_COLS.has(header.column.id) && header.column.getIsVisible())
                .map((header: any) => (
                  <th
                    key={header.id}
                    style={{
                      backgroundColor: "#f9fafb",
                      color: "#000000",
                      padding: "8px 10px",
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: "11px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
            </tr>
          ))}
        </thead>

        {/* BODY */}
        <tbody>
          {allRows.length === 0 ? (
            <tr>
              <td
                colSpan={exportCols.length}
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: "#9ca3af",
                }}
              >
                Tidak ada data.
              </td>
            </tr>
          ) : (
            allRows.map((row: any, i: number) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: i % 2 === 0 ? "#ffffff" : "#f3f4f6",
                }}
              >
                {exportCols.map((col: any) => {
                  const cell = row
                    .getAllCells()
                    .find((c: any) => c.column.id === col.id);
                  return (
                    <td
                      key={col.id}
                      style={{
                        padding: "6px 10px",
                        color: "#374151",
                        borderBottom: "1px solid #e5e7eb",
                        fontSize: "11px",
                        verticalAlign: "middle",
                      }}
                    >
                      {cell
                        ? flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )
                        : "-"}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});
