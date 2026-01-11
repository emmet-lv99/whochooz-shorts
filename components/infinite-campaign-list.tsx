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
      { threshold: 0.1 } 
    )

    observer.observe(element)

    return () => {
        if (element) observer.unobserve(element)
    }
  }, [hasMore, loading, page]) // page가 바뀌면 observer 재등록 (closure 문제 방지)

  const loadMore = async () => {
    if (loading) return
    setLoading(true)
    
    try {
      // 0.5초 딜레이 (UI 확인용, 너무 빠르면 깜빡임)
    //   await new Promise(res => setTimeout(res, 500))

      const nextBatch = await campaignService.getAllList(status, page, 10)
      
      if (nextBatch.length === 0) {
        setHasMore(false)
      } else {
        // 중복 제거 (혹시 모를 페이징 밀림 방지)
        setCampaigns(prev => {
            const newItems = nextBatch.filter(item => !prev.some(p => p.id === item.id))
            if (newItems.length === 0) {
                setHasMore(false)
                return prev
            }
            return [...prev, ...newItems]
        })

        setPage(prev => prev + 1)
        if (nextBatch.length < 10) setHasMore(false) // 가져온 게 10개 미만이면 끝
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

      {/* 로딩 Trigger Area */}
      {hasMore && (
        <div ref={observerRef} className="py-8 flex justify-center w-full">
            {loading ? (
                <Loader2 className="animate-spin text-slate-400 w-6 h-6" />
            ) : (
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
