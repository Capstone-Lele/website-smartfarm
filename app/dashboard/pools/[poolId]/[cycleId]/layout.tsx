"use client";
import { use, useEffect } from "react";
import useSubNavbarTab from "@/lib/hooks/useSubNavbarTab";
import DetailPoolNavTabs from "../../_components/detail-pool-nav-tabs";
import DashboardSubSidebarPoolDetail from "@/components/navigation/DashboardSubSidebarPoolDetail";
import { DETAIL_POOL_SIDEBAR_ITEMS } from "@/lib/constants/navigation/sidebar-detail-pool";

interface DetailCycleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ poolId: string; cycleId: string }>;
}

const DetailCycleLayout = ({ children, params }: DetailCycleLayoutProps) => {
  const { poolId, cycleId } = use(params);
  const { setTabComponent } = useSubNavbarTab();

  useEffect(() => {
    setTabComponent(<DetailPoolNavTabs poolId={poolId} cycleId={cycleId} />);
    return () => setTabComponent(null);
  }, [setTabComponent, poolId, cycleId]);

  return (
    <div className="flex flex-col w-full -m-4 h-[calc(100%+2rem)] ">
      <div className="flex h-full -mr-8 rounded-lg bg-white shadow">
        {/* <DashboardSubSidebarPoolDetail items={DETAIL_POOL_SIDEBAR_ITEMS} /> */}
        <div className="flex-1 h-full overflow-auto bg-slate-50 p-4 ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DetailCycleLayout;