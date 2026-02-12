import DashboardSubSidebar from "@/components/navigation/DasboardSubSidebar";
import React from "react";

const items = [
  {
    title: "Laporan",
    type: "title",
  },
  {
    title: "Harian",
    href: "/dashboard/reports",
    type: "menu",
  },
  {
    title: "Pakan",
    href: "/dashboard/reports/feeding",
    type: "menu",
  },
  {
    title: "Vitamin",
    href: "/dashboard/reports/vitamin",
    type: "menu",
  },
  {
    title: "Sakit",
    href: "/dashboard/reports/sick",
    type: "menu",
  },
];

const ReportLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[calc(100%+2rem)] w-full -m-4 border-b">
      <DashboardSubSidebar items={items} />
      <div className="flex-1 h-full overflow-auto bg-slate-50 p-4 -mr-8">
        {children}
      </div>
    </div>
  );
};

export default ReportLayout;
