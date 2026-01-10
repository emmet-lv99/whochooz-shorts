import CampaignCard from '@/components/campaign-card';
import MainCarousel from '@/components/main-carousel';
import Link from "next/link";
import { campaignService } from "./_services/campaign";

export default async function Home() {
  // 1. 서비스 데이터 호출 (모집중인 캠페인만)
  const allCampaigns = await campaignService.getAllList('open');
  // 최대 10개만 노출
  const campaigns = allCampaigns.slice(0, 10);

  return (
    <main className="pb-24">
      {/* 메인 캐러셀 */}
      <section className="">
        <MainCarousel />
      </section>

      {/* 2. 섹션 타이틀 */}
      <section className="px-4 py-6">
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
        <div className="mt-8">
            <Link href="/campaigns" className="block w-full">
                <button className="w-full h-12 rounded-xl border border-slate-200 bg-white/50 text-slate-600 font-medium text-sm flex items-center justify-center gap-1 hover:bg-white/80 transition-colors active:scale-[0.98]">
                    더 많은 캠페인 보기
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
            </Link>
        </div>
      </section>
    </main>
  );
}
