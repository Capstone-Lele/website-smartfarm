"use client";
import React from "react";
import { FiSidebar } from "react-icons/fi";
import { Separator } from "../ui/separator";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import Image from "next/image";
import { Label } from "../ui/label";
import { FiUser } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import useToggleSidebar from "@/lib/hooks/useToggleSidebar";
import { useLogout } from "@/lib/hooks/services/useAuth";
import { useRouter } from "next/navigation";

const DashboardNavbar = () => {
  const { isOpen, toggle } = useToggleSidebar();

  return (
    <main>
      <nav className="w-full h-18 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center">
          <div onClick={toggle}>
            <FiSidebar className={`text-2xl ${isOpen ? "rotate-180" : ""} cursor-pointer`} />
          </div>
          <div className="mx-4 h-6 w-px bg-gray-300" />
          <h1 className="text-xl text-gray-800 font-semibold">
            Dashboard Navbar
          </h1>
        </div>
        <div>
          <UserProfile />
        </div>
      </nav>
      <nav className="border-b h-12 flex items-center px-4">
        <div>
          <Breadcrumb>
            <BreadcrumbList className="">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Beranda</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem></BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>
    </main>
  );
};

export default DashboardNavbar;

const UserProfile = () => {
  const logoutMutation = useLogout();
  const route = useRouter();

  const onLogout = async () => {
    try {
      const result = await logoutMutation.mutateAsync();
      console.log("Logout successful", result);
      route.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="flex items-center cursor-pointer">
        <div>
          <Image
            src="/images/default.jpg"
            alt="User Profile"
            width={40}
            height={40}
            className=" rounded-full"
          />
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-800">John Doe</p>
          <p className="text-sm text-gray-500">Admin</p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 text-sm ">
        <Label className="block px-2 py-1 font-medium text-black">
          Profile
        </Label>
        <Separator className="my-2" />
        <Link
          href="/settings"
          className="flex items-center gap-2 px-2 py-1 hover:text-primary hover:bg-primary-surface rounded"
        >
          <FiUser className="text-lg" />
          Setting Profile
        </Link>
        <div
          onClick={onLogout}
          className="flex items-center cursor-pointer gap-2 px-2 py-1 hover:text-primary hover:bg-primary-surface rounded"
        >
          <MdOutlineLogout className="text-lg" />
          Logout
        </div>
      </PopoverContent>
    </Popover>
  );
};
