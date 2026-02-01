"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dataPath from "@/lib/constants/path";

const DashboardSubSidebar = () => {
  const pathname = usePathname();

  // Find the reports section data
  const reportsData = dataPath.find(
    (item) => item.path === "/dashboard/reports",
  );

  if (!reportsData || !reportsData.sub_paths) {
    return null;
  }

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 h-full flex flex-col pt-6">
      <div className="px-6 mb-2">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {reportsData.name}
        </h2>
      </div>
      <nav className="flex flex-col">
        {reportsData.sub_paths.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={index}
              href={item.path}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-slate-900 border-r-2 border-blue-500"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSubSidebar;
