import React from "react";
import { Skeleton } from "../ui/skeleton";

const SkeletonNavbarProfile = () => {
  return (
    <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col items-start">
            <Skeleton className="h-4 w-24 " />
            <Skeleton className="h-4 w-16 mt-1" />
        </div>
    </div>
  );
};

export default SkeletonNavbarProfile;
