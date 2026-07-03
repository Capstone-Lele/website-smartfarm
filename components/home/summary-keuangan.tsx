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
import { ArrowDownIcon, ArrowUpIcon, ActivityIcon } from "lucide-react";
import {
  usePublicFinanceCommodity,
  usePublicFinanceInventory,
  usePublicFinanceInventorySubmission,
  usePublicFinanceNonInventory,
} from "@/lib/api/service/guest/useGuest";
import { Finance } from "@/types/finance/finance";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

type TrendDataPoint = {
  date: string;
  sortKey: string;
  income: number;
  expense: number;
};

export function HomeSummaryKeuangan() {
  const { data: commodityData } = usePublicFinanceCommodity();
  const { data: inventoryData } = usePublicFinanceInventory();
  const { data: inventorySubmissionData } = usePublicFinanceInventorySubmission();
  const { data: nonInventoryData } = usePublicFinanceNonInventory();

  const allData = useMemo<Finance[]>(() => {
    const merged: Finance[] = [];

    commodityData?.forEach((item) => {
      merged.push({
        id: item.id,
        transactionDate: item.transactionDate,
        sourceId: item.sourceId,
        type: item.type,
        transactionSource: item.transactionSource,
        transactionType: "-",
        productCategory: "-",
        product: "-",
        notes: item.notes,
        totalPrice: item.totalPrice,
        createdAt: item.createdAt,
        referenceId: item.referenceId,
        referenceTransactionSourceId: item.referenceTransactionSourceId,
      });
    });

    inventoryData?.forEach((item) => {
      merged.push({
        id: item.id,
        transactionDate: item.transactionDate,
        sourceId: item.sourceId,
        type: item.type,
        transactionSource: item.transactionSource,
        productCategory: item.productCategory,
        product: item.product,
        transactionType: item.transactionType || undefined,
        notes: item.notes,
        totalPrice: item.totalPrice,
        createdAt: item.createdAt,
        referenceId: item.referenceId,
        referenceTransactionSourceId: item.referenceTransactionSourceId,
      });
    });

    inventorySubmissionData?.forEach((item) => {
      merged.push({
        id: item.id,
        transactionDate: item.transactionDate,
        sourceId: item.sourceId,
        type: item.type,
        transactionSource: item.transactionSource,
        productCategory: item.productCategory,
        product: item.product,
        transactionType: item.transactionType || undefined,
        notes: item.notes,
        totalPrice: item.totalPrice,
        createdAt: item.createdAt,
        referenceId: item.referenceId,
        referenceTransactionSourceId: item.referenceTransactionSourceId,
      });
    });

    nonInventoryData?.forEach((item) => {
      merged.push({
        id: item.id,
        transactionDate: item.transactionDate,
        sourceId: item.sourceId,
        type: item.type,
        transactionSource: "non_inventory",
        productCategory: item.productCategory,
        product: item.product,
        transactionType: item.transactionType,
        notes: item.notes,
        totalPrice: item.totalPrice || 0,
        createdAt: item.createdAt,
        referenceId: item.referenceId,
        referenceTransactionSourceId: item.referenceTransactionSourceId,
      });
    });

    return merged;
  }, [commodityData, inventoryData, inventorySubmissionData, nonInventoryData]);

  const activeData = useMemo(() => {
    const reversedSourceIds = new Set(
      allData
        .filter(
          (item) =>
            item.type?.toLowerCase() === "reversal" &&
            item.referenceTransactionSourceId,
        )
        .map((item) => item.referenceTransactionSourceId),
    );

    return allData.filter((item) => {
      if (item.type?.toLowerCase() === "reversal") return false;
      if (item.sourceId && reversedSourceIds.has(item.sourceId)) return false;
      return true;
    });
  }, [allData]);

  const { totalIncome, totalExpense, totalTransactions } = useMemo(() => {
    let income = 0;
    let expense = 0;

    activeData.forEach((item) => {
      if (item.transactionType === "grant") return;
      if (item.type === "in" || item.type === "IN") {
        income += item.totalPrice || 0;
      } else if (item.type === "out" || item.type === "OUT") {
        expense += item.totalPrice || 0;
      }
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      totalTransactions: activeData.length,
    };
  }, [activeData]);

  const trendData = useMemo<TrendDataPoint[]>(() => {
    const grouped: Record<string, TrendDataPoint> = {};

    activeData.forEach((item) => {
      try {
        const parsed = new Date(item.transactionDate);
        const sortKey = format(parsed, "yyyy-MM");
        const displayDate = format(parsed, "MMM yyyy", { locale: localeId });
        const amount = item.totalPrice || 0;

        if (!grouped[sortKey]) {
          grouped[sortKey] = { date: displayDate, sortKey, income: 0, expense: 0 };
        }

        if (item.type === "in" || item.type === "IN") {
          grouped[sortKey].income += amount;
        } else if (item.type === "out" || item.type === "OUT") {
          grouped[sortKey].expense += amount;
        }
      } catch {
        // skip invalid dates
      }
    });

    return Object.values(grouped).sort((a, b) =>
      a.sortKey.localeCompare(b.sortKey),
    );
  }, [activeData]);

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
                Total Pemasukan
              </CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatRupiah(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Berasal dari hasil panen dan sumber lainnya
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col border shadow-sm rounded-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pengeluaran
              </CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatRupiah(totalExpense)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Biaya pakan, inventaris &amp; operasional
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
              <div className="text-2xl font-semibold">
                {totalTransactions}{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  transaksi
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total seluruh data transaksi tercatat
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full shadow-sm rounded-sm">
          <CardHeader>
            <CardTitle>Tren Arus Kas</CardTitle>
            <CardDescription>
              Representasi visual pemasukan vs pengeluaran per bulan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              {trendData.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <span className="text-sm">Belum ada data arus kas</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
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
                      tickFormatter={(value) =>
                        value >= 1e6
                          ? `Rp ${(value / 1e6).toFixed(1)}Jt`
                          : value >= 1e3
                          ? `Rp ${(value / 1e3).toFixed(1)}Rb`
                          : `Rp ${value}`
                      }
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
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default HomeSummaryKeuangan;
