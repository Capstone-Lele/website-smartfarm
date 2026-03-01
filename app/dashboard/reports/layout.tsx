import DashboardSubSidebar from "@/components/navigation/DasboardSubSidebar";
import { REPORT_SIDEBAR_ITEMS } from "@/lib/constants/navigation/sidebar-notes";
import React from "react";



const ReportLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[calc(100%+2rem)] w-full -m-4 border-b">
      <DashboardSubSidebar items={REPORT_SIDEBAR_ITEMS} />
      <div className="flex-1 h-full overflow-auto bg-slate-50 p-4 -mr-8">
        {children}
      </div>
    </div>
  );
};

export default ReportLayout;
