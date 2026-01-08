// app/shorts/page.tsx
import { videoService } from "../_services/video";
import Link from "next/link";
import { Play } from "lucide-react";

export default async function ShortsPage() {
  // 1. 데이터 가져오기 (Read: 실패 시 빈 배열 반환됨)
  const videos = await videoService.getAllList();

  return (
    <main className="pb-20 bg-black min-h-screen">
       {/* 헤더 */}
       <header className="sticky top-0 z-10 flex items-center h-14 px-4 bg-black/80 backdrop-blur-md border-b border-white/10">
          <h1 className="text-lg font-bold text-white">Shorts</h1>
       </header>

       {/* 2열 그리드 리스트 */}
       <div className="grid grid-cols-2 gap-1 p-1">
          {videos.map((video) => (
             <Link href={`/shorts/${video.id}`} key={video.id} className="relative aspect-[9/16] bg-slate-800">
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title} 
                  className="w-full h-full object-cover" 
                />
                {/* 오버레이 효과 */}
                <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center group">
                   <Play className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" fill="white" />
                </div>
                {/* 제목 (하단 그라데이션) */}
                <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                   <p className="text-white text-sm font-medium line-clamp-1">{video.title}</p>
                </div>
             </Link>
          ))}
       </div>

       {/* 데이터 없음 */}
       {videos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
             <p>등록된 숏츠가 없습니다.</p>
          </div>
       )}
    </main>
  )
}