import React from "react";
import { Badge } from "@/components/ui/badge";
import { getWaterStatus } from "@/lib/utils/read-water-status";

interface ParamStatusProps {
  title: string;
  minArr?: number[] | null;
  normalArr?: number[] | null;
  maxArr?: number[] | null;
}

export const ParamStatus = ({
  title,
  minArr,
  normalArr,
  maxArr,
}: ParamStatusProps) => {

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      </div>
      <div className="grid grid-cols-3 gap-4 text-xs bg-slate-50 p-3 rounded-md border w-full">
        <div className="flex flex-col flex-1">
          <span className="text-slate-500">Min</span>
          <span className="font-semibold text-yellow-600">
            {minArr && minArr.length === 2
              ? `${minArr[0]} - ${minArr[1]}`
              : "-"}
          </span>
        </div>
        <div className="flex flex-col flex-1 border-l pl-3">
          <span className="text-slate-500">Normal</span>
          <span className="font-semibold text-emerald-600">
            {normalArr && normalArr.length === 2
              ? `${normalArr[0]} - ${normalArr[1]}`
              : "-"}
          </span>
        </div>
        <div className="flex flex-col flex-1 border-l pl-3">
          <span className="text-slate-500">Max</span>
          <span className="font-semibold text-yellow-600">
            {maxArr && maxArr.length === 2
              ? `${maxArr[0]} - ${maxArr[1]}`
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};
