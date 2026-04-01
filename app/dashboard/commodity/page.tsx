import CardStatistic from "@/components/card/card-statistic";
import React from "react";
import { FaFish, FaWater } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import { IoFish } from "react-icons/io5";

const page = () => {

  const cardData = [
      {
        title: "Total Stock Ikan",
        value: "1000",
        icon: <FaWater />,
      },
      {
        title: "Ikan Keluar",
        value: "1000",
        icon: <IoFish />,
      },
      {
        title: "Ikan Masuk",
        value: "1000",
        icon: <FaFish />,
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
      </>
    </div>
  );
};

export default page;
