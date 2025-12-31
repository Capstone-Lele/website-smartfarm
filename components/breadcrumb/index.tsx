import React, { use, useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dataPath from "@/lib/constants/path";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const BreadCrumbPath = () => {
  const pathName = usePathname();

  console.log("Current Pathname:", pathName);

  const getBreadcrumbs = () => {
    const breadcrumbs: {
      name: string;
      href: string;
      sub_paths?: (typeof dataPath)[number]["sub_paths"];
    }[] = [];

    breadcrumbs.push({ name: "Beranda", href: "/dashboard" });

    for (const item of dataPath) {
      if (pathName === item.path) {
        breadcrumbs.push({ name: item.name, href: item.path });
        return breadcrumbs;
      }
      if (item.sub_paths) {
        for (const subItem of item.sub_paths) {
          if (pathName === subItem.path) {
            breadcrumbs.push({
              name: item.name,
              href: item.path,
              sub_paths: item.sub_paths,
            });
            breadcrumbs.push({ name: subItem.name, href: subItem.path });
            return breadcrumbs;
          }
        }
      }
    }
  };

  const breadcrumbs = getBreadcrumbs();
  console.log("Breadcrumbs:", breadcrumbs);
  return (
    <Breadcrumb>
      <BreadcrumbList className="">
        {breadcrumbs?.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {crumb.href ? (
                <>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                  ) : (
                    <>
                      {crumb.sub_paths ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center gap-1">
                            <BreadcrumbEllipsis className="size-4" />
                            <span className="sr-only">Toggle menu</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {crumb.sub_paths.map((subCrumb, subIndex) => (
                              <DropdownMenuItem key={subIndex}>
                                <Link href={subCrumb.path}>
                                  {subCrumb.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href}>{crumb.name}</Link>
                        </BreadcrumbLink>
                      )}
                    </>
                  )}
                </>
              ) : (
                <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
export default BreadCrumbPath;
