import React from "react";
import { PanenChartBarInteractive } from "./panen-chart";

const HomePanen = () => {
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
            <PanenChartBarInteractive />
          </div>

          <div className="bg-white rounded-sm border border-slate-200 p-6 flex flex-col h-full shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  10 Panen Terakhir
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
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-sm">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Kolam 3
                  </h4>
                  <p className="text-xs text-slate-500">20 April 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">5.000</p>
                  <p className="text-xs text-slate-500">ekor</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-sm">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Kolam 7
                  </h4>
                  <p className="text-xs text-slate-500">15 April 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">8.000</p>
                  <p className="text-xs text-slate-500">ekor</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-sm">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Kolam 1
                  </h4>
                  <p className="text-xs text-slate-500">10 April 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">3.500</p>
                  <p className="text-xs text-slate-500">ekor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePanen;
