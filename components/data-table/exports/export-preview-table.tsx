"use client";

import { flexRender } from "@tanstack/react-table";
import { forwardRef } from "react";

const EXCLUDED_COLS = new Set(["select", "action", "actions", "No"]);

/** Ekstrak label teks dari columnDef.header */
function extractHeaderLabel(col: any): string {
  const raw = col.columnDef.header;
  if (typeof raw === "string") return raw.toUpperCase();
  // Fallback: ubah camelCase col.id → "KATA KATA"
  return col.id
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toUpperCase();
}

interface ExportPreviewTableProps {
  /** TanStack Table instance */
  table: any;
  /**
   * Override baris yang dirender. Jika tidak diisi, gunakan
   * table.getFilteredRowModel().rows (semua baris setelah filter).
   */
  rows?: any[];
}

export const ExportPreviewTable = forwardRef<
  HTMLDivElement,
  ExportPreviewTableProps
>(function ExportPreviewTable({ table, rows }, ref) {
  // Kolom visible, exclude select/action
  const exportCols = table
    .getAllColumns()
    .filter((col: any) => col.getIsVisible() && !EXCLUDED_COLS.has(col.id));

  // Semua baris (atau override jika di-pass)
  const allRows = rows ?? table.getFilteredRowModel().rows;

  return (
    <div ref={ref} style={{ background: "#ffffff", padding: "16px" }}>
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
          <tr>
            {exportCols.map((col: any) => (
              <th
                key={col.id}
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
                {extractHeaderLabel(col)}
              </th>
            ))}
          </tr>
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
