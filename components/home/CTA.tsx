import React from "react";
import { BsSendFill } from "react-icons/bs";

const HomeCTA = () => {
  return (
    <section className="py-16 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="bg-primary-surface rounded-sm p-8 lg:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">

            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">
                Tertarik untuk bergabung dengan Lele Farm?
              </h2>
              <button className="bg-primary cursor-pointer text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center w-fit">
                Hubungi kami sekarang
                <BsSendFill className="ml-3" />
              </button>
            </div>

            <div className="flex-1 md:text-right">
              <p className="text-lg text-slate-700 leading-relaxed">
                Dapatkan informasi terkini tentang budidaya ikan lele, tips
                perawatan, dan penawaran khusus hanya untuk anggota kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
