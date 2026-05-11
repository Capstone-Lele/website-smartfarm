"use client";
import { DataTable } from "@/components/data-table/data-table";
import { usePool } from "@/lib/api/service/pools/usePool";
import React, { useEffect, useState } from "react";
import { columnsPool } from "./column";
import PostKolamModal from "./post";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import DefaultCard from "@/components/card/default-card";
import {
  LuCheck,
  LuUserRound,
  LuUsersRound,
  LuTriangleAlert,
} from "react-icons/lu";
import CardStatistic from "@/components/card/card-statistic";
import useSubNavbarTab from "@/lib/hooks/useSubNavbarTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useListCycle } from "@/lib/api/service/cycles/useCycle";
import { Pool } from "@/types/pool.types";
import { columnsPoolQuarantine } from "./_quarantine/column";
import { FaFish, FaWater } from "react-icons/fa";
import { IoFish } from "react-icons/io5";
import { FiShield } from "react-icons/fi";

const page = () => {
  const { data, isLoading, error } = usePool();
  const { setTabComponent } = useSubNavbarTab();
  const [isPoolTab, setIsPoolTab] = useState(true);
  const [dataBudidaya, setDataBudidaya] = useState<Pool[]>([]);
  const [dataKarantina, setDataKarantina] = useState<Pool[]>([]);

  const cardData = [
    {
      title: "Total Kolam",
      value: data?.data.length.toString(),
      icon: <FaWater />,
    },
    {
      title: "Kolam Pembesaran",
      value: data?.data
        .filter((user) => user.category === "growing")
        .length.toString(),
      icon: <IoFish />,
    },
    {
      title: "Kolam Pembibitan",
      value: data?.data
        .filter((user) => user.category === "breeding")
        .length.toString(),
      icon: <FaFish />,
    },
    {
      title: "Kolam Karantina",
      value: data?.data
        .filter((user) => user.category === "quarantine")
        .length.toString(),
      icon: <FiShield />,
    },
  ];

  useEffect(() => {
    if (data) {
      console.log("Kolam Data:", data);
      const dB = data.data.filter((pool) => pool.category !== "quarantine");
      const dK = data.data.filter((pool) => pool.category === "quarantine");
      setDataBudidaya(dB);
      setDataKarantina(dK);

      console.log("Kolam Budidaya:", dB);
      console.log("Kolam Karantina:", dK);
    }
    if (error) {
      console.error("Error fetching kolam:", error);
    }
  }, [data, error]);

  useEffect(() => {
    setTabComponent(
      <Tabs
        defaultValue="pool"
        value={isPoolTab ? "pool" : "information"}
        onValueChange={(value) => setIsPoolTab(value === "pool")}
        className="w-fit"
      >
        <TabsList>
          <TabsTrigger value="pool">Kolam</TabsTrigger>
          <TabsTrigger value="information">Informasi</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    // Cleanup on unmount
    return () => setTabComponent(null);
  }, [setTabComponent, isPoolTab]);

  return (
    <div className="">
      {isPoolTab ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 w-full">
            {cardData.map((card, index) => (
              <CardStatistic
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
              />
            ))}
          </div>
          <DefaultCard>
            <div className="w-full">
              <Tabs defaultValue="budidaya" className="">
                <TabsList>
                  <TabsTrigger value="budidaya">Kolam Budidaya</TabsTrigger>
                  <TabsTrigger value="karantina">Kolam Karantina</TabsTrigger>
                </TabsList>
                <TabsContent value="budidaya">
                  <>
                    {isLoading ? (
                      <TableSkeleton columns={6} rows={8} />
                    ) : (
                      <div>
                        <div className="flex justify-end">
                          <PostKolamModal dataPool={data?.data || []} />
                        </div>
                        <DataTable
                          columns={columnsPool}
                          data={dataBudidaya || []}
                          // facetedFilter={exampleFilter}
                        />
                      </div>
                    )}
                  </>
                </TabsContent>
                <TabsContent value="karantina">
                  <>
                    {isLoading ? (
                      <TableSkeleton columns={6} rows={8} />
                    ) : (
                      <div>
                        <div className="flex justify-end">
                          <PostKolamModal dataPool={data?.data || []} />
                        </div>
                        <DataTable
                          columns={columnsPoolQuarantine}
                          data={dataKarantina || []}
                          // facetedFilter={exampleFilter}
                        />
                      </div>
                    )}
                  </>
                </TabsContent>
              </Tabs>
            </div>
          </DefaultCard>
        </>
      ) : (
        <DefaultCard className="">
          <div>
            <h1 className=" font-medium text-lg">
              Informasi Alur Kolam Budidaya
            </h1>
            <span className="mt-2 text-gray-600">
              Panduan legkap mengenai siklus dan perpindahan kolam budidaya
              ikan.
            </span>
          </div>
          <Tabs defaultValue="cycle" className="gap-1">
            <Separator className="my-4" />
            <TabsList>
              <TabsTrigger value="cycle">Siklus Kolam</TabsTrigger>
              <TabsTrigger value="move">Peraturan Perpindahan</TabsTrigger>
              <TabsTrigger value="density">Kepadatan Kolam</TabsTrigger>
            </TabsList>
            <Separator className="my-4" />
            <TabsContent value="cycle">
              <div className="flex flex-col gap-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-semibold text-gray-800 text-lg border-b border-gray-200 pb-2 mb-3">
                    Kolam Pembesaran
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="font-medium text-gray-800">
                        Ketika kondisi siklus: Panen
                      </p>
                      <p className="text-gray-600">
                        Maka kondisi kolam: Stand By (tidak terpakai)
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Ketika kondisi siklus: Aktif Budidaya
                      </p>
                      <p className="text-gray-600">
                        Maka kondisi kolam: Aktif Budidaya (sedang terpakai)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-semibold text-gray-800 text-lg border-b border-gray-200 pb-2 mb-3">
                    Kolam Pembenihan
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="font-medium text-gray-800">
                        Ketika kondisi siklus: Pindah
                      </p>
                      <p className="text-gray-600">
                        Maka kondisi kolam: Stand By (tidak terpakai)
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Ketika kondisi siklus: Aktif Budidaya
                      </p>
                      <p className="text-gray-600">
                        Maka kondisi kolam: Aktif Budidaya (sedang terpakai)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-semibold text-gray-800 text-lg border-b border-gray-200 pb-2 mb-3">
                    Kolam Karantina
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="font-medium text-gray-800">
                        Ketika kolam: Kosong (tidak ada ikan)
                      </p>
                      <p className="text-gray-600">
                        Maka kondisi kolam: Stand By
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Ketika kolam: Ada ikan
                      </p>
                      <p className="text-gray-600">
                        Maka kondisi kolam: Perawatan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="move">
              <div className="flex flex-col gap-4">
                <div className="border border-gray-200 rounded-md flex items-start p-4 gap-4">
                  <div className="rounded-full bg-[#20c960] p-1.5 shrink-0 mt-0.5">
                    <LuCheck className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Pembenihan {`-->`} Pembesaran
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Ikan di kolam pembenihan dapat berpindah ke kolam
                      pembesaran
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md flex items-start p-4 gap-4">
                  <div className="rounded-full bg-[#20c960] p-1.5 shrink-0 mt-0.5">
                    <LuCheck className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Pembenihan {`<-->`} Karantina
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Ikan di kolam pembenihan dapat berpindah ke kolam
                      karantina <br />
                      Ikan di kolam karantina dapat berpindah ke kolam
                      pembenihan
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md flex items-start p-4 gap-4">
                  <div className="rounded-full bg-[#20c960] p-1.5 shrink-0 mt-0.5">
                    <LuCheck className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Pembesaran {`<-->`} Karantina
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Ikan di kolam pembesaran dapat berpindah ke kolam
                      karantina <br />
                      Ikan di kolam karantina dapat berpindah ke kolam
                      pembesaran
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="density">
              <div className="flex flex-col gap-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-semibold text-gray-800 text-lg border-b border-gray-200 pb-2 mb-3">
                    Sistem Peringatan Kepadatan
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start p-2 gap-4">
                      <div className="rounded-full bg-[#20c960] p-1.5 shrink-0 mt-0.5">
                        <LuCheck className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {`<=`} 250 Ekor/m³ (Batas Aman)
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Kepadatan dalam batas aman sistem intensif.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-2 gap-4">
                      <div className="rounded-full bg-red-500 p-1.5 shrink-0 mt-0.5">
                        <LuTriangleAlert className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {`>`} 250 Ekor/m³ (Overload)
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Peringatan: Kepadatan melebihi batas overload.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DefaultCard>
      )}
    </div>
  );
};

export default page;
