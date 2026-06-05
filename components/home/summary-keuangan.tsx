"use client";

import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  WalletIcon,
  ActivityIcon,
} from "lucide-react";

// Dummy Data untuk grafik tren arus kas tanpa menunjukkan laba/rugi total
const dummyTrendData = [
  { date: "Maret", income: 15400000, expense: 8200000 },
  { date: "April", income: 12500000, expense: 9100000 },
  { date: "Mei", income: 18200000, expense: 11400000 },
  { date: "Juni", income: 14700000, expense: 12100000 },
  { date: "Juli", income: 21000000, expense: 9800000 },
  { date: "Agustus", income: 23500000, expense: 14200000 },
];

export function HomeSummaryKeuangan() {
  const totalIncome = dummyTrendData.reduce(
    (acc, curr) => acc + curr.income,
    0,
  );
  const totalExpense = dummyTrendData.reduce(
    (acc, curr) => acc + curr.expense,
    0,
  );

  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tighter sm:text-4xl md:text-3xl">
              Ringkasan Keuangan
            </h2>
            <p className="max-w-[700px] text-muted-foreground mx-auto">
              Pantau arus kas berdasarkan tipe transaksi reguler.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="flex flex-col border shadow-sm rounded-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pemasukan (Tahun Ini)
              </CardTitle>
              <div className="h-4 w-4 text-emerald-500">
                <ArrowUpIcon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold ">
                {formatRupiah(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Berasal dari hasil panen, dan sumber lainnya
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col border shadow-sm rounded-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pengeluaran (Tahun Ini)
              </CardTitle>
              <div className="h-4 w-4 text-rose-500">
                <ArrowDownIcon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold ">
                {formatRupiah(totalExpense)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Biaya pakan, inventaris & operasional
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col border shadow-sm rounded-sm md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aktivitas Transaksi
              </CardTitle>
              <ActivityIcon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold 0">
                128{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  transaksi
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tercatat pada tahun terakhir
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full shadow-sm rounded-sm">
          <CardHeader>
            <CardTitle>Tren Arus Kas</CardTitle>
            <CardDescription>
              Representasi visual pemasukan vs pengeluaran bulan terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dummyTrendData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorExpense"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    dy={10}
                  />
                  <YAxis
                    tickFormatter={(value) => `Rp ${value / 1000000}JT`}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    width={80}
                  />
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <Tooltip
                    formatter={(value: number) => formatRupiah(value)}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Pemasukan"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Pengeluaran"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default HomeSummaryKeuangan;
