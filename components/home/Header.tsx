"use client";
import { GeneralInfoResponse } from "@/types/guest";
import React from "react";
import { LuArrowDown } from "react-icons/lu";

const HomeHeader = ({data}:{data?:GeneralInfoResponse}) => {
  const generalInfo = data?.data[0];
  return (
    <main id="beranda">
      <section
        className="relative h-187.5 min-h-105 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/home/pool-2.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-full bg-black/5 backdrop-blur-sm"
          style={{
            maskImage: "linear-gradient(to right, black 5%, transparent)",
          }}
        />

        <div className="relative z-10 flex h-full items-center justify-start px-4 text-start max-w-7xl mx-auto">
          <div className="max-w-3xl text-white">
            <p className="mt-4 text-base text-white/90 md:text-lg">
              Menuju desa kebakalan yang maju, bersih, inovatif, demokratis, dan
              berkelanjutan
            </p>
            <h1 className="text-3xl font-medium leading-tight md:text-5xl">
              Website Budidaya Lele Kelompok Tani Desa Kebakalan
            </h1>
            <div>
              <button className="mt-6 rounded-full bg-primary-surface text-sm font-medium text-slate-900 transition-colors hover:bg-primary-surface/90 flex items-center pl-3 pr-1 py-1 cursor-pointer">
                Jelajahi Lebih Lanjut
                <div className="bg-primary text-white rounded-full p-2 ml-2">
                  <LuArrowDown />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 items-center gap-8">
          <div>
            <h2 className="text-4xl font-semibold mb-2">{new Date().getFullYear() - 2025}+</h2>
            <p className="text-lg text-gray-600">Tahun Pengalaman</p>
          </div>
          <div>
            <h2 className="text-4xl font-semibold mb-2">{generalInfo?.totalExistingTransaction || "-"}</h2>
            <p className="text-lg text-gray-600">Transaksi Penjualan</p>
          </div>
          <div>
            <h2 className="text-4xl font-semibold mb-2">{generalInfo?.totalSuccessHarvest || "-"}</h2>
            <p className="text-lg text-gray-600">Panen</p>
          </div>
          <div>
            <h2 className="text-4xl font-semibold mb-2">{generalInfo?.totalPools || "-"}</h2>
            <p className="text-lg text-gray-600">Kolam Budidaya</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeHeader;
