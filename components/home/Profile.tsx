import Image from "next/image";
import React from "react";

const HomeProfile = () => {
  return (
    <section id="profile" className="py-16 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-3xl font-semibold text-slate-900">
            Profile Kelompok Tani Desa Kebakalan
          </h2>
          <p className="mt-2 text-slate-600">
            Dalam melakukan budidaya ikan lele
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 h-96">
          <div className="md:col-span-1">
            <Image
              src="/images/home/pool-3.jpeg"
              alt="Profile Image"
              width={400}
              height={400}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>

          <div className="md:col-span-1 flex flex-col gap-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2235.2138477237313!2d112.6695056446088!3d-7.531116413899628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7de34500ee8d9%3A0x4e5b1296468709e2!2sKebakalan%2C%20Kec.%20Porong%2C%20Kabupaten%20Sidoarjo%2C%20Jawa%20Timur!5e1!3m2!1sid!2sid!4v1774871474521!5m2!1sid!2sid"
              className="rounded-lg w-full h-full min-h-50"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <div className="text-sm text-slate-600 mt-2">
              <p>Desa Kebakalan, Kecamatan Porong, Kabupaten Sidoarjo</p>
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="flex-1 flex items-center">
              <p className="text-slate-700 leading-relaxed text-sm">
                Masyarakatnya tergabung dalam kelompok tani yang mendapat
                dukungan pendanaan dari pemerintah desa untuk merealisisasikan
                kegiatan budidaya ikan lele. Melalui program ini, diharapkan
                masyarakat desa dapat meningkatkan kemandiran ekonomi melalui
                kegiatan perikanan air tawar.
              </p>
            </div>

            <Image
              src="/images/home/pool-1.jpeg"
              alt="Profile Image"
              width={400}
              height={400}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeProfile;
