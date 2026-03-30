import React from "react";
import { FaFish, FaWater } from "react-icons/fa";
import { IoFish } from "react-icons/io5";
import { FiShield } from "react-icons/fi";

const HomeKolam = () => {
  return (
    <section id="kolam" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center flex justify-between items-center">
          <h2 className="text-3xl md:text-3xl font-semibold text-slate-900">
            Kolam Budidaya Ikan Lele
          </h2>
          <p className="mt-2 text-slate-600 max-w-lg text-right">
            Sistem kolam budidaya yang digunakan memiliki kategori dan kegunaan
            masing-masing
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-primary-surface rounded-lg p-6 flex flex-col items-start">
            <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-lg mb-6 shrink-0 text-slate-700">
              <FaWater size={24} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">8 Kolam</h3>
            <p className="text-sm text-slate-700">
              Total kolam aktif budidaya dengan beberapa kategori
            </p>
          </div>

          <div className="p-6 flex flex-col items-start">
            <div className="w-12 h-12 bg-slate-200 flex items-center justify-center rounded-lg mb-6 shrink-0 text-slate-700">
              <FaFish size={24} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              2 Kolam Pembenihan
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Khusus perawatan benih fase awal hingga mencapai ukuran siap
              pindah ke kolam pembesaran.
            </p>
          </div>

          <div className="p-6 flex flex-col items-start">
            <div className="w-12 h-12 bg-slate-200 flex items-center justify-center rounded-lg mb-6 shrink-0 text-slate-700">
              <IoFish size={24} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              5 Kolam Pembesaran
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fokus pada pertumbuhan lele dari ukuran remaja hingga mencapai
              bobot siap panen (konsumsi).
            </p>
          </div>

          <div className="p-6 flex flex-col items-start">
            <div className="w-12 h-12 bg-slate-200 flex items-center justify-center rounded-lg mb-6 shrink-0 text-slate-700">
              <FiShield size={24} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              1 Kolam Penangkaran
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Area khusus untuk pemeliharaan indukan atau karantina guna menjaga
              kualitas budidaya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeKolam;
