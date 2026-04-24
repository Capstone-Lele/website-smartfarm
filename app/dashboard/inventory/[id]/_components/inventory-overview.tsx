"use client";

import React from "react";
import { InventoryPriceAnalysis } from "./inventory-price-analysis";
import InventoryStockTrendChart from "./inventory-stock-trend-chart";
import { InventoryDetail, Inventory, InventoryDetailByParam } from "@/types/inventory";

interface InventoryOverviewProps {
  details: InventoryDetail[];
  currentInventory: InventoryDetailByParam | undefined;
}

export const InventoryOverview: React.FC<InventoryOverviewProps> = ({
  details,
  currentInventory,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <InventoryPriceAnalysis
        details={details}
        currentInventory={currentInventory}
      />
      <InventoryStockTrendChart
        details={details}
        unit={currentInventory?.unit ?? ""}
      />
    </div>
  );
};
