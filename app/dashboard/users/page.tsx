"use client";
import { DataTable } from "@/components/data-table/data-table";
import { useUnit } from "@/lib/api/service/master-data/unit/useUnit";
import React, { useEffect } from "react";
import { columnsUser } from "./column";
import PostUnitModal from "./post";
import TableSkeleton from "@/components/sekeleton/table-skeleton";
import { useGetProducts } from "@/lib/api/service/master-data/product/useProduct";
import PostUserModal from "./post";
import { useGetUsers } from "@/lib/api/service/users/useUser";
import CardStatistic from "@/components/card/card-statistic";
import DefaultCard from "@/components/card/default-card";
import { LuUserRound, LuUsersRound } from "react-icons/lu";
import { TableFacetedFilter } from "@/types/table-faceted-filter";

const tableFilter:TableFacetedFilter=[
  {
    column: "role",
    option: [
      { label: "Penanggung Jawab", value: "pic" },
      { label: "Petugas", value: "staff" },
    ],
  },
]

const page = () => {
  const { data, isLoading, error } = useGetUsers();

  const cardData = [
  {
    title: "Total Pengguna",
    value: data?.data.length.toString(),
    icon: <LuUsersRound />,
  },
  {
    title: "Penanggung Jawab",
    value: data?.data.filter((user) => user.role === "pic").length.toString(),
    icon: <LuUserRound />
  },
  {
    title: "Staff",
    value: data?.data.filter((user) => user.role === "staff").length.toString(),
    icon: <LuUserRound />
  },
];

  useEffect(() => {
    if (data) {
      console.log("User Data:", data);
    }
    if (error) {
      console.error("Error fetching users:", error);
    }
  }, [data, error]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
        <div className="w-full">
          {isLoading ? (
            <TableSkeleton columns={6} rows={8} />
          ) : (
            <div>
              <div className="flex justify-end">
                <PostUserModal />
              </div>
              <DataTable
                columns={columnsUser}
                data={data?.data || []}
                facetedFilter={tableFilter}
              />
            </div>
          )}
        </div>
      </DefaultCard>
    </>
  );
};

export default page;
