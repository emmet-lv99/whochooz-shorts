import InfiniteShortsList from "@/components/infinite-shorts-list";
import ShortsHeader from "@/components/shorts-header";
import { campaignService } from "../_services/campaign";
import { videoService } from "../_services/video";

export default async function ShortsPage() {
  // 1. 초기 데이터 가져오기 (비디오 10개, 캠페인 2개)
  const [videos, campaigns] = await Promise.all([
    videoService.getAllList(1, 10),
    campaignService.getAllList('open', 1, 2)
  ]);

  return (
    <main className="pb-24 min-h-screen">
       {/* 헤더 */}
       <ShortsHeader />

       {/* 무한 스크롤 리스트 */}
       <InfiniteShortsList initialVideos={videos} initialCampaigns={campaigns} />
    </main>
  )
}