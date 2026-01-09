'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import StatusBadge from './status-badge';

// Swiper
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  type?: 'campaign' | 'notice';
  start_date?: string;
  end_date?: string;
  status?: 'open' | 'closed';
}

const slides: SlideData[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=800&fit=crop',
    title: '룰렛 돌리면 최대\n무신사머니 백만원',
    subtitle: '무신사와 함께하는 삼.세.페',
    type: 'campaign', 
    status: 'open',
    start_date: '2026-01-15T00:00:00', // 오픈예정 테스트
    end_date: '2026-01-20T00:00:00',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop',
    title: '촉촉한 피부를 위한\n수분 크림 특가',
    subtitle: '건조한 겨울철 필수 아이템',
    type: 'campaign',
    status: 'open',
    start_date: '2026-01-01T00:00:00',
    end_date: '2026-01-09T23:59:59', // 마감임박 테스트 (오늘 마감)
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=800&fit=crop',
    title: '특별한 날을 위한\n프리미엄 한우 세트',
    subtitle: '소중한 분께 마음을 전하세요',
    type: 'notice', // 일반 공지 (타이머 없음)
  },
];

export default function MainCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full py-4">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={8} // 간격 8px
        slidesPerView={'auto'} // 너비 자동 (CSS로 제어)
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        className="w-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide 
            key={slide.id} 
            className="!flex justify-center !w-[calc(100%-32px)]"
          >
            {({ isActive }) => (
              <div
                className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-lg"
              >
                {/* 상태 배지 (캠페인 타입일 경우만) */}
                {slide.type === 'campaign' && slide.start_date && slide.end_date && (
                  <StatusBadge 
                    status={slide.status || 'open'} 
                    startDate={slide.start_date} 
                    endDate={slide.end_date} 
                    className="w-fit bg-black/30 backdrop-blur-[2px] text-white/90 text-[10px] px-2 py-0.5 rounded-full border border-white/10 font-medium tracking-wide h-auto gap-0.5 shadow-none top-2 left-2"
                  />
                )}
                
                {/* 이미지 */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className={`object-cover transition-transform ease-out ${
                    isActive ? 'scale-[1.1] duration-[10000ms]' : 'scale-100 duration-700'
                  }`}
                  priority={idx === 0}
                />
                
                {/* 하단 그라데이션 */}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* 텍스트 내용 */}
                <div className="absolute bottom-6 left-4 right-4 text-white z-10 text-center">
                  <h2 className="text-xl font-bold leading-tight whitespace-pre-line mb-1 drop-shadow-sm">
                    {slide.title}
                  </h2>
                  <p className="text-xs font-medium opacity-80 drop-shadow-sm line-clamp-1">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 우측 하단 숫자 인디케이터 */}
      <div className="absolute bottom-6 right-[6%] bg-black/30 backdrop-blur-[2px] text-white/90 text-[10px] px-2 py-0.5 rounded-full z-20 font-medium tracking-wide border border-white/10 flex items-center gap-0.5 pointer-events-none">
        <span>{currentIndex + 1}/{slides.length}</span>
        <ChevronRight size={10} strokeWidth={2.5} />
      </div>
    </div>
  );
}
