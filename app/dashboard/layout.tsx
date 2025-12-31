import DashboardNavbar from "@/components/navigation/DashboardNavbar";
import DashboardSidebar from "@/components/navigation/DashboardSidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="flex w-full h-screen">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardNavbar />
          <div className="flex flex-1 p-4 bg-slate-50">
            <div className="border p-4 rounded-md w-full bg-white">{children}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardLayout;
