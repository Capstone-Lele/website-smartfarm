"use client";
import React, { useEffect, Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import DefaultCard from "@/components/card/default-card";
import { useSearchParams } from "next/navigation";
import { usePoolById } from "@/lib/api/service/pools/usePool";
import { formatDate } from "@/lib/utils/format-date";
import { Badge } from "@/components/ui/badge";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";
import { useBreadcrumbStore } from "@/lib/store/useBreadcrumbStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MortalityTable from "./_mortality/table";
import { MortalityBarChart } from "./_mortality/chart";
import MovePoolTable from "./_move-pool/table";
import { MovePoolBarChart } from "./_move-pool/chart";

function QuarantinePageContent() {
  const searchParams = useSearchParams();

  const poolId = searchParams.get("poolId") || "";
  const cycleId = searchParams.get("cycleId") || ""; // In quarantine, cycleId acts as the quarantine pool id

  // We fetch the main pool data or the quarantine pool data
  const { data: quarantinePoolData } = usePoolById(cycleId);
  const { setLabel, removeLabel } = useBreadcrumbStore();

  const quarantinePool = quarantinePoolData || {} as any; // Using cycleId because row.original.id was passed here

  useEffect(() => {
    if (quarantinePool?.name) {
      setLabel("cycle", `Karantina ${quarantinePool.name}`);
    }
    return () => {
      removeLabel("cycle");
    };
  }, [quarantinePool?.name, setLabel, removeLabel]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profil Siklus (Karantina) */}
          <DefaultCard className="md:col-span-2 px-0">
            <div className="flex flex-row items-center justify-between px-6 pb-4">
              <h3 className="text-base font-bold">Profil Siklus</h3>
              <span className="text-sm text-gray-500">- Umur Siklus</span>
            </div>
            <Separator />
            <div className="px-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Kondisi</span>
                <span className="font-medium text-gray-700">
                  {quarantinePool?.condition || "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Tanggal mulai siklus</span>
                <span className="font-medium text-gray-700">-</span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Tanggal tutup siklus</span>
                <span className="font-medium text-gray-700">-</span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Pembuat siklus</span>
                <span className="font-medium text-gray-700">-</span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Jumlah ikan awal</span>
                <span className="font-medium text-gray-700">-</span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Jumlah ikan saat ini</span>
                <span className="font-medium text-gray-700">
                  {quarantinePool?.currentQuantity?.toLocaleString("id-ID") || "-"}
                </span>
              </div>
            </div>
          </DefaultCard>

          {/* Detail Kolam */}
          <DefaultCard className="px-0">
            <div className="flex justify-between items-center border-b px-6 pb-4">
              <h3 className="text-base font-bold">Detail Kolam</h3>
              <Badge className="" variant={"outline"}>
                {translateCategoryPool(quarantinePool?.category || "quarantine")}
              </Badge>
            </div>
            <div className="px-4 pt-4 pb-4 space-y-2 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Nama</span>
                <span className="font-medium text-gray-700">
                  {quarantinePool?.name || "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Tipe</span>
                <span className="font-medium text-gray-700">
                  {quarantinePool?.diameter ? "Kolam bundar" : "Kolam persegi"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Diameter</span>
                <span className="font-medium text-gray-700">
                  {quarantinePool?.diameter || "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Kedalaman</span>
                <span className="font-medium text-gray-700">
                  {quarantinePool?.height || "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Luas</span>
                <span className="font-medium text-gray-700">
                  {quarantinePool?.diameter
                    ? (
                        Math.PI * Math.pow(parseFloat(quarantinePool.diameter) / 2, 2)
                      ).toFixed(2) + " m²"
                    : quarantinePool?.width && quarantinePool?.length
                      ? (
                          parseFloat(quarantinePool.width) *
                          parseFloat(quarantinePool.length)
                        ).toFixed(2) + " m²"
                      : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Dibuat pada</span>
                <span className="font-medium text-gray-700">
                  {quarantinePool?.createdAt ? formatDate(quarantinePool.createdAt) : "-"}
                </span>
              </div>
            </div>
          </DefaultCard>
        </div>

        {/* Catatan Mortalitas */}
        <DefaultCard className="px-0">
          <Tabs defaultValue="grafik" className="gap-0">
            <div className="border-b px-6 pb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">Catatan Mortalitas</h3>
              <TabsList>
                <TabsTrigger value="grafik">Grafik</TabsTrigger>
                <TabsTrigger value="tabel">Tabel</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="grafik" className="mt-0">
              <div className="px-6 pt-6 pb-6">
                {cycleId ? (
                  <MortalityBarChart cycleId={cycleId} />
                ) : (
                  <p>Data tidak tersedia</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="tabel" className="mt-0">
              <div className="px-6 pt-6 pb-6">
                {cycleId && quarantinePool?.createdAt ? (
                  <MortalityTable
                    cycleId={cycleId}
                    cycleStartDate={quarantinePool?.createdAt}
                  />
                ) : (
                  <p>Data tidak tersedia</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DefaultCard>

        {/* Catatan Pemindahan Kolam */}
        <DefaultCard className="px-0">
          <Tabs defaultValue="grafik" className="gap-0">
            <div className="border-b px-6 pb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">Catatan Pemindahan Kolam</h3>
              <TabsList>
                <TabsTrigger value="grafik">Grafik</TabsTrigger>
                <TabsTrigger value="tabel">Tabel</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="grafik" className="mt-0">
              <div className="px-6 pt-6 pb-6">
                {cycleId ? (
                  <MovePoolBarChart cycleId={cycleId} />
                ) : (
                  <p>Data tidak tersedia</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="tabel" className="mt-0">
              <div className="px-6 pt-6 pb-6">
                {cycleId ? (
                  <MovePoolTable cycleId={cycleId} />
                ) : (
                  <p>Data tidak tersedia</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DefaultCard>
      </div>
    </div>
  );
}

const QuarantinePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuarantinePageContent />
    </Suspense>
  );
};

export default QuarantinePage;
