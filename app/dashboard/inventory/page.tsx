"use client";
import useSubNavbarTab from "@/lib/hooks/useSubNavbarTab";
import React, { useEffect } from "react";
import InventoryNavTabs from "./_components/inventory-nav-tabs";
import CardStatistic from "@/components/card/card-statistic";
import DefaultCard from "@/components/card/default-card";
import { LuPackage, LuUserRound, LuUsersRound } from "react-icons/lu";
import { ChartBarStacked } from "./chart-persediaan";
import { ChartPie } from "./chart-penggunaan";
import { useInventory } from "@/lib/api/service/inventory/useInventory";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./column";
import PostInventoryModal from "./post";
import { useGetProductUsage } from "@/lib/api/service/master-data/product/useProduct";

const Page = () => {
  const { setTabComponent } = useSubNavbarTab();
  const { data, isLoading } = useInventory();
  const { data: usageData, isLoading: isUsageLoading } = useGetProductUsage();

  useEffect(() => {
    setTabComponent(<InventoryNavTabs />);
    return () => setTabComponent(null);
  }, [setTabComponent]);

  const cardData = [
    {
      title: "Total Produk Inventaris",
      value: data?.data.length.toString() || "0",
      icon: <LuPackage />,
    },
    {
      title: "Total Stok Keseluruhan",
      value:
        data?.data
          .reduce((total, item) => total + parseInt(item.totalQuantity), 0)
          .toString() || "0",
      icon: <LuPackage className="text-primary" />,
    },
    {
      title: "Produk di Bawah Stok Minimum",
      value:
        data?.data
          .filter(
            (item) => parseInt(item.totalQuantity) < parseInt(item.minQuantity),
          )
          .length.toString() || "0",
      icon: <LuPackage className="text-yellow-500" />,
    },
    {
      title: "Produk Habis",
      value:
        data?.data
          .filter((item) => parseInt(item.totalQuantity) === 0)
          .length.toString() || "0",
      icon: <LuPackage className="text-red-500" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {cardData.map((card, index) => (
          <CardStatistic
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ChartBarStacked data={data?.data} isLoading={isLoading} />
        <ChartPie data={usageData?.data} isLoading={isUsageLoading} />
      </div>
      <DefaultCard>
        <div className="w-full">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div>
              <div className="flex justify-end">
                <PostInventoryModal />
              </div>
              <DataTable columns={columns} data={data?.data || []} />
            </div>
          )}
        </div>
      </DefaultCard>
    </div>
  );
};

export default Page;
