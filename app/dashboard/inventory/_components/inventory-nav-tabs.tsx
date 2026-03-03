"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetInventorySubmissions } from "@/lib/api/service/inventory-submission/useInventorySubmission";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_TABS = [
  { label: "Inventaris", href: "/dashboard/inventory" },
  { label: "Pengajuan", href: "/dashboard/inventory-submission" },
];

const InventoryNavTabs = () => {
  const { data, isLoading } = useGetInventorySubmissions();
  const pathname = usePathname();

  // Calculate pending count if not provided
  const calculatedPendingCount = data?.data.filter(
    (item) => item.status === "pending",
  ).length;

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
      {NAV_TABS.map((tab) => {
        // Check if current path starts with tab href
        const isActive =
          tab.href === "/dashboard/inventory"
            ? pathname.startsWith("/dashboard/inventory") &&
              !pathname.startsWith("/dashboard/inventory-submission")
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center ${
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.href === "/dashboard/inventory-submission" &&
              (calculatedPendingCount !== undefined &&
              calculatedPendingCount > 0 ? (
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className={`rounded-full w-4 h-4 bg-yellow-500 text-yellow-100 mr-2 text-xs flex items-center justify-center ${isActive ? "bg-primary" : "bg-primary/50"}`}
                    >
                      {calculatedPendingCount !== undefined
                        ? calculatedPendingCount
                        : "0"}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Jumlah Pengajuan Pending</p>
                  </TooltipContent>
                </Tooltip>
              ) : null)}
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default InventoryNavTabs;
