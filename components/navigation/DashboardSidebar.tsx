"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { BiCylinder } from "react-icons/bi";
import { MdOutlineInventory2 } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { LuUsersRound } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { MdOutlineStoreMallDirectory } from "react-icons/md";
import { LuDatabase } from "react-icons/lu";
import useToggleSidebar from "@/lib/hooks/useToggleSidebar";
import { usePathname } from "next/navigation";
import { MdInventory } from "react-icons/md";

export const items = [
  { title: "Menu Utama", type: "title" },
  {
    name: "Beranda",
    icon: <LuLayoutDashboard />,
    href: "/dashboard",
    type: "menu",
  },
  {
    name: "Daftar Kolam",
    icon: <BiCylinder />,
    href: "/dashboard/pools",
    type: "menu",
  },
  {
    name: "Inventaris",
    icon: <MdOutlineInventory2 />,
    href: "/dashboard/inventory",
    type: "menu",
    activePaths: ["/dashboard/inventory", "/dashboard/inventory-submission"],
  },
  {
    name: "Non-Inventaris",
    icon: <MdInventory />,
    href: "/dashboard/non-inventory",
    type: "menu",
  },
  {
    name: "Laporan",
    icon: <TbReportAnalytics />,
    href: "/dashboard/reports",
    type: "menu",
  },
  { title: "Manajemen", type: "title" },
  {
    name: "Pengguna",
    icon: <LuUsersRound />,
    href: "/dashboard/users",
    type: "menu",
  },
  {
    name: "Keuangan",
    icon: <GrMoney />,
    href: "/dashboard/finance",
    type: "menu",
  },
  {
    name: "Komoditas",
    icon: <MdOutlineStoreMallDirectory />,
    href: "/dashboard/commodity",
    type: "menu",
  },
  {
    name: "Master Data",
    icon: <LuDatabase />,
    href: "/dashboard/master-data",
    type: "dropdown",
    subMenuList: [
      { name: "Kategori", href: "/dashboard/master-data/categories" },
      { name: "Produk", href: "/dashboard/master-data/products" },
      { name: "Pembeli", href: "/dashboard/master-data/buyers" },
      { name: "Unit", href: "/dashboard/master-data/units" },
    ],
  },
];

const DashboardSidebar = () => {
  const { isOpen, toggle } = useToggleSidebar();

  return (
    <>
      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggle}
        ></div>
      )}
      <main
        className={`border-r bg-white h-full z-40 absolute md:relative transition-all duration-300 ease-in-out overflow-y-auto ${
          isOpen
            ? "translate-x-0 w-64 p-4"
            : "-translate-x-full md:translate-x-0 md:w-20 w-0 p-0 md:p-4"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-4 my-2">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={35}
            height={35}
            className=" rounded-md"
          />
          <h1
            className={`font-semibold text-2xl transition-opacity duration-300 ${
              !isOpen ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            Dashboard
          </h1>
        </div>
        <nav className=" flex flex-col">
          {items.map((item, index) =>
            item.type === "title" ? (
              <TitleItem key={index} title={item.title!} isOpen={isOpen} />
            ) : item.type === "menu" ? (
              <MenuItem
                key={index}
                name={item.name}
                icon={item.icon}
                href={item.href!}
                isOpen={isOpen}
                activePaths={item.activePaths}
              />
            ) : item.type === "dropdown" ? (
              <DropdownMenuItem
                key={index}
                name={item.name}
                icon={item.icon}
                subMenuList={item.subMenuList!}
                isOpen={isOpen}
                toggle={toggle}
                href={item.href!}
              />
            ) : null,
          )}
        </nav>
      </main>
    </>
  );
};

export default DashboardSidebar;

const TitleItem = ({ title, isOpen }: { title: string; isOpen: boolean }) => {
  return (
    <div className="px-2 -ml-3 mt-2 py-3 h-11 uppercase text-sm font-semibold text-muted-foreground">
      <h1
        className={`transition-opacity duration-300 ${
          !isOpen ? "opacity-0 hidden" : "opacity-100"
        }`}
      >
        {title}
      </h1>
    </div>
  );
};

const MenuItem = ({
  name,
  icon,
  href,
  isOpen,
  activePaths,
}: {
  name: string | undefined;
  icon: React.ReactNode;
  href: string;
  isOpen: boolean;
  activePaths?: string[];
}) => {
  const pathName = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathName === "/dashboard"
      : activePaths
        ? activePaths.some((p) => pathName === p || pathName.startsWith(p + "/"))
        : pathName === href || pathName.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`flex h-10 items-center gap-3 mt-1 cursor-pointer px-3 py-2 rounded-xs hover:bg-primary-surface hover:text-primary ${
        isActive ? "bg-primary-surface text-primary" : ""
      }`}
    >
      <span className="text-xl">{icon}</span>
      <p
        className={`font-semibold transition-opacity duration-300 ${
          !isOpen ? "opacity-0 hidden" : "opacity-100"
        }`}
      >
        {name}
      </p>
    </Link>
  );
};

const DropdownMenuItem = ({
  name,
  icon,
  subMenuList,
  isOpen,
  toggle,
  href,
}: {
  name: string | undefined;
  icon: React.ReactNode;
  subMenuList: Array<{ name: string; href: string }>;
  isOpen: boolean;
  toggle: () => void;
  href: string;
}) => {
  const pathName = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathName === "/dashboard"
      : pathName === href || pathName.startsWith(href + "/");

  return (
    <div
      className="w-full mt-1"
      onClick={() => {
        if (isOpen == false) {
          toggle();
        }
      }}
    >
      <details className="group [&_summary::-webkit-details-marker]:hidden">
        <summary
          className={`flex items-center h-10 justify-between px-3 py-2 rounded-xs cursor-pointer hover:bg-primary-surface hover:text-primary ${isActive ? "bg-primary-surface text-primary" : ""}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <span
              className={`font-semibold transition-opacity duration-300 ${
                !isOpen ? "opacity-0 hidden" : "opacity-100"
              }`}
            >
              {name}
            </span>
          </div>
          <span
            className={`transition-all duration-300 ease-in-out group-open:rotate-180 ${
              !isOpen ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            <IoIosArrowDown />
          </span>
        </summary>
        <div
          className={`mt-2 ml-4 pl-4 border-l-2 border-border flex flex-col gap-1 transition-opacity duration-300 ${
            !isOpen ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          {subMenuList.map((subMenu, index) => (
            <Link
              key={index}
              href={subMenu.href}
              className={`p-2 rounded-xs font-medium hover:bg-primary-surface hover:text-primary ${
                pathName === subMenu.href
                  ? "bg-primary-surface text-primary"
                  : ""
              }`}
            >
              {subMenu.name}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
};
