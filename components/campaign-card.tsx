'use client';

import StatusBadge from "@/components/status-badge";
import { getCampaignStatus } from "@/lib/campaign-status";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    // 클라이언트에서만 상태 계산 (Hydration 불일치 방지)
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
        <Link href={`/campaigns/${campaign.id}`} className="block group">
            <div className="flex flex-col gap-3 transition-transform duration-300 hover:scale-95 active:scale-95">
                {/* 썸네일 */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
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
                </div>

                {/* 텍스트 정보 */}
                <div className="space-y-1">
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
                </div>
            </div>
        </Link>
    );
}
