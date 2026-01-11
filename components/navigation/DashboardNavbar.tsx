"use client";
import React, { use, useEffect, useState } from "react";
import { FiSidebar } from "react-icons/fi";
import { Separator } from "../ui/separator";
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
import { useLogout, useUserInfo } from "@/lib/api/service/auth/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { getCookieDecryptedSession } from "@/lib/session";
import BreadCrumbPath from "../breadcrumb";
import dataPath from "@/lib/constants/path";
import SkeletonNavbarProfile from "../sekeleton/navbar-profile";

const DashboardNavbar = () => {
  const pathname = usePathname();
  const { isOpen, toggle } = useToggleSidebar();

  const checkPathname = () => {
    for (const item of dataPath) {
      if (pathname === item.path) {
        return item.name;
      }
      if (item.sub_paths) {
        for (const subItem of item.sub_paths) {
          if (pathname === subItem.path) {
            return subItem.name;
          }
        }
      }
    }
    return "";
  };

  return (
    <main>
      <nav className="w-full h-18 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center">
          <div onClick={toggle}>
            <FiSidebar
              className={`text-2xl ${
                isOpen ? "rotate-180" : ""
              } cursor-pointer`}
            />
          </div>
          <div className="mx-4 h-6 w-0.5 bg-gray-300" />
          <h1 className="text-xl text-gray-800 font-semibold">
            {checkPathname()}
          </h1>
        </div>
        <div>
          <UserProfile />
        </div>
      </nav>
      <nav className="border-b h-12 flex items-center px-4">
        <div>
          <BreadCrumbPath />
        </div>
      </nav>
    </main>
  );
};

export default DashboardNavbar;

const UserProfile = () => {
  const logoutMutation = useLogout();
  const userinfo = useUserInfo();
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

  useEffect(() => {
    if (userinfo.data) {
      console.log("User Data:", userinfo.data);
    }
    if (userinfo.error) {
      console.error("Error fetching user info:", userinfo.error);
    }
  }, [userinfo.data, userinfo.error]);

  return (
    <Popover>
      <PopoverTrigger className="flex items-center cursor-pointer">
        {userinfo.isLoading ? (
          <SkeletonNavbarProfile />
        ) : (
          <>
            <div className="mr-3 text-right ">
              <p className="font-medium text-gray-800">
                {userinfo.data?.data.email || ""}
              </p>
              <p className="text-sm text-gray-500">{userinfo.data?.data.role || ""}</p>
            </div>
            <div>
              <Image
                src="/images/default.jpg"
                alt="User Profile"
                width={40}
                height={40}
                className=" rounded-full border border-primary"
              />
            </div>
          </>
        )}
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
