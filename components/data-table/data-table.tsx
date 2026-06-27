"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as React from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-column-view";
import { DataTableFacetedFilter } from "./faceted-filter";
import { ExportOptions } from "./exports/exports";
import { DataTableDateFilter } from "./data-table-date-filter";
import { useMemo, useState } from "react";
import { FilterFn } from "@tanstack/react-table";
import { LuFilter, LuSearch } from "react-icons/lu";
import { Button } from "../ui/button";
import FloatingMenuSelectedRow from "./floating-menu-selected-row";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  facetedFilter?: {
    column: string;
    option: {
      label: string;
      value: string;
    }[];
  }[];
  dateFilter?: {
    /** accessorKey dari kolom yang berisi nilai tanggal (ISO string / Date) */
    column: string;
    /** Label yang ditampilkan di tombol filter */
    label: string;
  }[];
  exportOptions?: boolean;
  children?: React.ReactNode;
}

/**
 * Custom filterFn untuk rentang tanggal.
 * filterValue: [fromISO: string, toISO: string]
 * Nilai kolom bisa berupa ISO string atau Date.
 */
const dateRangeFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const [from, to] = filterValue as [string, string];
  const rawValue = row.getValue(columnId);
  if (!rawValue) return false;

  // Normalise ke yyyy-mm-dd string
  const cellDate =
    rawValue instanceof Date
      ? rawValue.toISOString().slice(0, 10)
      : String(rawValue).slice(0, 10);

  if (from && cellDate < from) return false;
  if (to && cellDate > to) return false;
  return true;
};
dateRangeFilter.autoRemove = (val) => !val || (!val[0] && !val[1]);

export function DataTable<TData, TValue>({
  columns,
  data,
  facetedFilter,
  dateFilter,
  children,
  exportOptions = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Menambahkan kolom dan data row "No" secara dinamis
  const dataWithNo = useMemo(() => {
    return data.map((item, index) => ({ No: index + 1, ...item }));
  }, [data]);

  const table = useReactTable({
    data: dataWithNo,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
    filterFns: {
      dateRange: dateRangeFilter as FilterFn<TData>,
    },
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
  });

  return (
    <>
      <div className="print:hidden">
        {table.getSelectedRowModel().rows.length > 0 && (
          <FloatingMenuSelectedRow table={table} />
        )}
      </div>

      <div className="">
        {children && <div className="">{children}</div>}
        <div className="flex items-center justify-between py-4 gap-2 print:hidden">
          <div className="flex flex-1 items-center gap-2">
            {/* Search */}
            <div>
              <InputGroup>
                <InputGroupInput
                  placeholder="Cari di semua kolom..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="max-w-60"
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </div>
            {/* Filter kolom */}
            {facetedFilter &&
              facetedFilter?.map(
                (filter) =>
                  table.getColumn(filter.column) && (
                    <DataTableFacetedFilter
                      key={filter.column}
                      column={table.getColumn(filter.column)}
                      title={filter.column}
                      options={filter.option}
                    />
                  ),
              )}
            {/* Date range filter */}
            {dateFilter &&
              dateFilter.map(
                (df) =>
                  table.getColumn(df.column) && (
                    <DataTableDateFilter
                      key={df.column}
                      column={table.getColumn(df.column)}
                      label={df.label}
                    />
                  ),
              )}
          </div>
          <div className="flex items-center gap-2">
            {/* Export options */}
            {exportOptions && <ExportOptions table={table} />}
            {/* Column view options */}
            <DataTableViewOptions table={table} />
          </div>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50 uppercase">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="pl-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="pl-4">
                        {(() => {
                          const rawValue = cell.getValue();

                          if (rawValue === null || rawValue === "") {
                            return (
                              <div className="text-gray-400 italic">-</div>
                            );
                          }

                          if (cell.column.columnDef.cell) {
                            const content = flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            );
                            return content;
                          }

                          // Render nilai biasa
                          return String(rawValue);
                        })()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 print:hidden">
          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  );
}
