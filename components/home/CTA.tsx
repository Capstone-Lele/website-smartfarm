import React from "react";

const HomeCTA = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-slate-900 mb-4">
            Tertarik bergabung dengan Lele Farm?
          </h2>
          <p className="text-slate-600 mb-8">
            Dapatkan informasi terkini tentang budidaya ikan lele dan penawaran
            khusus.
          </p>
          <button className="bg-primary cursor-pointer text-white px-8 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Hubungi kami
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
