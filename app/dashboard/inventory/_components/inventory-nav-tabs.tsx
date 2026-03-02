"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_TABS = [
  { label: "Inventaris", href: "/dashboard/inventory" },
  { label: "Pengajuan", href: "/dashboard/inventory-submission" },
];

const InventoryNavTabs = () => {
  const pathname = usePathname();
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
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default InventoryNavTabs;
