import React from "react";
import { Skeleton } from "../ui/skeleton";

const CardStatisticSkeleton = () => {
  return (
    <div className="w-full rounded-md max-w-sm shadow-none py-4">
      <div className="px-4">
        <Skeleton className="h-4 w-24 mb-2" />
      </div>
      <div className="px-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default CardStatisticSkeleton;
