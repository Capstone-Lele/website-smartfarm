import React from "react";
import { Skeleton } from "../ui/skeleton";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

const TableSkeleton = ({ columns = 5, rows = 5 }: TableSkeletonProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 gap-2">
        <div className="flex flex-1 items-center gap-2">
          <Skeleton className="h-10 w-60" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <div className="w-full">
          <div className="bg-gray-50 border-b">
            <div className="flex items-center">
              {Array.from({ length: columns }).map((_, index) => (
                <div key={index} className="flex-1 p-4">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>

          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="border-b last:border-b-0">
              <div className="flex items-center">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div key={colIndex} className="flex-1 p-4">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
