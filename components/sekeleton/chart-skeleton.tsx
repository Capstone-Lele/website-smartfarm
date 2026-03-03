import React from "react";
import { Skeleton } from "../ui/skeleton";


const ChartSkeleton = () => {
  return (
    <div className="h-96 w-full items-start flex justify-between p-10  ">
      <Skeleton className="h-[80%] w-10" />
      <Skeleton className="h-[80%] w-10" />
      <Skeleton className="h-[80%] w-10" />
      <Skeleton className="h-[80%] w-10" />
      <Skeleton className="h-[80%] w-10" />
      <Skeleton className="h-[80%] w-10" />
    </div>
  );
};

export default ChartSkeleton;
