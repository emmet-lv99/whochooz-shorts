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
    // 초기값 null로 설정하여 Hydration 불일치 방지
    const [campaignStatus, setCampaignStatus] = useState<ReturnType<typeof getCampaignStatus> | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // 클라이언트에서만 상태 계산
        setMounted(true);
        setCampaignStatus(getCampaignStatus({ status, startDate, endDate }));
        
        // 매 초마다 상태 업데이트
        const interval = setInterval(() => {
            setCampaignStatus(getCampaignStatus({ status, startDate, endDate }));
        }, 1000);
        return () => clearInterval(interval);
    }, [status, startDate, endDate]);

    // 마운트 전에는 기본 배지 표시 (정적)
    if (!mounted || !campaignStatus) {
        return (
            <div className={cn("absolute top-2 left-2 bg-slate-500/60 backdrop-blur-[2px] text-white border border-white/20 text-[10px] font-bold px-2 py-1 rounded-[4px] z-[5]", className)}>
                로딩중...
            </div>
        );
    }

    const { isClosed, isComingSoon, isUrgent, dday, remainingTime } = campaignStatus;
    const timeLeft = formatRemainingTime(remainingTime);
    const timeLeftStr = `${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`;

    // 1. 오픈예정 (타이머)
    if (isComingSoon) {
        return (
            <div
                className={cn(
                    "absolute bg-black/30 backdrop-blur-[2px] text-white/90 font-bold flex items-center justify-center gap-1 z-[5] shadow-sm rounded-[4px] border border-white/10",
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
            <div className={cn("absolute top-2 left-2 bg-black/60 backdrop-blur-[2px] text-white/90 border border-white/10 text-[10px] font-bold px-2 py-1 rounded-[4px] z-[5]", className)}>
                마감
            </div>
        )
    }

    // 3. 마감임박 (타이머) - 24시간 미만
    if (isUrgent && remainingTime < 24 * 60 * 60 * 1000) {
        return (
            <div
                className={cn(
                    "absolute bg-black/30 backdrop-blur-[2px] text-white/90 font-bold flex items-center justify-center gap-1 z-[5] shadow-sm rounded-[4px] border border-white/10",
                    "h-6 px-[5px] text-xs top-2 left-2 w-[calc(100%-16px)]",
                    className
                )}
            >
                <Clock size={12} />
                <span>마감까지 {timeLeftStr}</span>
            </div>
        )
    }

    // 4. 모집중 (D-Day 포함)
    return (
        <div className={cn("absolute top-2 left-2 bg-blue-600/60 backdrop-blur-[2px] text-white border border-white/20 text-[10px] font-bold px-2 py-1 rounded-[4px] z-[5]", className)}>
            모집중 {dday}
        </div>
    )
}
