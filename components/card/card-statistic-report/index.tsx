import DefaultCard from "@/components/card/default-card";
import React from "react";

interface CardStatisticReportProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  iconBgColor?: string;
  iconTextColor?: string;
  subTitle?: string;
}

export const CardStatisticReport: React.FC<CardStatisticReportProps> = ({
  icon,
  title,
  value,
  unit,
  iconBgColor = "bg-blue-50",
  iconTextColor = "text-blue-600",
  subTitle,
}) => {
  return (
    <DefaultCard className="flex flex-col  w-full justify-center">
      <div className="flex items-center gap-4 w-full justify-between ">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium">{title}</p>
          <p className="text-xl font-semibold text-gray-900 mt-0.5 truncate">
            {value}{" "}
            {unit && (
              <span className="text-sm font-medium text-gray-500">{unit}</span>
            )}
          </p>
        </div>
        <div
          // className={`w-10 h-10 rounded-sm ${iconBgColor} ${iconTextColor} flex items-center justify-center flex-shrink-0`}
          className={`w-10 h-10 rounded-sm bg-gray-100 ${iconTextColor} flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </div>
      </div>
      {subTitle && (
        <p className="text-xs text-gray-500 ">{subTitle}</p>
      )}
    </DefaultCard>
  );
};
