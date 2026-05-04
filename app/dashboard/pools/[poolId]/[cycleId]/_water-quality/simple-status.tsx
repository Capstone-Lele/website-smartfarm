import React from "react";
import { getWaterStatus } from "@/lib/utils/read-water-status";

export const SimpleStatus = ({
  title,
  value,
  unit,
  minArr,
  maxArr,
  normalArr,
  time,
}: any) => {
  const numValue = Number(value);
  const statusKey = getWaterStatus(
    numValue,
    minArr,
    maxArr,
    normalArr,
  );

  let status = "Normal";
  let color = "text-green-500";

  if (value !== "-") {
    if (statusKey === "danger") {
      status = "Bahaya";
      color = "text-red-500";
    } else if (statusKey === "warning") {
      status = "Peringatan";
      color = "text-yellow-500";
    } else if (statusKey === "normal") {
      status = "Normal";
      color = "text-green-500";
    } else if (statusKey === "invalid-parameter") {
      status = "Parameter Tidak Valid";
      color = "text-gray-500";
    } else {
      status = "Tidak Diketahui";
      color = "text-gray-500";
    }
  }

  console.log({ time });
  return (
    <div>
      <p className="text-sm font-semibold mb-1">
        {title} {unit ? `(${unit})` : ""}
      </p>
      <p className="text-lg">
        {value}{" "}
        {value !== "-" && (
          <span className={`${color} text-sm font-semibold`}>({status})</span>
        )}
      </p>
      {time && <p className="text-xs text-gray-400 mt-1">{time}</p>}
    </div>
  );
};
