import CampaignCard from '@/components/campaign-card';
import MainCarousel from '@/components/main-carousel';
import { Play } from "lucide-react";
import Link from "next/link";
import { campaignService } from "./_services/campaign";
import { videoService } from "./_services/video";

export default async function Home() {
  // 1. 서비스 데이터 호출 (모집중인 캠페인만)
  const allCampaigns = await campaignService.getAllList('open');
  // 최대 10개만 노출
  const campaigns = allCampaigns.slice(0, 10);

  // 2. 비디오 데이터 호출 (최신순)
  const allVideos = await videoService.getAllList();
  const highlightVideos = allVideos.slice(0, 10);

  return (
    <main className="pb-24">
      {/* 메인 캐러셀 */}
      <section className="">
        <MainCarousel />
      </section>

      {/* 섹션 래퍼 */}
      <section className="px-4 py-6">
        
        {/* 2. 섹션 타이틀: 지금 뜨는 캠페인 */}
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-xl font-bold">🔥 지금 뜨는 캠페인</h2>
        </div>
        
        {/* 3. 캠페인 리스트 (2열 그리드) */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        {/* 데이터 없을 경우 */}
        {campaigns.length === 0 && (
          <div className="py-20 text-center text-slate-400 text-sm">
             현재 모집 중인 캠페인이 없습니다.
          </div>
        )}

        {/* 4. 더보기 버튼 (하단) */}
        <div className="mt-8 mb-12">
            <Link href="/campaigns" className="block w-full">
                <button className="w-full h-12 rounded-lg border border-slate-200 bg-white/50 text-slate-600 font-medium text-sm flex items-center justify-center gap-1 hover:bg-white/80 transition-colors active:scale-[0.98]">
                    더 많은 캠페인 보기
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
            </Link>
        </div>

        {/* 5. 캠페인 하이라이트 (Videos) - 가로 스크롤 (참고 이미지 스타일) */}
        {highlightVideos.length > 0 && (
          <div className="mt-8">
            <div className="relative w-full rounded-lg overflow-hidden bg-slate-950/60 backdrop-blur-3xl border border-white/5 border-t-white/20 border-l-white/10 ring-1 ring-black/5 shadow-2xl">
              {/* 배경 오로라 스펙트럼 효과 (Prism/Spectrum Effect) */}
              <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/30 blur-[80px]" />
              <div className="absolute top-[20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-purple-600/30 blur-[80px]" />
              <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-cyan-500/20 blur-[60px]" />
              <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[50px] mix-blend-overlay" />
              
              {/* 노이즈 텍스처 (옵션: 유리의 질감) - 이미지가 없으니 패스하거나 CSS로 흉내 가능하지만 생략 */}
              
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/5 via-transparent to-black/60" />

              <div className="relative z-10 pt-10 pb-8 pl-6">
                {/* 섹션 헤더 */}
                <div className="flex justify-between items-center mb-6 pr-6">
                  <div>
                    <h2 className="text-white text-2xl font-bold leading-tight mb-1.5 drop-shadow-md">
                      캠페인 하이라이트
                    </h2>
                    <p className="text-white/70 text-sm font-medium tracking-tight">
                      캠페인 후기 영상으로 먼저 만나보세요 <span className="text-yellow-200 inline-block align-middle">✨</span>
                    </p>
                  </div>
                  <Link href="/shorts" className="self-start flex-shrink-0 flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 px-2 py-2 rounded-full backdrop-blur-md border border-white/10 transition-all active:scale-95 group/btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 group-hover/btn:text-white/90 group-hover/btn:translate-x-0.5 transition-all"><path d="m9 18 6-6-6-6"/></svg>
                  </Link>
                </div>

                {/* 가로 스크롤 영역 */}
                <div className="flex gap-2 overflow-x-auto pb-4 pr-6 scrollbar-hide snap-x pl-6">
                  {highlightVideos.map((video) => (
                    <Link 
                      key={video.id} 
                      href={`/shorts/${video.id}`}
                      className="flex-shrink-0 w-[240px] aspect-[9/15] relative rounded-lg overflow-hidden group snap-start shadow-xl border border-white/10"
                    >
                      <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      
                      {/* 그라데이션 오버레이 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      
                      {/* 컨텐츠 - 하단 중앙 정렬 느낌 */}
                      <div className="absolute inset-0 p-5 flex flex-col justify-end items-start">
                         {/* Play Button */}
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100 border border-white/30 z-10">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                         </div>

                         {/* 텍스트 */}
                         <div className="transform translate-y-0 transition-transform duration-300 w-full relative z-10">
                            <p className="text-white text-[15px] font-bold leading-tight line-clamp-2 drop-shadow-md mb-3 break-keep">
                              {video.description}
                            </p>
                            <span className="inline-block text-[11px] text-white/90 font-medium px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 hover:bg-white/30 transition-colors">
                              지금 확인
                            </span>
                         </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
