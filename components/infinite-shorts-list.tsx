'use client'

import { Campaign, campaignService } from '@/app/_services/campaign'
import { Video, videoService } from '@/app/_services/video'
import CampaignCard from '@/components/campaign-card'
import VideoItem from '@/components/video-item'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type MixedItem = 
  | { type: 'video', data: Video }
  | { type: 'campaign', data: Campaign };

interface Props {
  initialVideos: Video[]
  initialCampaigns: Campaign[]
}

// 아이템 섞기 함수 (비디오 리스트에 캠페인 랜덤 삽입)
function mixItems(videos: Video[], campaigns: Campaign[]): MixedItem[] {
    const items: MixedItem[] = videos.map(v => ({ type: 'video', data: v }));
    
    if (campaigns.length > 0 && videos.length > 0) {
        // 캠페인을 랜덤한 위치에 삽입
        campaigns.forEach(c => {
             if (items.length === 0) {
                 items.push({ type: 'campaign', data: c });
             } else {
                 const randomIdx = Math.floor(Math.random() * items.length);
                 items.splice(randomIdx, 0, { type: 'campaign', data: c });
             }
        });
    } else if (videos.length === 0 && campaigns.length > 0) {
        return campaigns.map(c => ({ type: 'campaign', data: c }));
    }

    return items;
}

export default function InfiniteShortsList({ initialVideos, initialCampaigns }: Props) {
  const [items, setItems] = useState<MixedItem[]>(() => mixItems(initialVideos, initialCampaigns))
  
  const [page, setPage] = useState(2) // 1페이지는 이미 받음
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
     if (initialVideos.length < 10) {
         setHasMore(false)
     }
  }, [initialVideos])

  useEffect(() => {
    const element = observerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 } 
    )

    observer.observe(element)

    return () => {
        if (element) observer.unobserve(element)
    }
  }, [hasMore, loading, page])

  const loadMore = async () => {
    if (loading) return
    setLoading(true)
    
    try {
      // 비디오 10개, 캠페인 2개 가져오기 (비율 5:1 유지)
      const [nextVideos, nextCampaigns] = await Promise.all([
         videoService.getAllList(page, 10),
         campaignService.getAllList('open', page, 2)
      ]);
      
      if (nextVideos.length === 0) {
        setHasMore(false) // 비디오가 없으면 더 이상 로드 중단 (캠페인만 남았어도 중단)
      } else {
        const newMixed = mixItems(nextVideos, nextCampaigns);
        
        // 중복 제거 (ID 기준)
        setItems(prev => {
            const existingIds = new Set(prev.map(i => i.data.id));
            const filteredNew = newMixed.filter(i => !existingIds.has(i.data.id));
            if (filteredNew.length === 0) return prev;
            return [...prev, ...filteredNew];
        })

        setPage(prev => prev + 1)
        if (nextVideos.length < 10) setHasMore(false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Masonry Layout을 위한 2열 분리
  const leftItems = items.filter((_, i) => i % 2 === 0);
  const rightItems = items.filter((_, i) => i % 2 !== 0);

  return (
    <>
       {/* Staggered Grid (Masonry-like) */}
       <div className="flex gap-3 px-4 py-4 min-h-screen items-start">
          {/* 왼쪽 컬럼 */}
          <div className="flex flex-col gap-3 flex-1">
             {leftItems.map((item) => (
                item.type === 'video' 
                  ? <VideoItem key={`v-${item.data.id}`} video={item.data as Video} />
                  : <div key={`c-${item.data.id}`} className="mb-2"><CampaignCard campaign={item.data as Campaign} /></div>
             ))}
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex flex-col gap-3 flex-1">
             {rightItems.map((item) => (
                item.type === 'video' 
                  ? <VideoItem key={`v-${item.data.id}`} video={item.data as Video} />
                  : <div key={`c-${item.data.id}`} className="mb-2"><CampaignCard campaign={item.data as Campaign} /></div>
             ))}
          </div>
       </div>

      {/* 로딩 Trigger */}
      {hasMore && (
        <div ref={observerRef} className="py-8 flex justify-center w-full">
            {loading ? (
                <Loader2 className="animate-spin text-slate-400 w-6 h-6" />
            ) : (
                <div className="h-4 w-full" /> 
            )}
        </div>
      )}
      
      {!hasMore && items.length > 0 && (
         <div className="py-12 text-center text-slate-300 text-xs font-light">
             모든 콘텐츠를 확인했습니다.
         </div>
      )}
      
      {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 text-sm">
             <p>등록된 콘텐츠가 없습니다.</p>
          </div>
      )}
    </>
  )
}
