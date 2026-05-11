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
import { Seed } from "@/types/notes/seed";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";

const DetailSeedingSheet = ({ item }: { item: Seed }) => {
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
            Detail Laporan Penebaran (Seeding)
          </SheetTitle>
          <SheetDescription>
            Informasi lengkap mengenai penebaran benih awal ke kolam.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-8 space-y-8">
          {/* Image Section */}
          <div className="flex flex-col items-center gap-5">
            <img
              src={item.image || "/placeholder-image.png"}
              alt="Bukti penebaran"
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
                <span className="text-muted-foreground">Jumlah Tebar</span>
                <span className="font-medium">{item.initialQuantity} Ekor</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Jumlah Saat Ini</span>
                <span className="font-medium">{item.currentQuantity} Ekor</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Berat Rata-rata Awal
                </span>
                <span className="font-medium">
                  {item.initialAverageWeight} gram
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Tanggal Laporan</span>
                <span className="font-medium">
                  {formatDate(item.reportDate)}
                </span>
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

export default DetailSeedingSheet;
