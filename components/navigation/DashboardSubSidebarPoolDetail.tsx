"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import dataPath from "@/lib/constants/path";

type SubSidebarProps = {
  items: {
    title: string;
    href?: string;
    type: string;
  }[];
};

const DashboardSubSidebarPoolDetail = ({ items }: SubSidebarProps) => {
  console.log("items", items);
  const pathname = usePathname();
  const params = useParams();
  // Handle cycleId
  const cycleId = Array.isArray(params.cycleId) ? params.cycleId[0] : params.cycleId;
  const poolId = Array.isArray(params.poolId)
    ? params.poolId[0]
    : params.poolId;

  return (
    <aside className="w-48 bg-white border-r border-slate-200 h-full flex flex-col pt-6">
      <nav className="flex w-full h-full flex-col">
        {items.map((item, index) => {
          // handle dynamic href replacement for cycleId
          const actualHref =
            item.href?.replace("[cycleId]", cycleId || "")
              .replace("[poolId]", poolId || "") || "#";
          const isActive = pathname === actualHref;

          return item.type === "title" ? (
            <div key={index} className="pl-4 mb-2">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {item.title}
              </h2>
            </div>
          ) : item.type === "menu" ? (
            <Link
              key={index}
              href={actualHref || "#"}
              className={`pl-8 w-full py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-surface text-slate-900 border-r-2 border-primary"
                  : "text-slate-600 hover:bg-primary-surface hover:text-slate-900"
              }`}
            >
              {item.title}
            </Link>
          ) : null;
        })}
      </nav>
    </aside>
  );
};

export default DashboardSubSidebarPoolDetail;
