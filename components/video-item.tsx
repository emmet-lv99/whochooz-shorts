import { Video } from '@/app/_services/video';
import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function VideoItem({ video }: { video: Video }) {
  return (
    <Link 
      href={`/shorts/${video.id}`} 
      className="relative flex flex-col w-full rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group bg-slate-200"
    >
      {/* 1. 배경 이미지 (부모 높이에 따라 자동으로 늘어남) */}
      <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src={video.thumbnail_url} 
            alt={video.description} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
            sizes="(max-width: 768px) 50vw, 33vw"
          />
      </div>

      {/* 2. 컨텐츠 레이어 (높이를 결정함) */}
      <div className="relative z-10 flex flex-col w-full pointer-events-none">
          {/* 상단 여백 (플레이 버튼 영역 확보 - 3:4 비율 정도 확보) */}
          <div className="w-full aspect-[3/4] flex items-center justify-center">
             <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/40 group-hover:bg-white/40 transition-colors pointer-events-auto shadow-sm">
                <Play className="text-white w-5 h-5 ml-0.5 fill-white" />
             </div>
          </div>

          {/* 하단 텍스트 영역 (내용만큼 늘어남) */}
          <div className="w-full p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-6 -mt-12">
            <p className="text-white text-sm font-bold leading-snug drop-shadow-md break-keep relative z-10 line-clamp-2">
              {video.description}
            </p>
            <p className="text-white/70 text-xs mt-1.5 line-clamp-1 font-medium leading-relaxed relative z-10">
              {video.campaigns?.hashtags}
            </p>
          </div>
      </div>
    </Link>
  );
}
