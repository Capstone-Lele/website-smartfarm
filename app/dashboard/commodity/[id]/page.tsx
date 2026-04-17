"use client";

import CardStatistic from "@/components/card/card-statistic";
import React, { use } from "react";
import { FaFish, FaWater } from "react-icons/fa";
import { IoFish } from "react-icons/io5";
import { LuArrowDownToLine, LuArrowUpFromLine } from "react-icons/lu";
import DetailIn from "./detail_in";
import DetailOut from "./detail_out";
import { useCommodity } from "@/lib/api/service/commodity/useCommodity";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { data, isLoading } = useCommodity();
  const { id } = use(params);

  const record = data?.data.find((item) => item.id === id);

  if (!record) {
    return (
      <div className="flex items-center justify-center h-60 text-muted-foreground">
        Data tidak ditemukan.
      </div>
    );
  }

  const isIn = record.type.toLowerCase() === "in";

  return (
    <div className="space-y-5">
      {isIn ? <DetailIn id={id} /> : <DetailOut id={id} />}
    </div>
  );
};

export default Page;
