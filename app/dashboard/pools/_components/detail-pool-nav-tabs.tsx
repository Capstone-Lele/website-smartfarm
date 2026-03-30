"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DetailPoolNavTabsProps {
  poolId: string;
  cycleId?: string;
}

const DetailPoolNavTabs = ({ poolId, cycleId }: DetailPoolNavTabsProps) => {
  const pathname = usePathname();

  const poolHref = `/dashboard/pools/${poolId}`;
  const cycleHref = cycleId
    ? `/dashboard/pools/${poolId}/${cycleId}`
    : null;

  const NAV_TABS = [
    ...(cycleHref ? [{ label: "Detail Kolam", href: cycleHref }] : []),
    { label: "Siklus Kolam", href: poolHref },
  ];

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
      {NAV_TABS.map((tab) => {
        const isActive =
          tab.href === poolHref
            ? pathname === poolHref
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
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default DetailPoolNavTabs;
