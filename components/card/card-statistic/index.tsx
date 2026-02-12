import CardStatisticSkeleton from "@/components/sekeleton/card-statistic-skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuUsersRound } from "react-icons/lu";

export default function CardStatistic({
  title,
  value,
  icon,
}: {
  title?: string;
  value?: string;
  icon?: React.ReactNode;
}) {
  return (
    <>
      <Card className="w-full rounded-md shadow-none py-4">
        {(!value)  ? (
          <CardStatisticSkeleton />
        ) : (
          <>
            <CardHeader className="px-4">
              <CardTitle className="text-gray-500 font-medium text-sm">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-medium">{value}</p>
                {icon && (
                  <div className="bg-blue-100 p-1.5 rounded-md">{icon}</div>
                )}
              </div>
            </CardContent>
          </>
        )}
        {/* <CardFooter className="flex-col gap-2">
          </CardFooter> */}
      </Card>
    </>
  );
}
