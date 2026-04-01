"use client";
import useSubNavbarTab from "@/lib/hooks/useSubNavbarTab";
import React, { useEffect, use } from "react";
import CardStatistic from "@/components/card/card-statistic";
import DefaultCard from "@/components/card/default-card";
import { LuUserRound, LuUsersRound } from "react-icons/lu";
import { useInventory } from "@/lib/api/service/inventory/useInventory";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { DataTable } from "@/components/data-table/data-table";
import InventoryNavTabs from "../_components/inventory-nav-tabs";
import { columns } from "./column";
import PostStockInOut from "./post";
import { useBreadcrumbStore } from "@/lib/store/useBreadcrumbStore";
import { dummyInventoryDetails } from "@/lib/constants/dummy-respoonse/inventaris";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { setTabComponent } = useSubNavbarTab();
  const { setLabel, removeLabel } = useBreadcrumbStore();
  const { data: inventoryData } = useInventory();

  useEffect(() => {
    if (inventoryData?.data) {
      const inventory = inventoryData.data.find((item) => item.productId === id);
      if (inventory?.product) {
        setLabel("inventory", inventory.product);
      }
    }
    return () => removeLabel("inventory");
  }, [inventoryData?.data, id, setLabel, removeLabel]);


  const cardData = [
    {
      title: "Total Produk Inventaris",
      value: "0",
      icon: <LuUsersRound />,
    },
    {
      title: "Total Stok Keseluruhan",
      value: "0",
      icon: <LuUserRound />,
    },
    {
      title: "Produk di Bawah Stok Minimum",
      value: "0",
      icon: <LuUserRound />,
    },
    {
      title: "Produk Habis",
      value: "0",
      icon: <LuUserRound />,
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
      <DefaultCard>
        <div className="w-full">
          {/* {isLoading ? (
            <TableSkeleton />
          ) : ( */}
          <div>
            <div className="flex justify-end">
              <PostStockInOut />
            </div>
            <DataTable columns={columns} data={dummyInventoryDetails} />
          </div>
          {/* )} */}
        </div>
      </DefaultCard>
    </div>
  );
};

export default Page;
