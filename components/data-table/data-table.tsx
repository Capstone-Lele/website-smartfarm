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
import { useMemo, useState } from "react";
import { LuFilter } from "react-icons/lu";
import { Button } from "../ui/button";
import FloatingMenuSelectedRow from "./floating-menu-selected-row";

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
  exportOptions?: {
    pdf: boolean;
    csv: boolean;
  }[];
  children?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  facetedFilter,
  children,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

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
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && (
        <FloatingMenuSelectedRow table={table} />
      )}

      <div className="w-full">
        {children && <div className="">{children}</div>}
        <div className="flex items-center justify-between py-4 gap-2">
          <div className="flex flex-1 items-center gap-2">
            {/* Search */}
            <Input
              placeholder="Search all columns..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-60"
            />
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
                  )
              )}
          </div>
          <div className="flex items-center gap-2">
            {/* Export options */}
            <ExportOptions
              columns={table
                .getAllColumns()
                .filter(
                  (col: any) =>
                    col.id !== "actions" &&
                    col.id !== "select" &&
                    col.id !== "No"
                )
                .map((col: any) => ({
                  key: col.columnDef.accessorKey || col.id,
                  displayLabel: col.id
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .toUpperCase(),
                }))}
              data={table.getRowModel().rows.map((row) => row.original)}
            />
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
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
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
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  );
}
