'use client';

import StatusBadge from "@/components/status-badge";
import { getCampaignStatus } from "@/lib/campaign-status";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import LikeButton from "./like-button";

interface Campaign {
    id: string;
    title: string;
    brand: string;
    thumbnail_url: string;
    benefit: string;
    start_date: string;
    end_date: string;
    recruit_count: number;
    status: 'open' | 'closed';
}

interface Props {
    campaign: Campaign;
}

export default function CampaignCard({ campaign }: Props) {
    // 클라이언트에서만 상태 계산
    const [campaignStatus, setCampaignStatus] = useState<ReturnType<typeof getCampaignStatus> | null>(null);

    useEffect(() => {
        setCampaignStatus(getCampaignStatus({
            status: campaign.status,
            startDate: campaign.start_date,
            endDate: campaign.end_date,
        }));
    }, [campaign.status, campaign.start_date, campaign.end_date]);

    // 초기 로딩 시 기본값 사용
    const isClosed = campaignStatus?.isClosed ?? false;

    return (
        <div className="block group relative">
            <div className="flex flex-col gap-3 transition-transform duration-300 hover:scale-95 active:scale-95">
                {/* 썸네일 영역 */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                    <Link href={`/campaigns/${campaign.id}`} className="block w-full h-full">
                        <StatusBadge 
                            status={campaign.status} 
                            startDate={campaign.start_date} 
                            endDate={campaign.end_date} 
                        />
                        <img 
                            src={campaign.thumbnail_url} 
                            className={cn(
                                "w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-90", 
                                isClosed && "grayscale"
                            )} 
                            alt={campaign.title} 
                        />
                    </Link>
                    
                    {/* 좋아요 버튼: 링크 밖, 썸네일 우측 하단에 위치 */}
                    <div className="absolute bottom-2 right-2 z-10">
                        <div className="w-9 h-9 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full hover:bg-black/30 transition-colors border border-white/10">
                            <LikeButton campaignId={campaign.id} iconSize={18} variant="white" />
                        </div>
                    </div>
                </div>

                {/* 텍스트 정보 (별도 링크) */}
                <Link href={`/campaigns/${campaign.id}`} className="space-y-1 block">
                    {/* 타이틀 */}
                    <h3 className={cn(
                        "text-base font-medium leading-tight line-clamp-1", 
                        isClosed ? "text-slate-400" : "text-slate-900"
                    )}>
                        {campaign.title}
                    </h3>
                    
                    {/* 혜택 */}
                    <div className={cn(
                        "text-sm font-bold line-clamp-1", 
                        isClosed ? "text-slate-400" : "text-blue-600"
                    )}>
                        {campaign.benefit}
                    </div>

                    {/* 모집 인원 */}
                    <div className="text-xs text-slate-400 mt-1">
                        모집 {campaign.recruit_count}명
                    </div>
                </Link>
            </div>
        </div>
    );
}
