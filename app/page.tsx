import CampaignCard from '@/components/campaign-card';
import MainCarousel from '@/components/main-carousel';
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

      {/* 2. 섹션 타이틀 */}
      <section className="px-4 py-6">
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-lg font-bold">🔥 지금 뜨는 캠페인</h2>
          <Link href="/campaigns" className="text-sm text-slate-500 hover:text-blue-600 active-press">더보기</Link>
        </div>
        
        {/* 3. 캠페인 리스트 (2열 그리드) */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-8">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
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
