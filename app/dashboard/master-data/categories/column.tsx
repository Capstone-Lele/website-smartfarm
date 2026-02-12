"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";

type Category = {
  id: string;
  name: string;
};

export const columnsCategory: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NAMA" />
    ),
  },
];
