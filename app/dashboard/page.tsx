"use client";
import React from "react";
import DefaultCard from "@/components/card/default-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Label,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { FaFish, FaWater, FaLeaf } from "react-icons/fa";
import { IoFish } from "react-icons/io5";
import { FiShield, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import {
  LuUsersRound,
  LuTrendingUp,
  LuPackage,
  LuWallet,
  LuTrendingDown,
} from "react-icons/lu";
import { Scale } from "lucide-react";
import { useDashboard } from "@/lib/api/service/dashboard/useDashboard";
import { formatDate } from "@/lib/utils/format-date";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { useMemo } from "react";
import {
  useFinanceCommodity,
  useFinanceInventory,
  useFinanceInventorySubmission,
  useFinanceNonInventory,
} from "@/lib/api/service/finance/useFinance";

// ─── Dummy Data ────────────────────────────────────────────────────────────────

const biomassData = [
  { bulan: "Nov", biomass: 420 },
  { bulan: "Des", biomass: 560 },
  { bulan: "Jan", biomass: 710 },
  { bulan: "Feb", biomass: 640 },
  { bulan: "Mar", biomass: 880 },
  { bulan: "Apr", biomass: 950 },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { data: dashboard } = useDashboard();

  const { data: commodityData } = useFinanceCommodity();
  const { data: inventoryData } = useFinanceInventory();
  const { data: inventorySubmissionData } = useFinanceInventorySubmission();
  const { data: nonInventoryData } = useFinanceNonInventory();

  const { totalIncome, totalExpense, netProfit } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const currDate = new Date();
    const firstDayOfMonth = new Date(
      currDate.getFullYear(),
      currDate.getMonth(),
      1,
    ).getTime();
    const lastDayOfMonth = new Date(
      currDate.getFullYear(),
      currDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ).getTime();

    const processData = (arr: any[]) => {
      if (!arr) return;
      arr.forEach((item) => {
        const time = new Date(item.transactionDate).getTime();
        if (time >= firstDayOfMonth && time <= lastDayOfMonth) {
          if (item.transactionType === "grant") return; // exclude hibah/pendanaan
          if (item.type === "in") {
            income += Number(item.totalPrice) || 0;
          } else if (item.type === "out") {
            expense += Number(item.totalPrice) || 0;
          }
        }
      });
    };

    processData(commodityData || []);
    processData(inventoryData || []);
    processData(inventorySubmissionData || []);
    processData(nonInventoryData || []);

    return {
      totalIncome: income,
      totalExpense: expense,
      netProfit: income - expense,
    };
  }, [commodityData, inventoryData, inventorySubmissionData, nonInventoryData]);

  const statCards = [
    {
      title: "Total Kolam",
      value: dashboard?.totalPool || "-",
      sub: "dari 3 jenis kolam",
    },
    {
      title: "Total Benih",
      value: dashboard?.totalSeed || "-",
      sub: "ekor aktif",
    },
    {
      title: "Total Staf",
      value: dashboard?.totalStaff || "-",
      sub: "keseluruhan staff",
    },
    {
      title: "Panen Bulan Ini",
      value: dashboard?.totalHarvestQuantity || "-",
      sub: "",
    },
    {
      title: "Stok Pakan",
      value: dashboard?.totalFood+" kg" || "-",
      sub: "keseluruhan",
    },
    {
      title: "Survival Rate",
      value: dashboard?.survivalRate + " %" || "-",
      sub: "berdasarkan siklus panen",
    },
  ];

  const totalFish =
    (dashboard?.fishPopulation.current || 0) +
    (dashboard?.fishPopulation.mortality || 0) +
    (dashboard?.fishPopulation.quarantine || 0);

  const mortalityData = [
    {
      name: "hidup",
      labelName: "Hidup",
      value: dashboard?.fishPopulation.current || 0,
      fill: "#22c55e",
    },
    {
      name: "mati",
      labelName: "Mati",
      value: dashboard?.fishPopulation.mortality || 0,
      fill: "#ef4444",
    },
    {
      name: "karantina",
      labelName: "Karantina",
      value: dashboard?.fishPopulation.quarantine || 0,
      fill: "#f59e0b",
    },
  ];

  const mortalityConfig = {
    value: { label: "Ekor" },
    hidup: { label: "Hidup", color: "#22c55e" },
    mati: { label: "Mati", color: "#ef4444" },
    karantina: { label: "Karantina", color: "#f59e0b" },
  };
  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Welcome banner */}
      <div className="rounded-sm bg-gradient-to-r from-primary via-blue-500 to-secondary p-5 text-white shadow-md">
        <p className="text-sm font-medium opacity-80">Selamat datang kembali</p>
        <h1 className="text-2xl font-semibold mt-0.5">
          Dashboard SmartFarm Lele
        </h1>
        <p className="text-sm opacity-75 mt-1">
          {formatDate(new Date().toISOString())} . Hari yang baik untuk memantau
          kolam Anda!
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-2 mt-2">
          Ringkasan Finansial (Bulan Ini){" "}
          <span className="text-xs font-normal text-muted-foreground ml-1">
            - Exclude tipe transaksi Hibah/Grant
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="rounded-sm shadow-none border py-0 ">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100/80 text-blue-600 rounded-full">
                <LuTrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium">Pemasukan</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">
                  {formatRupiah(totalIncome)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm shadow-none border py-0 ">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-rose-100/80 text-rose-600 rounded-full">
                <LuTrendingDown size={24} />
              </div>
              <div>
                <p className="text-xs text-rose-600 font-medium">Pengeluaran</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">
                  {formatRupiah(totalExpense)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm shadow-none border py-0 ">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-100/80 text-emerald-600 rounded-full">
                <LuWallet size={24} />
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-medium">
                  Laba / Rugi
                </p>
                <p
                  className={`text-xl font-bold mt-0.5 ${netProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}
                >
                  {formatRupiah(netProfit)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map((card, i) => (
          <Card key={i} className="rounded-sm shadow-none border py-0">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 font-medium">{card.title}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">
                {card.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Biomass trend[ lagi di kerjakan] */}
        <DefaultCard className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Tren Pemberian Pakan (kg)
          </h2>
          <p className="text-xs text-gray-400 mb-4">6 bulan terakhir</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={biomassData}>
              <defs>
                <linearGradient id="biomassGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="bulan"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              />
              <Area
                type="monotone"
                dataKey="biomass"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#biomassGrad)"
                dot={{ r: 4, fill: "#3b82f6" }}
                name="Biomass (kg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </DefaultCard>

        {/* Mortality pie */}
        <DefaultCard>
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Status Populasi Ikan
          </h2>
          <p className="text-xs text-gray-400 mb-2">Seluruh siklus aktif</p>
          <ChartContainer
            config={mortalityConfig}
            className="mx-auto aspect-[4/3] max-h-[220px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={mortalityData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={2}
                paddingAngle={3}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalFish.toLocaleString("id-ID")}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-xs"
                          >
                            Total Populasi
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-xs"
              />
            </PieChart>
          </ChartContainer>
        </DefaultCard>
      </div>
    </div>
  );
};

export default DashboardPage;
