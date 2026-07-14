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
import { Sick } from "@/types/notes/sick.types";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";
import { Badge } from "@/components/ui/badge";

const DetailSickSheet = ({ item }: { item: Sick }) => {
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
            Detail Laporan Ikan Sakit (Karantina)
          </SheetTitle>
          <SheetDescription>
            Informasi lengkap mengenai pemindahan ikan sakit ke kolam
            asolasi/karantina.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-8 space-y-8">
          {/* Image Section */}
          <div className="flex flex-col items-center gap-5">
            <img
              src={item.image || "/placeholder-image.png"}
              alt="Bukti ikan sakit"
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
                <span className="text-muted-foreground">Jumlah Ikan</span>
                <span className="font-medium">{item.quantity} Ekor</span>
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

          {/* Penyakit / Catatan Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-tight">
              Penyakit / Catatan
            </h4>
            <div className="flex flex-col space-y-3 pt-2">
              {item.sickTypes && item.sickTypes.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground">Jenis Penyakit</span>
                  <div className="flex flex-wrap gap-2">
                    {item.sickTypes.map((type) => (
                      <Badge key={type.id} variant="destructive">
                        {type.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">Catatan</span>
                  <span className="text-sm font-medium bg-muted/50 p-3 rounded-md break-words border text-foreground">
                    {item.notes || "-"}
                  </span>
                </div>
              )}
              <Separator />
            </div>
          </div>

          {/* Pool Origins Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-tight">
              Dari: Kolam Asal
            </h4>
            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Kolam Asal</span>
                <span className="font-medium capitalize">
                  {item.originPoolName}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Kategori Kolam</span>
                <span className="font-medium capitalize">
                  {translateCategoryPool(item.originCategory)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Mulai Siklus</span>
                <span className="font-medium">
                  {formatDate(item.originStartDate)}
                </span>
              </div>
              <Separator />
            </div>
          </div>

          {/* Pool Destination Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-tight">
              Ke: Kolam Tujuan (Karantina)
            </h4>
            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Kolam Tujuan</span>
                <span className="font-medium capitalize">
                  {item.destinationPoolName}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Kategori Kolam</span>
                <span className="font-medium capitalize">
                  {translateCategoryPool(item.destinationCategory)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Mulai Siklus</span>
                <span className="font-medium">
                  {formatDate(item.destinationStartDate)}
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

export default DetailSickSheet;
