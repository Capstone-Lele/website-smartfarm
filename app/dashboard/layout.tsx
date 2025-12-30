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
          <div className="flex flex-1">{children}</div>
        </div>
      </main>
    </>
  );
};

export default DashboardLayout;
