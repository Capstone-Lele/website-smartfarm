"use client";
import useSubNavbarTab from "@/lib/hooks/useSubNavbarTab";
import React, { useEffect } from "react";
import InventoryNavTabs from "../inventory/_components/inventory-nav-tabs";

const Page = () => {
  const { setTabComponent } = useSubNavbarTab();

  useEffect(() => {
    setTabComponent(<InventoryNavTabs />);
    return () => setTabComponent(null);
  }, [setTabComponent]);

  return <div>{/* Pengajuan content goes here */}</div>;
};

export default Page;
