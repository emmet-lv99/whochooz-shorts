import CampaignCard from "@/components/campaign-card";
import ShortsHeader from "@/components/shorts-header";
import { Play } from "lucide-react";
import Link from "next/link";
import { Campaign, campaignService } from "../_services/campaign";
import { Video, videoService } from "../_services/video";

// 통합 아이템 타입 정의
type MixedItem = 
  | { type: 'video', data: Video }
  | { type: 'campaign', data: Campaign };

export default async function ShortsPage() {
  // 1. 데이터 가져오기 (비디오 & 모집중 캠페인)
  const [videos, campaigns] = await Promise.all([
    videoService.getAllList(),
    campaignService.getAllList('open')
  ]);

  // 2. 데이터 병합 (랜덤 삽입)
  const items: MixedItem[] = videos.map(v => ({ type: 'video', data: v }));
  
  if (campaigns.length > 0) {
    // 빈도 조절: 비디오 5개당 캠페인 1개 꼴로 제한
    const maxCampaigns = Math.max(1, Math.floor(videos.length / 5));
    const campaignsToInsert = campaigns.slice(0, maxCampaigns);

    // 캠페인 아이템을 랜덤한 위치에 삽입
    campaignsToInsert.forEach(campaign => {
       const randomIndex = Math.floor(Math.random() * (items.length + 1));
       items.splice(randomIndex, 0, { type: 'campaign', data: campaign });
    });
  }

  return (
    <main className="pb-24 min-h-screen">
       {/* 헤더 */}
       <ShortsHeader />

       {/* Staggered Grid (Masonry-like) */}
       <div className="flex gap-3 px-4 py-4">
          {/* 왼쪽 컬럼 */}
          <div className="flex flex-col gap-3 flex-1">
             {items.filter((_, i) => i % 2 === 0).map((item) => (
                item.type === 'video' 
                  ? <VideoItem key={`v-${item.data.id}`} video={item.data} />
                  : <div key={`c-${item.data.id}`} className="mb-2"><CampaignCard campaign={item.data} /></div>
             ))}
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex flex-col gap-3 flex-1">
             {items.filter((_, i) => i % 2 !== 0).map((item) => (
                item.type === 'video' 
                  ? <VideoItem key={`v-${item.data.id}`} video={item.data} />
                  : <div key={`c-${item.data.id}`} className="mb-2"><CampaignCard campaign={item.data} /></div>
             ))}
          </div>
       </div>

       {/* 데이터 없음 */}
       {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 text-sm">
             <p>등록된 콘텐츠가 없습니다.</p>
          </div>
       )}
    </main>
  )
}

// 개별 비디오 아이템 컴포넌트
function VideoItem({ video }: { video: Video }) {
  return (
    <Link 
      href={`/shorts/${video.id}`} 
      className="relative flex flex-col w-full rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group bg-slate-200"
    >
      {/* 1. 배경 이미지 (부모 높이에 따라 자동으로 늘어남) */}
      <img 
        src={video.thumbnail_url} 
        alt={video.description} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 z-0" 
      />

      {/* 2. 컨텐츠 레이어 (높이를 결정함) */}
      <div className="relative z-10 flex flex-col w-full pointer-events-none">
          {/* 상단 여백 (플레이 버튼 영역 확보 - 3:4 비율 정도 확보) */}
          <div className="w-full aspect-[3/4] flex items-center justify-center">
             <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/40 group-hover:bg-white/40 transition-colors pointer-events-auto">
                <Play className="text-white w-5 h-5 ml-0.5 fill-white" />
             </div>
          </div>

          {/* 하단 텍스트 영역 (내용만큼 늘어남) */}
          <div className="w-full p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-6 -mt-12">
            <p className="text-white text-sm font-bold leading-snug drop-shadow-md break-keep relative z-10">
              {video.description}
            </p>
            <p className="text-white/70 text-xs mt-1.5 line-clamp-3 font-medium leading-relaxed relative z-10">
              {video.campaigns?.hashtags}
            </p>
          </div>
      </div>
    </Link>
  );
}