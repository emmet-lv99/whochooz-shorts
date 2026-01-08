// app/shorts/[id]/page.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { videoService } from "../../_services/video"; // 경로 주의

interface Props {
  params: { id: string }
}

export default async function ShortsDetailPage({ params }: Props) {
  // 1. 데이터 조회 (JOIN된 캠페인 정보 포함)
  const video = await videoService.getDetail(params.id);

  if (!video) return notFound();

  return (
    <main className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
        {/* 1. 비디오 플레이어 */}
        {/* playsInline: 모바일에서 전체화면 강제 방지 / loop, muted, autoPlay: 숏츠 국룰 */}
        <video 
          src={video.video_url} 
          className="w-full h-full object-cover"
          controls
          playsInline
          loop
          autoPlay 
          muted // 자동재생을 위해 muted 필수 (브라우저 정책)
        />

        {/* 2. 상단 네비게이션 (뒤로가기) */}
        <header className="absolute top-0 left-0 w-full p-4 z-10 bg-gradient-to-b from-black/60 to-transparent">
            <Link href="/shorts" className="text-white">
                <ChevronLeft size={28} />
            </Link>
        </header>

        {/* 3. 하단 정보 & CTA 버튼 (핵심!) */}
        <div className="absolute bottom-0 left-0 w-full p-6 pb-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-4">
            {/* 영상 제목 */}
            <div>
               <h1 className="text-white font-bold text-lg leading-tight">{video.title}</h1>
               {/* 연관된 캠페인이 있을 때만 표시 */}
               {video.campaigns && (
                 <p className="text-blue-400 text-sm font-medium mt-1">@{video.campaigns.brand}</p>
               )}
            </div>

            {/* 캠페인 보러가기 버튼 */}
            {video.campaigns && (
                <Link href={`/campaigns/${video.campaigns.id}`} className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl flex items-center justify-between px-5 animate-bounce-slow">
                        <span>이 캠페인 신청하기</span>
                        <ChevronRight size={20} />
                    </Button>
                </Link>
            )}
        </div>
    </main>
  )
}