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
import { Disease } from "@/types/master-data/disease.types";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { Badge } from "@/components/ui/badge";

const DetailDiseaseSheet = ({ disease }: { disease: Disease }) => {
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
        <SheetHeader className="mb-6 border-b pb-4">
          <SheetTitle className="text-xl">Detail Penyakit</SheetTitle>
          <SheetDescription>
            Informasi lengkap mengenai penyakit.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-8 space-y-8">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-tight">
              Informasi Umum
            </h4>
            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Nama Penyakit</span>
                <span className="font-medium capitalize">
                  {disease.name}
                </span>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2 text-sm">
                <span className="text-muted-foreground">Deskripsi</span>
                <p className="font-medium bg-muted p-3 rounded-md">
                  {disease.description || "-"}
                </p>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className="gap-1.5 px-2">
                  {!disease.deletedAt && (
                    <span className="size-1.5 rounded-full bg-primary" />
                  )}
                  {disease.deletedAt ? "Non-Aktif" : "Aktif"}
                </Badge>
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
                  {formatDate(disease.createdAt)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Terakhir Diubah</span>
                <span className="font-medium">
                  {formatDate(disease.updatedAt)}
                </span>
              </div>
              <Separator />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DetailDiseaseSheet;
