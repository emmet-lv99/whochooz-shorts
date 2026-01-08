'use client';

import Image from "next/image";
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Props {
  imageUrl: string;
  status: 'open' | 'closed';
  startDate: string;
  endDate: string;
}

export default function ThumbCarousel({ imageUrl, status, startDate, endDate }: Props) {
  // 임시: 이미지가 하나뿐이라 3번 복제해서 캐러셀 느낌 내기
  const images = [imageUrl, imageUrl, imageUrl];

  return (
    <div className="relative w-full aspect-square bg-slate-100">
      <Swiper
        modules={[Pagination]}
        pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-100',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-2.5',
        }}
        className="w-full h-full [&_.swiper-pagination]:!bottom-4"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full">
            <Image
              src={img}
              alt="Campaign Thumbnail"
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}
