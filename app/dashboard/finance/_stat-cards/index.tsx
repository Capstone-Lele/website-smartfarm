"use client";

import React from "react";
import CardStatistic from "@/components/card/card-statistic";
import { FaWater } from "react-icons/fa";
import { IoFish } from "react-icons/io5";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { LuTrendingDown, LuTrendingUp } from "react-icons/lu";
import { MdAttachMoney, MdMoneyOff } from "react-icons/md";

interface FinanceStatCardsProps {
  income: number;
  expense: number;
}

const FinanceStatCards = ({ income, expense }: FinanceStatCardsProps) => {
  const profit = income - expense;

  const cardData = [
    {
      title: "Total Pemasukan",
      value: formatRupiah(income),
      icon: <MdAttachMoney className="text-blue-500" />,
    },
    {
      title: "Total Pengeluaran",
      value: formatRupiah(expense),
      icon: <MdMoneyOff className="text-red-500" />,
    },
    {
      title: "Laba / Rugi",
      value: formatRupiah(profit),
      icon:
        profit >= 0 ? (
          <LuTrendingUp className="text-green-500" />
        ) : (
          <LuTrendingDown className="text-red-500" />
        ),
    },
  ];

  return (
    <>
      {cardData.map((card, index) => (
        <CardStatistic
          key={index}
          icon={card.icon}
          title={card.title}
          value={card.value}
        />
      ))}
    </>
  );
};

export default FinanceStatCards;
