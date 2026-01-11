import { campaignService } from "@/app/_services/campaign";
import InfiniteCampaignList from "@/components/infinite-campaign-list";
import { ChevronLeft } from 'lucide-react';
import Link from "next/link";

// 30초마다 캐싱 갱신
export const revalidate = 30;

export default async function CampaignListPage() {
  // 초기 데이터 10개 가져오기
  const initialCampaigns = await campaignService.getAllList('open', 1, 10);

  return (
    <main className="pb-24 min-h-screen bg-slate-50">
      {/* 헤더 */}
      <div className="fixed top-0 inset-x-0 h-14 bg-white/80 backdrop-blur-xl z-50 flex items-center px-4 border-b border-slate-200/50">
         <Link href="/" className="p-2 -ml-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
             <ChevronLeft size={24} />
         </Link>
         <h1 className="text-lg font-bold ml-1 text-slate-900">전체 캠페인</h1>
      </div>

      {/* 리스트 영역 */}
      <div className="pt-20 px-4">
         <InfiniteCampaignList initialCampaigns={initialCampaigns} status="open" />
      </div>
    </main>
  )
}
