import React from "react";
import { PanenChartBarInteractive } from "./panen-chart";
import { GeneralInfoResponse } from "@/types/guest";
import { formatDate } from "@/lib/utils/format-date";

const HomePanen = ({ data }: { data?: GeneralInfoResponse }) => {
  const generalInfo = data?.data[0];
  return (
    <section id="panen" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-3xl font-semibold text-slate-900">
            Panen Ikan Lele
          </h2>
          <p className="mt-2 text-slate-600">
            Informasi terkini (per tahun) mengenai panen ikan lele yang
            dibudidayakan
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="col-span-3">
            <PanenChartBarInteractive data={data} />
          </div>

          <div className="bg-white rounded-sm border border-slate-200 p-6 flex flex-col h-full shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {generalInfo?.harvestSection.latestHarvest.length || "-"}{" "}
                  Panen Terakhir
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Riwayat terbaru dari kolam
                </p>
              </div>
              <div className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-xs font-semibold">
                Terbaru
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              {generalInfo?.harvestSection.latestHarvest.length ? (
                generalInfo.harvestSection.latestHarvest.map(
                  (harvest, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-slate-50 p-4 rounded-sm"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-900">
                          {harvest.poolName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {formatDate(harvest.reportDate) || "-"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          {harvest.totalQuantity || "-"}
                        </p>
                        <p className="text-xs text-slate-500">ekor</p>
                      </div>
                    </div>
                  ),
                )
              ) : (
                <p className="text-sm text-slate-500">
                  Belum ada data panen terbaru.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePanen;
