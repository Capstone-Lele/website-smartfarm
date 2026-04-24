"use client";

import React, { useMemo } from "react";
import {
  LuTrendingUp,
  LuTrendingDown,
  LuCoins,
  LuBanknote,
  LuGift,
  LuShoppingCart,
} from "react-icons/lu";
import { CardStatisticReport } from "@/components/card/card-statistic-report";
import DefaultCard from "@/components/card/default-card";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { InventoryDetail, Inventory, InventoryDetailByParam } from "@/types/inventory";

interface InventoryPriceAnalysisProps {
  details: InventoryDetail[];
  currentInventory: InventoryDetailByParam | undefined;
}

export const InventoryPriceAnalysis: React.FC<InventoryPriceAnalysisProps> = ({
  details,
  currentInventory,
}) => {
  const { grantMetrics, nonGrantMetrics } = useMemo(() => {
    // Filter only "in" and has price
    const inDetails = details.filter(
      (d) =>
        d.type === "in" &&
        d.pricePerItem !== null &&
        typeof d.pricePerItem !== "undefined",
    );
    const grantDetails = inDetails.filter((d) => d.transactionType === "grant");
    const nonGrantDetails = inDetails.filter(
      (d) => d.transactionType === "non-grant",
    );

    const calculateMetrics = (items: InventoryDetail[]) => {
      if (items.length === 0) {
        return { average: 0, highest: 0, lowest: 0, count: 0 };
      }

      let totalCost = 0;
      let totalQty = 0;
      let highest = Number(items[0].pricePerItem);
      let lowest = Number(items[0].pricePerItem);

      items.forEach((item) => {
        const p = Number(item.pricePerItem);
        const q = Number(item.quantity) || 0;
        totalCost += p * q;
        totalQty += q;

        if (p > highest) highest = p;
        if (p < lowest) lowest = p;
      });

      const average = totalQty > 0 ? totalCost / totalQty : 0;
      return { average, highest, lowest, count: items.length };
    };

    return {
      grantMetrics: calculateMetrics(grantDetails),
      nonGrantMetrics: calculateMetrics(nonGrantDetails),
    };
  }, [details]);

  const currentStock = currentInventory
    ? Number(currentInventory.totalQuantity)
    : 0;

  // Calculate Valuation
  const grantValuation = currentStock * grantMetrics.average;
  const nonGrantValuation = currentStock * nonGrantMetrics.average;

  return (
    <div className="grid grid-cols-1  gap-4">
      {/* Non-Grant Analysis */}
      <DefaultCard>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-semibold leading-tight">
            Analisis Harga Pembelian (Non-Grant)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardStatisticReport
            icon={<LuCoins className="w-5 h-5" />}
            title="Harga Rata-rata"
            value={formatRupiah(
              nonGrantMetrics.count > 0 ? nonGrantMetrics.average : 0,
            )}
            subTitle="Total harga / Total kuantitas"
          />
          <CardStatisticReport
            icon={<LuBanknote className="w-5 h-5 text-emerald-600" />}
            title="Valuasi Stok Saat Ini"
            value={formatRupiah(
              nonGrantMetrics.count > 0 ? nonGrantValuation : 0,
            )}
            subTitle="Harga rata-rata x Stok saat ini"
          />
          <CardStatisticReport
            icon={<LuTrendingUp className="w-5 h-5 text-red-500" />}
            title="Harga Tertinggi"
            value={formatRupiah(
              nonGrantMetrics.count > 0 ? nonGrantMetrics.highest : 0,
            )}
            subTitle="Harga tertinggi dari riwayat masuk"
          />
          <CardStatisticReport
            icon={<LuTrendingDown className="w-5 h-5 text-green-500" />}
            title="Harga Terendah"
            value={formatRupiah(
              nonGrantMetrics.count > 0 ? nonGrantMetrics.lowest : 0,
            )}
            subTitle="Harga terendah dari riwayat masuk"
          />
        </div>
      </DefaultCard>

      {/* Grant Analysis */}
      <DefaultCard>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-semibold leading-tight">
            Analisis Harga Perkiraan (Grant)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardStatisticReport
            icon={<LuCoins className="w-5 h-5" />}
            title="Harga Rata-rata"
            value={formatRupiah(
              grantMetrics.count > 0 ? grantMetrics.average : 0,
            )}
            subTitle="Total harga / Total kuantitas"
          />
          <CardStatisticReport
            icon={<LuBanknote className="w-5 h-5 text-emerald-600" />}
            title="Valuasi Stok Saat Ini"
            value={formatRupiah(grantMetrics.count > 0 ? grantValuation : 0)}
            subTitle="Harga rata-rata x Stok saat ini"
          />
          <CardStatisticReport
            icon={<LuTrendingUp className="w-5 h-5 text-red-500" />}
            title="Harga Tertinggi"
            value={formatRupiah(
              grantMetrics.count > 0 ? grantMetrics.highest : 0,
            )}
            subTitle="Harga tertinggi dari riwayat masuk"
          />
          <CardStatisticReport
            icon={<LuTrendingDown className="w-5 h-5 text-green-500" />}
            title="Harga Terendah"
            value={formatRupiah(
              grantMetrics.count > 0 ? grantMetrics.lowest : 0,
            )}
            subTitle="Harga terendah dari riwayat masuk"
          />
        </div>
      </DefaultCard>
    </div>
  );
};
