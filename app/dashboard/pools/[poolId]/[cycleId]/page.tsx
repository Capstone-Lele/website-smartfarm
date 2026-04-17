"use client";
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import DefaultCard from "@/components/card/default-card";
import { useParams } from "next/navigation";
import { usePoolById } from "@/lib/api/service/pools/usePool";
import { formatDate } from "@/lib/utils/format-date";
import { Badge } from "@/components/ui/badge";
import { translateCategoryPool } from "@/lib/utils/translate-category-pool";
import { useBreadcrumbStore } from "@/lib/store/useBreadcrumbStore";
import { useDetailCycle } from "@/lib/api/service/cycles/useCycle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SamplingTable from "./_sampling/table";
import { SamplingChartLineLabel } from "./_sampling/chart";
import MortalityTable from "./_mortality/table";
import { MortalityBarChart } from "./_mortality/chart";
import FeedingTable from "./_feeding/table";
import { FeedingLineChart } from "./_feeding/chart";
import MovePoolTable from "./_move-pool/table";
import { MovePoolBarChart } from "./_move-pool/chart";
import { ALL_CYCLE_CONDITIONS } from "@/lib/constants/condition";

// Dummy data for the view
const cycleProfile = {
  tipe: "Pembesaran",
  tanggal_mulai: "15-01-2024",
  tanggal_tutup: "-",
  pembuat: "AMIRUL",
  jumlah_awal: 1000,
  jumlah_saat_ini: 800,
  total_hari: "26 Hari Total",
};

const waterQuality = {
  suhu: { value: 28, status: "Aman", unit: "C" },
  ph: { value: 1, status: "Bahaya", unit: "" },
};

