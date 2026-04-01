import CardStatistic from "@/components/card/card-statistic";
import DefaultCard from "@/components/card/default-card";
import React from "react";
import { FaFish, FaWater } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import { IoFish } from "react-icons/io5";
import { columns } from "./column";
import { DataTable } from "@/components/data-table/data-table";
import { FINANCE_DUMMY_DATA } from "@/lib/constants/dummy-respoonse/finance";
import PostFinance from "./post";


const page = () => {
  const cardData = [
    {
      title: "Total Pendapatan",
      value: "1000",
      icon: <FaWater />,
    },
    {
      title: "Total Pengeluaran",
      value: "1000",
      icon: <IoFish />,
    },
    {
      title: "Net Profit",
      value: "1000",
      icon: <FaFish />,
    },
    {
      title: "Modal",
      value: "1000",
      icon: <FiShield />,
    },
  ];

  return (
    <div className="">
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 w-full">
          {cardData.map((card, index) => (
            <CardStatistic
              key={index}
              icon={card.icon}
              title={card.title}
              value={card.value}
            />
          ))}
        </div>
        <DefaultCard>
          <div className="flex justify-end mb-4">
            <PostFinance />
          </div>
          <DataTable columns={columns} data={FINANCE_DUMMY_DATA} />
        </DefaultCard>
      </>
    </div>
  );
};

export default page;
