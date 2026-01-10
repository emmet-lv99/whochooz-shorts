'use client';

import authService from '@/app/_services/auth';
import { Banner, bannerService } from '@/app/_services/banner';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Swiper
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function MainCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBanners() {
      try {
        // 병렬 호출: 유저 정보 & 배너 목록
        const [user, allBanners] = await Promise.all([
            authService.getCurrentUser(),
            bannerService.getActiveBanners()
        ]);

        // 필터링 로직
        const filtered = allBanners.filter(b => {
             if (b.visibility === 'all') return true;
             if (user) {
                 return b.visibility === 'user';
             } else {
                 return b.visibility === 'guest';
             }
        });

        setBanners(filtered);
      } catch (error) {
        console.error("Failed to load carousel data", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadBanners();
  }, []);

  if (isLoading) {
    // 로딩 스켈레톤 (높이만 잡아줌)
    return <div className="w-full aspect-[4/5] bg-slate-100 animate-pulse my-4 rounded-lg mx-4 max-w-[calc(100%-32px)]" />;
  }

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full py-4">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={8} // 간격 8px
        slidesPerView={'auto'} // 너비 자동
        centeredSlides={true}
        // loop={banners.length > 2} // 3개 이상일 때만 루프 (2개일 때 경고 방지)
        // -> Swiper 경고: slidesPerView이 'auto'이고 loop=true면 슬라이드가 충분해야 함.
        // 일단 안전하게 banners.length > 2로 설정하거나, 
        // 2개일 때도 돌리고 싶다면 loopSlides={banners.length} 등을 고려해야 하지만 단순하게 감.
        loop={banners.length > 2} 
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        className="w-full"
      >
        {banners.map((banner, idx) => (
          <SwiperSlide 
            key={banner.id} 
            className="!flex justify-center !w-[calc(100%-32px)]"
          >
            {({ isActive }) => (
              <Link 
                href={banner.link_url || '#'} 
                className={`relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-lg block ${!banner.link_url && 'pointer-events-none'}`}
                style={{ backgroundColor: banner.bg_color || '#000000' }}
              >
                {/* 이미지 */}
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className={`object-cover transition-transform ease-out ${
                    isActive ? 'scale-[1.1] duration-[10000ms]' : 'scale-100 duration-700'
                  }`}
                  priority={idx === 0}
                  sizes="(max-width: 480px) 100vw, 480px"
                />
                
                {/* 하단 그라데이션 */}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* 텍스트 내용 */}
                <div className="absolute bottom-8 left-6 right-6 text-white z-10 text-center">
                  <h2 className="text-2xl font-bold leading-tight whitespace-pre-line mb-2 drop-shadow-md">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-sm font-medium opacity-90 drop-shadow-sm">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </Link>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 우측 하단 숫자 인디케이터 */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 right-[8%] bg-black/30 backdrop-blur-[2px] text-white/90 text-[10px] px-2.5 py-1 rounded-full z-20 font-medium tracking-wide border border-white/10 flex items-center gap-0.5 pointer-events-none">
          <span>{currentIndex + 1}/{banners.length}</span>
          <ChevronRight size={10} strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}