const CycleDetailPage = () => {
  const params = useParams();

  const cycleId = Array.isArray(params.cycleId)
    ? params.cycleId[0]
    : params.cycleId;
  const poolId = Array.isArray(params.poolId)
    ? params.poolId[0]
    : params.poolId;
  const { data: poolData } = usePoolById(poolId || "");
  const { data: cycleDetailData } = useDetailCycle(cycleId || "");
  const { setLabel, removeLabel } = useBreadcrumbStore();

  const cycleData = cycleDetailData?.data?.[0];
  const startDate = cycleData?.startDate;
  const endDate = cycleData?.endDate;

  let umur = "-";
  if (startDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    umur = `${diffDays >= 0 ? diffDays : 0} Hari`;
  }

  // Sync pool name & cycle name ke breadcrumb store
  useEffect(() => {
    if (poolData?.name) setLabel("pool", poolData.name);
    const cycleDetail = cycleDetailData?.data?.[0];
    if (cycleDetail?.startDate) {
      setLabel("cycle", `Siklus ${formatDate(cycleDetail.startDate)}`);
    }
    return () => {
      removeLabel("pool");
      removeLabel("cycle");
    };
  }, [poolData?.name, cycleDetailData, setLabel, removeLabel]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profil Siklus */}
          <DefaultCard className="md:col-span-2 px-0">
            <div className="flex flex-row items-center justify-between px-6 pb-4">
              <h3 className="text-base font-bold">Profil Siklus</h3>
              <span className="text-sm text-gray-500">{umur} Umur Siklus</span>
            </div>
            <Separator />
            <div className="px-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Kondisi</span>
                <span className="font-medium text-gray-700">
                  {ALL_CYCLE_CONDITIONS.find(
                    (c) =>
                      c.value === cycleData?.condition ||
                      c.label === cycleData?.condition,
                  )?.label ||
                    cycleData?.condition ||
                    "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Tanggal mulai siklus</span>
                <span className="font-medium text-gray-700">
                  {startDate ? formatDate(startDate) : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Tanggal tutup siklus</span>
                <span className="font-medium text-gray-700">
                  {endDate ? formatDate(endDate) : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Pembuat siklus</span>
                <span className="font-medium text-gray-700">
                  {cycleData?.user || "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Jumlah ikan awal</span>
                <span className="font-medium text-gray-700">
                  {cycleData?.initialQuantity?.toLocaleString("id-ID") || "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Jumlah ikan saat ini</span>
                <span className="font-medium text-gray-700">
                  {cycleData?.currentQuantity?.toLocaleString("id-ID") || "-"}
                </span>
              </div>
            </div>
          </DefaultCard>

          {/* Detail Kolam */}
          <DefaultCard className="px-0">
            <div className="flex justify-between items-center border-b px-6 pb-4">
              <h3 className="text-base font-bold">Detail Kolam</h3>
              <Badge className="" variant={"outline"}>
                {translateCategoryPool(poolData?.category || "")}
              </Badge>
            </div>
            <div className="px-4 pt-4 pb-4 space-y-2 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Nama</span>
                <span className="font-medium text-gray-700">
                  {poolData?.name || "A1-25"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Tipe</span>
                <span className="font-medium text-gray-700">
                  {poolData?.diameter ? "Kolam bundar" : "Kolam persegi"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Diameter</span>
                <span className="font-medium text-gray-700">
                  {poolData?.diameter}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Kedalaman</span>
                <span className="font-medium text-gray-700">
                  {poolData?.height}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Luas</span>
                <span className="font-medium text-gray-700">
                  {poolData?.diameter
                    ? (
                        Math.PI * Math.pow(parseFloat(poolData.diameter) / 2, 2)
                      ).toFixed(2) + " m²"
                    : poolData?.width && poolData?.length
                      ? (
                          parseFloat(poolData.width) *
                          parseFloat(poolData.length)
                        ).toFixed(2) + " m²"
                      : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Dibuat pada</span>
                <span className="font-medium text-gray-700">
                  {poolData?.createdAt ? formatDate(poolData.createdAt) : "-"}
                </span>
              </div>
            </div>
          </DefaultCard>
        </div>

        {/* Row 2: Kualitas Air */}
        <DefaultCard className="px-0">
          <div className="pb-2 border-b px-6 pb-4">
            <h3 className="text-base font-bold">Kualitas Air</h3>
          </div>
          <div className="px-6 pt-6 pb-6">
            <div className="flex gap-20">
              <div>
                <p className="text-sm font-semibold mb-1">
                  Suhu ({waterQuality.suhu.unit})
                </p>
                <p className="text-lg">
                  {waterQuality.suhu.value}{" "}
                  <span className="text-green-500 text-sm font-semibold">
                    ({waterQuality.suhu.status})
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">1 Jam yang lalu</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">pH</p>
                <p className="text-lg">
                  {waterQuality.ph.value}{" "}
                  <span className="text-red-500 text-sm font-semibold">
                    ({waterQuality.ph.status})
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">1 Jam yang lalu</p>
              </div>
            </div>
          </div>
        </DefaultCard>

        {/* Row 3: Catatan Sampling */}
        <DefaultCard className="px-0">
          <Tabs defaultValue="grafik" className="gap-0">
            <div className="border-b px-6 pb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">Catatan Sampling</h3>
              <TabsList>
                <TabsTrigger value="grafik">Grafik</TabsTrigger>
                <TabsTrigger value="tabel">Tabel</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="grafik" className="mt-0">
              <div className="px-6 pt-6 pb-6">
                {cycleId ? (
                  <SamplingChartLineLabel cycleId={cycleId} />
                ) : (
                  <p>Data tidak tersedia</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="tabel" className="mt-0">
              <div className="px-6 pt-6 pb-6">
                {cycleId && poolData?.createdAt ? (
                  <SamplingTable
                    cycleId={cycleId}
                    poolCreateDate={poolData?.createdAt}
                  />
                ) : (
                  <p>Data tidak tersedia</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DefaultCard>

        {/* Row 4: Catatan Mortalitas */}
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
                {cycleId && poolData?.createdAt ? (
                  <MortalityTable
                    cycleId={cycleId}
                    cycleStartDate={cycleDetailData?.data?.[0]?.startDate || poolData.createdAt}
                  />
                ) : (
                  <p>Data tidak tersedia</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DefaultCard>

        {/* Row 5: Catatan Pemberian Pakan */}
        <DefaultCard className="px-0">
          <Tabs defaultValue="grafik" className="gap-0">
            <div className="border-b px-6 pb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">Catatan Pemberian Pakan</h3>
              <TabsList>
                <TabsTrigger value="grafik">Grafik</TabsTrigger>
                <TabsTrigger value="tabel">Tabel</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="grafik" className="mt-0">
              <div className="px-6 pt-6 pb-6">
                {cycleId ? (
                  <FeedingLineChart cycleId={cycleId} />
                ) : (
                  <p>Data tidak tersedia</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="tabel" className="mt-0">
              <div className="px-6 pt-6 pb-6">
                {cycleId && cycleData?.startDate ? (
                  <FeedingTable
                    cycleId={cycleId}
                    cycleStartDate={cycleData.startDate}
                  />
                ) : (
                  <p>Data tidak tersedia</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DefaultCard>

        {/* Row 6: Catatan Pemindahan Kolam */}
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
};

export default CycleDetailPage;
