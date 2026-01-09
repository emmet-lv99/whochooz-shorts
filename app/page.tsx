import MainCarousel from '@/components/main-carousel';
import StatusBadge from "@/components/status-badge";
import { getCampaignStatus } from '@/lib/campaign-status';
import { cn } from "@/lib/utils";
import Link from "next/link";
import { campaignService } from "./_services/campaign";

export default async function Home() {
  // 1. 서비스 데이터 호출
  const campaigns = await campaignService.getAllList();

  return (
    <main className="pb-20">
  {/* 메인 캐러셀 */}
  <section className="">
    <MainCarousel />
  </section>
  {/* Bottom Nav 공간 확보*/}
      {/* 2. 섹션 타이틀 */}
      <section className="px-4 py-6">
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-lg font-bold">🔥 지금 뜨는 캠페인</h2>
          <Link href="/campaigns" className="text-sm text-slate-500 hover:text-blue-600 active-press">더보기</Link>
        </div>
        
        {/* 3. 캠페인 리스트 (2열 그리드) */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-8">
        {campaigns.map((campaign) => {
           // 통합 유틸리티 사용
           const campaignStatus = getCampaignStatus({
               status: campaign.status,
               startDate: campaign.start_date,
               endDate: campaign.end_date,
           });
           const { isClosed, isComingSoon, dday } = campaignStatus;

           return (
            <Link href={`/campaigns/${campaign.id}`} key={campaign.id} className="block group">
               {/* 카드 디자인 Custom */}
               <div className="flex flex-col gap-3 transition-transform duration-300 hover:scale-95 active:scale-95">
                   {/* 썸네일 */}
                   <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                       <StatusBadge status={campaign.status} startDate={campaign.start_date} endDate={campaign.end_date} />
                       <img 
                          src={campaign.thumbnail_url} 
                          className={cn("w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-90", isClosed && "grayscale")} 
                          alt={campaign.title} 
                       />
                   </div>

                   {/* 텍스트 정보 */}
                   <div className="space-y-1">
                       {/* D-Day */}
                       <div className="flex items-center gap-2 text-xs font-bold">
                           <span className={cn(isClosed ? "text-slate-400" : isComingSoon ? "text-slate-500" : "text-red-500")}>
                               {isComingSoon ? '오픈예정' : dday}
                           </span>
                       </div>
                       
                       {/* 타이틀 */}
                       <h3 className={cn("text-base font-medium leading-tight line-clamp-1", isClosed ? "text-slate-400" : "text-slate-900")}>
                           {campaign.title}
                       </h3>
                       
                       {/* 혜택 (가장 중요) */}
                       <div className={cn("text-sm font-bold line-clamp-1", isClosed ? "text-slate-400" : "text-blue-600")}>
                           {campaign.benefit}
                       </div>

                       {/* 모집 인원 정보 */}
                       <div className="text-xs text-slate-400 mt-1">
                           모집 {campaign.recruit_count}명
                       </div>
                   </div>
               </div>
            </Link>
          )
        })}
        </div>
      {/* 데이터 없을 경우 */}
      {campaigns.length === 0 && (
          <div className="py-20 text-center text-slate-400 text-sm">
             진행 중인 캠페인이 없습니다.
          </div>
      )}
      </section>
    </main>
  );
}
