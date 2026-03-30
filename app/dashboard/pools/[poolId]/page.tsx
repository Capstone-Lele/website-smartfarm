"use client";
import { DataTable } from "@/components/data-table/data-table";
import React, { useEffect } from "react";
import { columnsCycle } from "./column";
import DefaultCard from "@/components/card/default-card";
import { cycles } from "@/lib/constants/dummy-respoonse/cycle";
import { use } from "react";
import useSubNavbarTab from "@/lib/hooks/useSubNavbarTab";
import DetailPoolNavTabs from "../_components/detail-pool-nav-tabs";
import { usePoolById } from "@/lib/api/service/pools/usePool";
import { useBreadcrumbStore } from "@/lib/store/useBreadcrumbStore";

const Page = ({ params }: { params: Promise<{ poolId: string }> }) => {
  const { poolId } = use(params);
  const { setTabComponent } = useSubNavbarTab();
  const { setLabel, removeLabel } = useBreadcrumbStore();
  const { data: poolData } = usePoolById(poolId);

  // Sync pool name ke breadcrumb store
  useEffect(() => {
    if (poolData?.name) setLabel("pool", poolData.name);
    return () => removeLabel("pool");
  }, [poolData?.name, setLabel, removeLabel]);

  useEffect(() => {
    setTabComponent(<DetailPoolNavTabs poolId={poolId} />);
    return () => setTabComponent(null);
  }, [setTabComponent, poolId]);

  return (
    <>
      <DefaultCard>
        <div className="w-full">
          <div>
            <DataTable columns={columnsCycle} data={cycles} />
          </div>
        </div>
      </DefaultCard>
    </>
  );
};

export default Page;
