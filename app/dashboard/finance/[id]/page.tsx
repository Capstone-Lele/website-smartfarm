"use client";

import CardStatistic from "@/components/card/card-statistic";
import React, { use } from "react";
import { FaFish, FaWater } from "react-icons/fa";
import { IoFish } from "react-icons/io5";
import { LuArrowDownToLine, LuArrowUpFromLine } from "react-icons/lu";
import { useCommodity } from "@/lib/api/service/commodity/useCommodity";
import { useSearchParams } from "next/navigation";
import DetailCommodity from "./detail-commodity";
import DetailInventoryNotes from "./detail-inventaris";
import DetailNonInventoryNotes from "./detail-non-inventaris";
import DetailInventorySubmissionNotes from "./detail-inventory-submission";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  let content;
  if (type === "commodity_sales") {
    content = <DetailCommodity id={id} />;
  }else if(type === "inventory_notes"){
    content = <DetailInventoryNotes source={id} />;
  }else if(type === "non_inventory"){
    content = <DetailNonInventoryNotes source={id} />;
  }else if(type === "inventory_submissions"){
    content = <DetailInventorySubmissionNotes id={id} />;
  }

  return (
    <div className="space-y-5">
      {content}
    </div>
  );
};

export default Page;
