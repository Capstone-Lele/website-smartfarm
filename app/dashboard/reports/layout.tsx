import DashboardSubSidebar from "@/components/navigation/DasboardSubSidebar";
import React from "react";

const ReportLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full">
      <DashboardSubSidebar />
      <div className="flex-1 overflow-auto bg-slate-50 p-6">{children}</div>
    </div>
  );
};

export default ReportLayout;
