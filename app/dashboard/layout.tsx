import DashboardNavbar from "@/components/navigation/DashboardNavbar";
import DashboardSidebar from "@/components/navigation/DashboardSidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="flex w-full h-screen">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardNavbar />
          <div className="flex flex-col flex-1 p-4 bg-slate-50 overflow-auto">
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardLayout;
