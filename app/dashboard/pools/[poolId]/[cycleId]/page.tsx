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
import { SimpleStatus } from "./_water-quality/simple-status";
import { ParamStatus } from "./_water-quality/param-status";
import { WaterQualityChart } from "./_water-quality/chart";
import { WaterQualityTable } from "./_water-quality/table";
import { useIotByNode } from "@/lib/api/service/iot/useIot";
import { useSocketStore } from "@/lib/store/useSocketStore";
import { calculatePoolVolume } from "@/lib/utils/volume-pool";

const CycleDetailPage = () => {
  const params = useParams();

  const rawCycleId = Array.isArray(params.cycleId)
    ? params.cycleId[0]
    : params.cycleId;
  const cycleId =
    rawCycleId !== "null" && rawCycleId !== "undefined" ? rawCycleId : "";

  const rawPoolId = Array.isArray(params.poolId)
    ? params.poolId[0]
    : params.poolId;
  const poolId =
    rawPoolId !== "null" && rawPoolId !== "undefined" ? rawPoolId : "";

  const { data: poolData } = usePoolById(poolId || "");
  const { data: cycleDetailData } = useDetailCycle(cycleId || "");
  const { setLabel, removeLabel } = useBreadcrumbStore();

  const cycleData = cycleDetailData?.data?.[0];
  const startDate = cycleData?.startDate;
  const endDate = cycleData?.endDate;

  const nodeStr = poolData?.name
    ? parseInt(poolData.name.replace(/\D/g, "")).toString()
    : "";
  const nodeNum = nodeStr ? parseInt(nodeStr) : 0;

  const { data: iotData, isLoading: isLoadingIot } = useIotByNode(nodeStr);

  // WebSocket untuk live data
  const connect = useSocketStore((s) => s.connect);
  const disconnect = useSocketStore((s) => s.disconnect);
  const socket = useSocketStore((s) => s.socket);
  const liveIotData = useSocketStore((s) => (nodeNum ? s.iotData[nodeNum] : null) ?? null);

  const liveTemp = liveIotData?.temp ?? "-";
  const livePh = liveIotData?.ph ?? "-";
  const liveTime = liveIotData?.receivedAt ?? null;

  let umur = "-";
  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    umur = `${diffDays >= 0 ? diffDays : 0} Hari`;
  }

  const volume = calculatePoolVolume({
    height: poolData?.height,
    diameter: poolData?.diameter,
    length: poolData?.length,
    width: poolData?.width,
  });

  const batasKepadatan = volume * 250;
  const currentQuantity = cycleData?.currentQuantity || 0;
  const isAman = currentQuantity <= batasKepadatan;

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    if (!socket || !nodeStr) return;
    socket.emit("join-pool", { nodeId: nodeStr });
  }, [socket, nodeStr]);

  // Sync pool name & cycle name ke breadcrumb store
  useEffect(() => {
    if (poolData?.name) setLabel("pool", poolData.name);
    const cycleDetail = cycleDetailData?.data?.[0];
    if (cycleDetail?.startDate) {
      setLabel("cycle", `Siklus ${formatDate(cycleDetail.startDate)}`);
    } else {
      setLabel("cycle", `Siklus -`);
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Status Kepadatan</span>
                <span
                  className={`font-medium ${
                    isAman ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {volume > 0 ? (isAman ? "Aman" : "Overload") : "-"}
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
                <span className="text-gray-500">Volume</span>
                <span className="font-medium text-gray-700">
                  {volume > 0 ? `${volume.toFixed(2)} m³` : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Batas Kepadatan Aman</span>
                <span className="font-medium text-gray-700">
                  {volume > 0
                    ? `${Math.floor(batasKepadatan).toLocaleString("id-ID")} Ekor`
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

          <DefaultCard className="px-0">
            <div className="border-b px-6 pb-4">
              <h3 className="text-base font-bold">Akses Pengguna</h3>
            </div>
            <div className="px-6 py-4 space-y-4 overflow-auto">
              {poolData?.actor && poolData.actor.length > 0 ? (
                poolData.actor.map((actor, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 border">
                      {actor.image ? (
                        <img
                          src={actor.image}
                          alt={actor.userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-slate-500">
                          {actor.userName
                            ? actor.userName.charAt(0).toUpperCase()
                            : "U"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {actor.userName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {actor.role || "Tidak ada role"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Belum ada pengguna
                </p>
              )}
            </div>
          </DefaultCard>
        </div>

        {poolId && cycleId ? (
          <div className="grid grid-cols-1 gap-6">
            {/* Row 2: Kualitas Air */}
            <DefaultCard className="px-0">
              <Tabs defaultValue="ringkasan" className="gap-0">
                <div className="border-b px-6 pb-4 flex items-center justify-between">
                  <h3 className="text-base font-bold">Kualitas Air</h3>
                  <TabsList>
                    <TabsTrigger value="ringkasan">Status Saat Ini</TabsTrigger>
                    <TabsTrigger value="grafik">Grafik</TabsTrigger>
                    <TabsTrigger value="tabel">Tabel</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="ringkasan" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 w-full">
                    <div className="flex gap-20">
                      <SimpleStatus
                        title="Suhu"
                        value={liveTemp}
                        unit="°C"
                        minArr={poolData?.temperatureMin}
                        maxArr={poolData?.temperatureMax}
                        normalArr={poolData?.temperatureNormal}
                        time={liveTime ? formatDate(liveTime) : "-"}
                      />
                      <SimpleStatus
                        title="pH"
                        value={livePh}
                        unit=""
                        minArr={poolData?.acidityMin}
                        maxArr={poolData?.acidityMax}
                        normalArr={poolData?.acidityNormal}
                        time={liveTime ? formatDate(liveTime) : "-"}
                      />
                    </div>
                    <div className="flex flex-row gap-6 ml-auto border-l pl-10 w-full">
                      <ParamStatus
                        title="Parameter Suhu (°C)"
                        minArr={poolData?.temperatureMin}
                        maxArr={poolData?.temperatureMax}
                        normalArr={poolData?.temperatureNormal}
                      />
                      <ParamStatus
                        title="Parameter pH"
                        minArr={poolData?.acidityMin}
                        maxArr={poolData?.acidityMax}
                        normalArr={poolData?.acidityNormal}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="grafik" className="mt-0">
                  <div className="px-6 pt-6 pb-6 flex flex-col gap-10 max-h-[500px] overflow-y-auto">
                    {iotData ? (
                      <>
                        <WaterQualityChart
                          data={iotData}
                          dataKey="temp"
                          title="Suhu Air (°C)"
                        />
                        <WaterQualityChart
                          data={iotData}
                          dataKey="ph"
                          title="pH Air"
                        />
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Data grafik tidak tersedia
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="tabel" className="mt-0">
                  <div className="px-6 pt-6 pb-6">
                    {iotData || isLoadingIot ? (
                      <WaterQualityTable
                        data={iotData || []}
                        isLoading={isLoadingIot}
                      />
                    ) : (
                      <p className="text-sm text-gray-500">
                        Data tabel tidak tersedia
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
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
                        cycleStartDate={
                          cycleDetailData?.data?.[0]?.startDate ||
                          poolData.createdAt
                        }
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
                  <h3 className="text-base font-bold">
                    Catatan Pemberian Pakan
                  </h3>
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
                  <h3 className="text-base font-bold">
                    Catatan Pemindahan Kolam
                  </h3>
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
        ) : (
          <div className="py-10">
            <p className="text-center text-gray-500">
              Kolam atau siklus tidak ditemukan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CycleDetailPage;
