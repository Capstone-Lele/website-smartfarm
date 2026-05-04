"use client";

import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { IOTData, IOTDataHistorical } from "@/types/notes/iot";
import { IotTrendChart } from "./iot-trend-chart";
import { id } from "date-fns/locale";

interface IotOverviewProps {
  data: IOTDataHistorical[];
}

export const IotOverview: React.FC<IotOverviewProps> = ({ data }) => {
  const { phData, tempData, uniqueNodes } = useMemo(() => {
    if (!data || data.length === 0) {
      return { phData: [], tempData: [], uniqueNodes: [] };
    }

    const nodes = new Set<number>();
    const phMap = new Map<string, any>();
    const tempMap = new Map<string, any>();

    // Urutkan data berdasarkan waktu agar chart rapi (kiri ke kanan)
    const sortedData = [...data].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    sortedData.forEach((item) => {
      nodes.add(item.node_id);

      const timeStr = format(parseISO(item.createdAt), "dd MMM HH:mm", {
        locale: id,
      });

      // -- Gabungkan data pH berdasarkan waktu yang sama --
      if (!phMap.has(timeStr)) {
        phMap.set(timeStr, { time: timeStr });
      }
      phMap.get(timeStr)[`Kolam ${item.node_id}`] = item.ph;

      // -- Gabungkan data Suhu berdasarkan waktu yang sama --
      if (!tempMap.has(timeStr)) {
        tempMap.set(timeStr, { time: timeStr });
      }
      tempMap.get(timeStr)[`Kolam ${item.node_id}`] = item.temp;
    });

    return {
      phData: Array.from(phMap.values()),
      tempData: Array.from(tempMap.values()),
      uniqueNodes: Array.from(nodes).sort((a, b) => a - b),
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <IotTrendChart
        data={phData}
        nodes={uniqueNodes}
        dataKey="ph"
        title="Tren Analisa pH Kolam"
        description="Pantauan tingkat pH air di masing-masing kolam"
      />
      <IotTrendChart
        data={tempData}
        nodes={uniqueNodes}
        dataKey="temp"
        title="Tren Analisa Suhu Kolam"
        description="Pantauan suhu (°C) air di masing-masing kolam"
      />
    </div>
  );
};
