"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dataPath from "@/lib/constants/path";
import { items } from "./DashboardSidebar";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type SubSidebarProps = {
  items: {
    title: string;
    href?: string;
    type: string;
  }[];
};

const DashboardSubSidebar = ({ items }: SubSidebarProps) => {
  const pathname = usePathname();

  const SidebarContent = () => (
    <nav className="flex w-full h-full flex-col">
      {items.map((item, index) => {
        const isActive = pathname === item.href;
        return item.type === "title" ? (
          <div key={index} className="pl-4 mb-2 mt-4 md:mt-0 first:mt-0">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {item.title}
            </h2>
          </div>
        ) : item.type === "menu" ? (
          <Link
            key={index}
            href={item.href || "#"}
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
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden flex items-center px-4 pt-3 pb-1 bg-white border-b border-slate-200">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 pt-10">
            <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-slate-800">Menu Reports</span>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-48 bg-white border-r border-slate-200 h-full flex-col pt-6 shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
};

export default DashboardSubSidebar;
