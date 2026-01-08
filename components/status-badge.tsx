'use client';

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    status: 'open' | 'closed';
    startDate: string; // ISO String (오픈예정 체크용)
    endDate: string; // ISO String (마감시간 체크용)
    className?: string;
}

export default function StatusBadge({ status, startDate, endDate, className }: Props) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [isComingSoon, setIsComingSoon] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            const now = new Date().getTime();
            
            // 0. 오픈예정 체크 (현재시간 < 시작시간)
            if (now < start) {
                setIsComingSoon(true);
                const diff = start - now; // 오픈까지 남은 시간
                
                // hh:mm:ss 포맷팅
                const h = Math.floor(diff / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);
                
                setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
                return;
            }
            setIsComingSoon(false);

            const diff = end - now;

            // 1. 마감 체크
            if (status === 'closed' || diff <= 0) {
                setIsClosed(true);
                return;
            }

            // 2. 24시간 미만 (Urgent)
            const oneDay = 24 * 60 * 60 * 1000;
            if (diff < oneDay) {
                setIsUrgent(true);
                
                // hh:mm:ss 포맷팅
                const h = Math.floor(diff / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);
                
                setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            } else {
                setIsUrgent(false);
            }
        }

        // 초기 실행
        calculateTime();

        // 타이머 시작 (1초마다)
        const timer = setInterval(calculateTime, 1000);

        return () => clearInterval(timer);
    // 52. 의존성 배열에 startDate 추가
    }, [status, startDate, endDate]);

    // 0. 오픈예정 (타이머)
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
                <span>오픈까지 {timeLeft}</span>
            </div>
        )
    }

    // 1. 마감
    if (isClosed) {
        return (
            <div className={cn("absolute top-2 left-2 bg-black/60 backdrop-blur-[2px] text-white/90 border border-white/10 text-[10px] font-bold px-2 py-1 rounded-[4px] z-10", className)}>
                마감
            </div>
        )
    }

    // 2. 임박 (타이머)
    if (isUrgent) {
        return (
            <div
                className={cn(
                    "absolute bg-black/30 backdrop-blur-[2px] text-white/90 font-bold flex items-center justify-center gap-1 z-10 shadow-sm rounded-[4px] border border-white/10",
                    "h-6 px-[5px] text-xs top-2 left-2 w-[calc(100%-16px)]",
                    className
                )}
            >
                <Clock size={12} />
                <span>마감까지 {timeLeft}</span>
            </div>
        )
    }

    // 3. 모집중
    return (
        <div className={cn("absolute top-2 left-2 bg-blue-600/60 backdrop-blur-[2px] text-white border border-white/20 text-[10px] font-bold px-2 py-1 rounded-[4px] z-10", className)}>
            모집중
        </div>
    )
}
