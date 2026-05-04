import React from "react";
import { PopulasiChartBarDefault } from "./populasi-chart";
import { GeneralInfoResponse } from "@/types/guest";

const HomePopulasi = ({ data }: { data?: GeneralInfoResponse }) => {
  const generalInfo = data?.data[0];
  return (
    <section id="populasi" className="py-16 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-3xl font-semibold text-slate-900">
            Populasi Ikan Lele
          </h2>
          <p className="mt-2 text-slate-600">
            Informasi terkini mengenai jumlah populasi ikan lele yang sedang
            dibudidayakan
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 w-full">
          <div className="flex flex-col items-start gap-4">
            <div className="bg-primary-surface rounded-sm p-6 flex flex-col items-start">
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Total Populasi
              </h3>
              <div className="text-2xl font-semibold text-primary">
                {generalInfo?.populationSection.totalExistingFishPopulation ||
                  "-"}{" "}
                Ekor
              </div>
              <p className="text-sm text-slate-700">
                Jumlah total ikan lele yang sedang dibudidayakan di semua kolam
              </p>
            </div>
            <div className="bg-secondary-surface rounded-sm p-6 flex flex-col items-start">
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Rata Rata Populasi per Kolam
              </h3>
              <div className="text-2xl font-semibold text-secondary">
                {generalInfo?.populationSection.totalAverageFishPopulation ||
                  "-"}{" "}
                Ekor
              </div>
              <p className="text-sm text-slate-700">
                Rata-rata jumlah ikan lele yang sedang dibudidayakan di setiap
                kolam
              </p>
            </div>
          </div>
          {/* Chart */}
          <div className="col-span-3 w-full">
            <PopulasiChartBarDefault
              chartData={generalInfo?.populationSection?.chartPopulation}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePopulasi;
