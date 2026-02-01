"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LuSettings } from "react-icons/lu";

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

const poolDetail = {
  nama: "A1-25",
  tipe: "Kolam bundar",
  diameter: "6 Meter",
  kedalaman: "1 Meter",
  luas: "28,26 Meter",
  dibuat_pada: "29-07-2023",
};

const waterQuality = {
  suhu: { value: 28, status: "Aman", unit: "C" },
  ph: { value: 1, status: "Bahaya", unit: "" },
};

const sidebarItems = [
  { name: "Kolam", active: true },
  { name: "Pakan", active: false },
  { name: "Sampling", active: false },
  { name: "Kematian", active: false },
  { name: "Kualitas Air", active: false },
  { name: "Pindah Kolam", active: false },
];

const CycleDetailPage = () => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Kolam A1-25</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border">
            <span className="text-sm text-gray-500 px-2 bg-gray-100 rounded">
              Kolam
            </span>
            <Select defaultValue="A1-25">
              <SelectTrigger className="w-[120px] border-none shadow-none h-8 p-0 focus:ring-0">
                <SelectValue placeholder="Pilih Kolam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A1-25">A1-25</SelectItem>
                <SelectItem value="A1-26">A1-26</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-md border">
            <span className="text-sm text-gray-500 px-2 bg-gray-100 rounded">
              Siklus
            </span>
            <Select defaultValue="2024-01-15">
              <SelectTrigger className="w-[140px] border-none shadow-none h-8 p-0 focus:ring-0">
                <SelectValue placeholder="Pilih Siklus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01-15">2024-01-15</SelectItem>
                <SelectItem value="2023-08-15">2023-08-15</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
            <LuSettings />
            Pengaturan Kolam
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
              KOLAM
            </h3>
            <div className="flex flex-col space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.name}
                  className={`text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-slate-200 text-slate-900"
                      : "text-gray-600 hover:bg-slate-100"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profil Siklus */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <CardTitle className="text-base font-bold">
                  Profil Siklus
                </CardTitle>
                <span className="text-sm text-gray-500">
                  {cycleProfile.total_hari}
                </span>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Tipe</span>
                  <span className="font-medium text-gray-700">
                    {cycleProfile.tipe}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Tanggal mulai siklus</span>
                  <span className="font-medium text-gray-700">
                    {cycleProfile.tanggal_mulai}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Tanggal tutup siklus</span>
                  <span className="font-medium text-gray-700">
                    {cycleProfile.tanggal_tutup}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Pembuat siklus</span>
                  <span className="font-medium text-gray-700">
                    {cycleProfile.pembuat}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Jumlah ikan awal</span>
                  <span className="font-medium text-gray-700">
                    {cycleProfile.jumlah_awal}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Jumalh ikan saat ini</span>
                  <span className="font-medium text-gray-700">
                    {cycleProfile.jumlah_saat_ini}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Detail Kolam */}
            <Card>
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-base font-bold">
                  Detail Kolam
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-medium text-gray-700">
                    {poolDetail.name || "A1-25"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Tipe</span>
                  <span className="font-medium text-gray-700">
                    {poolDetail.tipe}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Diameter</span>
                  <span className="font-medium text-gray-700">
                    {poolDetail.diameter}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Kedalaman</span>
                  <span className="font-medium text-gray-700">
                    {poolDetail.kedalaman}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Luas</span>
                  <span className="font-medium text-gray-700">
                    {poolDetail.luas}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Dibuat pada</span>
                  <span className="font-medium text-gray-700">
                    {poolDetail.dibuat_pada}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Kualitas Air */}
          <Card>
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-base font-bold">
                Kualitas Air
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
            </CardContent>
          </Card>

          {/* Row 3: Placeholder Empty Card */}
          <Card className="min-h-[200px] border-dashed bg-slate-50/50">
            <CardContent className="h-full flex items-center justify-center text-gray-400 text-sm">
              No Data Available
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CycleDetailPage;
