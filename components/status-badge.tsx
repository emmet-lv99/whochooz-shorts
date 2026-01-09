'use client';

import { formatRemainingTime, getCampaignStatus } from "@/lib/campaign-status";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    status: 'open' | 'closed';
    startDate: string;
    endDate: string;
    className?: string;
}

export default function StatusBadge({ status, startDate, endDate, className }: Props) {
    // 캠페인 상태 계산 (통합 유틸리티 사용)
    const [campaignStatus, setCampaignStatus] = useState(() => 
        getCampaignStatus({ status, startDate, endDate })
    );

    useEffect(() => {
        // 매 초마다 상태 업데이트
        const interval = setInterval(() => {
            setCampaignStatus(getCampaignStatus({ status, startDate, endDate }));
        }, 1000);
        return () => clearInterval(interval);
    }, [status, startDate, endDate]);

    const { isClosed, isComingSoon, isOpen, isUrgent, remainingTime } = campaignStatus;
    const timeLeft = formatRemainingTime(remainingTime);
    const timeLeftStr = `${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`;

    // 1. 오픈예정 (타이머)
    if (isComingSoon) {
        return (
            <div
                className={cn(
                    "absolute bg-black/30 backdrop-blur-[2px] text-white/90 font-bold flex items-center justify-center gap-1 z-10 shadow-sm rounded-[4px] border border-white/10",
                    "h-6 px-[5px] text-xs top-2 left-2 w-[calc(100%-16px)]", 
                    className
                )}
            >
                <Clock size={12} />
                <span>오픈까지 {timeLeftStr}</span>
            </div>
        )
    }

    // 2. 마감
    if (isClosed) {
        return (
            <div className={cn("absolute top-2 left-2 bg-black/60 backdrop-blur-[2px] text-white/90 border border-white/10 text-[10px] font-bold px-2 py-1 rounded-[4px] z-10", className)}>
                마감
            </div>
        )
    }

    // 3. 마감임박 (타이머) - 24시간 미만
    if (isUrgent && remainingTime < 24 * 60 * 60 * 1000) {
        return (
            <div
                className={cn(
                    "absolute bg-black/30 backdrop-blur-[2px] text-white/90 font-bold flex items-center justify-center gap-1 z-10 shadow-sm rounded-[4px] border border-white/10",
                    "h-6 px-[5px] text-xs top-2 left-2 w-[calc(100%-16px)]",
                    className
                )}
            >
                <Clock size={12} />
                <span>마감까지 {timeLeftStr}</span>
            </div>
        )
    }

    // 4. 모집중
    return (
        <div className={cn("absolute top-2 left-2 bg-blue-600/60 backdrop-blur-[2px] text-white border border-white/20 text-[10px] font-bold px-2 py-1 rounded-[4px] z-10", className)}>
            모집중
        </div>
    )
}
