import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuEye, LuPencil, LuTrash } from "react-icons/lu";
import Link from "next/link";
import { TbPencilMinus } from "react-icons/tb";
import { BiTrashAlt } from "react-icons/bi";

interface BookCardProps {
  title?: string;
  netProfit?: string;
  modal?: string;
  pendapatan?: string;
  pengeluaran?: string;
  periode?: string;
  onDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BookCard = ({
  title = "Buku KT-25",
  netProfit = "Rp 80.500.000",
  modal = "Rp 124.500.000",
  pendapatan = "Rp 80.500.000",
  pengeluaran = "Rp 124.500.000",
  periode = "2025-01-15",
  onDetail,
  onEdit,
  onDelete,
}: BookCardProps) => {
  return (
    <Card className="w-full max-w-sm shadow-none">
      <CardHeader className="flex items-start justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded font-medium cursor-pointer hover:underline">
          Buka
        </span>
      </CardHeader>

      <CardContent className="space-y-3 ">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Net Profit</p>
            <p className="text-sm font-medium">{netProfit}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Modal</p>
            <p className="text-sm font-medium">{modal}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Pendapatan</p>
            <p className="text-sm font-medium">{pendapatan}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pengeluaran</p>
            <p className="text-sm font-medium">{pengeluaran}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-gray-200 p-3 rounded">
          <div>
            <p className="text-xs text-muted-foreground">Pertiode</p>
            <p className="text-sm font-medium">{periode}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">&nbsp;</p>
            <p className="text-sm font-medium">-</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={"/dashboard/finance/id"} className="flex-1">
            <div className="flex justify-center items-center h-9 px-3 cursor-pointer border hover:bg-primary-surface text-black rounded-md">
              <LuEye size={20} className="mr-2" />
              Detail
            </div>
          </Link>
          <Link href={"/"}>
            <div className="h-9 w-9 p-0 border cursor-pointer hover:bg-primary-surface text-black flex items-center justify-center rounded-md">
              <TbPencilMinus size={20} />
            </div>
          </Link>
          <Link href={"/"}>
            <div className="h-9 w-9 p-0 border cursor-pointer flex items-center justify-center text-red-600 hover:bg-red-100 rounded-md">
              <BiTrashAlt size={20} />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
