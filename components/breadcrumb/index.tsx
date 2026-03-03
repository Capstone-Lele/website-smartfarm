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
import { usePathname, useRouter, useParams } from "next/navigation";
import dataPath from "@/lib/constants/path";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const BreadCrumbPath = () => {
  const pathName = usePathname();
  const params = useParams();

  console.log("Current Pathname:", pathName);
  console.log("Params:", params);

  // Helper function untuk match dynamic routes
  const matchDynamicPath = (pattern: string, path: string) => {
    const patternParts = pattern.split("/");
    const pathParts = path.split("/");

    if (patternParts.length !== pathParts.length) return false;

    return patternParts.every((part, i) =>
      part.startsWith("[") && part.endsWith("]") ? true : part === pathParts[i],
    );
  };

  const getBreadcrumbs = () => {
    const breadcrumbs: {
      name: string;
      href: string;
      sub_paths?: (typeof dataPath)[number]["sub_paths"];
    }[] = [];

    breadcrumbs.push({ name: "Beranda", href: "/dashboard" });

    for (const item of dataPath) {
      // Exact match untuk path static
      if (pathName === item.path) {
        breadcrumbs.push({ name: item.name, href: item.path });
        return breadcrumbs;
      }

      // Check dynamic path
      if ((item as any).isDynamic && matchDynamicPath(item.path, pathName)) {
        const displayName = (item as any).dynamicName
          ? (item as any).dynamicName(params)
          : item.name;
        breadcrumbs.push({ name: displayName, href: pathName });
        return breadcrumbs;
      }

      if (item.sub_paths) {
        for (const subItem of item.sub_paths) {
          // Exact match untuk sub path static
          if (pathName === subItem.path) {
            if (item.sub_paths.length === 1) {
              breadcrumbs.push({ name: item.name, href: item.path });
              breadcrumbs.push({ name: subItem.name, href: subItem.path });
              return breadcrumbs;
            }
            breadcrumbs.push({
              name: item.name,
              href: item.path,
              sub_paths: item.sub_paths,
            });
            breadcrumbs.push({ name: subItem.name, href: subItem.path });
            return breadcrumbs;
          }

          // Check dynamic sub path
          if (
            (subItem as any).isDynamic &&
            matchDynamicPath(subItem.path, pathName)
          ) {
            breadcrumbs.push({ name: item.name, href: item.path });
            const displayName = (subItem as any).dynamicName
              ? (subItem as any).dynamicName(params)
              : subItem.name;
            breadcrumbs.push({ name: displayName, href: pathName });
            return breadcrumbs;
          }
        }
      }
    }
  };

  const breadcrumbs = getBreadcrumbs();
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
                          <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer">
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
