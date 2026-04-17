"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import Image from "next/image";
import { ImagePopup } from "@/components/image-popup";
import { Vitamin } from "@/types/notes/vitamin.types";
import { formatDate } from "@/lib/utils/format-date";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";


export const columns: ColumnDef<Vitamin>[] = [
  {
     accessorKey: "reportDate",
     header: ({ column }) => (
       <DataTableColumnHeader className="" column={column} title="TANGGAL" />
     ),
     cell: ({ row }) => {
       return formatDate(row.original.reportDate);
     },
   },
   {
     accessorKey: "poolName",
     header: ({ column }) => (
       <DataTableColumnHeader className="" column={column} title="KOLAM" />
     ),
     cell: ({ row }) => {
       return (
         <div className="flex flex-col">
           <span className="font-semibold">{row.original.poolName}</span>
           <span className="text-xs">
             {translateCategoryPool(row.original.poolCategory)}
           </span>
         </div>
       );
     },
   },
   {
     accessorKey: "cycleStartDate",
     header: ({ column }) => (
       <DataTableColumnHeader className="" column={column} title="SIKLUS" />
     ),
     cell: ({ row }) => {
       return formatDate(row.original.cycleStartDate);
     },
   },
   {
     accessorKey: "vitaminName",
     header: ({ column }) => (
       <DataTableColumnHeader className="" column={column} title="PAKAN" />
     ),
   },
   {
     accessorKey: "quantity",
     header: ({ column }) => (
       <DataTableColumnHeader
         className=""
         column={column}
         title="JUMLAH PAKAN"
       />
     ),
   },
   {
     accessorKey: "image",
     header: () => <span>GAMBAR</span>,
     cell: ({ row }) => (
       <ImagePopup imageUrl={row.original.image || "/placeholder-image.png"} />
     ),
   },
 
   {
     accessorKey: "user",
     header: ({ column }) => (
       <DataTableColumnHeader className="" column={column} title="PETUGAS" />
     ),
   },
];
