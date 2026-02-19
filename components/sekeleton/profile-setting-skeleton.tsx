import DefaultCard from "../card/default-card";
import { Skeleton } from "../ui/skeleton";

const ProfileSettingSkeleton = () => {
  return (
    <DefaultCard>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row gap-4 items-center">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </DefaultCard>
  );
};

export default ProfileSettingSkeleton;
