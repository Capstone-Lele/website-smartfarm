"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Feed } from "@/types/notes/feed.types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";

const DetailFeedingSheet = ({ item }: { item: Feed }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div>
          <ButtonDetailColumn
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
          />
        </div>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">
            Detail Laporan Pakan (Feeding)
          </SheetTitle>
          <SheetDescription>
            Informasi lengkap mengenai pemberian pakan ikan.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-8 space-y-8">
          {/* Image Section */}
          <div className="flex flex-col items-center gap-5">
            <img
              src={item.image || "/placeholder-image.png"}
              alt="Bukti pakan"
              className="w-full h-48 object-cover border bg-muted rounded-md"
            />
          </div>

          {/* Info Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-tight">
              Informasi Laporan
            </h4>
            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Jenis Pakan</span>
                <span className="font-medium capitalize">{item.foodName}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Tipe</span>
                <Badge variant="outline" className="capitalize px-2">
                  {item.type}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Jumlah</span>
                <div className="flex flex-col text-right">
                  <span className="font-medium">{item.quantity}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.unit}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Tanggal Laporan</span>
                <span className="font-medium">
                  {formatDate(item.reportDate)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Petugas</span>
                <span className="font-medium capitalize">{item.user}</span>
              </div>
              <Separator />
            </div>
          </div>

          {/* Pool Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-tight">
              Informasi Kolam & Siklus
            </h4>
            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Kolam</span>
                <span className="font-medium capitalize">{item.poolName}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Kategori Kolam</span>
                <span className="font-medium capitalize">
                  {translateCategoryPool(item.poolCategory)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Mulai Siklus</span>
                <span className="font-medium">
                  {formatDate(item.startDate)}
                </span>
              </div>
              <Separator />
            </div>
          </div>

          {/* Timestamps Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-tight">
              Riwayat Sistem
            </h4>
            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Waktu Dibuat</span>
                <span className="font-medium">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <Separator />
              {item.updatedAt && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Terakhir Diubah
                    </span>
                    <span className="font-medium">
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                  <Separator />
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DetailFeedingSheet;
