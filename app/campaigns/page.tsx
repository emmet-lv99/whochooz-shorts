import { campaignService } from "@/app/_services/campaign";
import CampaignHeader from "@/components/campaign-header";
import InfiniteCampaignList from "@/components/infinite-campaign-list";

// 30초마다 캐싱 갱신
export const revalidate = 30;

export default async function CampaignListPage() {
  // 초기 데이터 10개 가져오기
  const initialCampaigns = await campaignService.getAllList('open', 1, 10);

  return (
    <main className="pb-24 min-h-screen bg-slate-50">
      {/* 헤더 */}
      <CampaignHeader />

      {/* 리스트 영역 */}
      <div className="pt-6 px-4">
         <InfiniteCampaignList initialCampaigns={initialCampaigns} status="open" />
      </div>
    </main>
  )
}
