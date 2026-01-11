'use client'

import { Campaign, campaignService } from '@/app/_services/campaign'
import CampaignCard from '@/components/campaign-card'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Props {
  initialCampaigns: Campaign[]
  status?: 'open' | 'closed'
}

export default function InfiniteCampaignList({ initialCampaigns, status = 'open' }: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [page, setPage] = useState(2) // 1페이지는 이미 받음
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  // 초기 데이터가 적으면 더 불러올 필요 없음
  useEffect(() => {
    if (initialCampaigns.length < 10) {
        setHasMore(false)
    }
  }, [initialCampaigns])

  useEffect(() => {
    const element = observerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      // rootMargin: '200px' -> 스크롤 바닥 닿기 200px 전 미리 로딩
      { threshold: 0, rootMargin: '200px' } 
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
      // API 호출 (다음 페이지)
      const nextBatch = await campaignService.getAllList(status, page, 10)
      
      if (nextBatch.length === 0) {
        setHasMore(false)
      } else {
        // 중복 제거 및 추가
        setCampaigns(prev => {
            const newItems = nextBatch.filter(item => !prev.some(p => p.id === item.id))
            if (newItems.length === 0) {
                // 가져왔는데 다 중복이면 -> 사실상 끝? 아니면 다음 페이지 시도?
                // 여기서는 끝난 것으로 간주하거나 page만 올릴 수도 있음.
                // 일단 중복이 많으면 hasMore false 처리하는게 안전.
                setHasMore(false) 
                return prev
            }
            return [...prev, ...newItems]
        })

        setPage(prev => prev + 1)
        if (nextBatch.length < 10) setHasMore(false) 
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

      {hasMore && (
        <div ref={observerRef} className="py-6 flex justify-center w-full min-h-[60px] items-center">
            {loading ? (
                <Loader2 className="animate-spin text-slate-400 w-6 h-6" />
            ) : (
                // 투명한 트리거 영역 (높이 확보)
                <div className="h-4 w-full" /> 
            )}
        </div>
      )}
      
      {!hasMore && campaigns.length > 0 && (
         <div className="py-12 text-center text-slate-300 text-xs font-light">
             모든 캠페인을 확인했습니다.
         </div>
      )}
      
      {campaigns.length === 0 && (
          <div className="py-20 text-center text-slate-400 text-sm">
             현재 모집 중인 캠페인이 없습니다.
          </div>
      )}
    </>
  )
}
