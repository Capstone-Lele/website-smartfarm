"use client";

import React, { useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

const images = [
  "/images/auth/img-1.jpg",
  "/images/auth/img-2.jpg",
  "/images/auth/img-3.jpeg",
];

const SlideImage = () => {
  return (
    <div className="m-0 p-0 w-full h-full">
      <Swiper
        pagination={true}
        loop={true}
        effect={"slide"}
        modules={[Pagination, Autoplay]}
        slidesPerView={"auto"}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        className="mySwiper overflow-hidden"
        spaceBetween={1}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <Image
              src={src}
              alt={`Slide Image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover w-full h-full"
              loading="eager"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SlideImage;
