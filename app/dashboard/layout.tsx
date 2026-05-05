import DashboardNavbar from "@/components/navigation/DashboardNavbar";
import DashboardSidebar from "@/components/navigation/DashboardSidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 w-full overflow-hidden bg-slate-50">
      <main className="flex relative w-full h-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col h-full overflow-hidden w-full">
          <DashboardNavbar />
          <div className="flex flex-col flex-1 p-4 md:p-6 overflow-y-auto overscroll-none">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
