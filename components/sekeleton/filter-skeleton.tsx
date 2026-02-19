import React from "react";
import { Skeleton } from "../ui/skeleton";

interface FilterSkeletonProps {
  columns?: number;
  rows?: number;
}

const FilterSkeleton = ({ columns = 5, rows = 5 }: FilterSkeletonProps) => {
  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between py-4 gap-2">
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-10 w-60" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </>
  );
};

export default FilterSkeleton;
