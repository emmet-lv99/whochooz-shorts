'use client'

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    status: 'open' | 'closed';
    endDate: string; // ISO String
}

export default function StatusBadge({ status, endDate }: Props) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const end = new Date(endDate).getTime();
            const now = new Date().getTime();
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
    }, [status, endDate]);

    // 1. 마감 (검정 박스)
    if (isClosed) {
        return (
            <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-[4px] z-10">
                마감
            </div>
        )
    }

    // 2. 임박 (타이머 - 회색 바 전체)
    // * 타이머는 너비를 확보해야 하므로 left-2 right-2 유지 or width 지정 필요.
    // * 요청하신 디자인(타이머 바) 느낌을 살리기 위해 일단 left/right    // 2. 임박 (타이머 - 회색 바 전체)
    if (isUrgent) {
        return (
            <div
                className="absolute bg-gray-800/90 backdrop-blur text-white font-bold flex items-center justify-center gap-1 z-10 shadow-sm rounded-[4px]"
                style={{
                    height: '24px',
                    padding: '0 5px',
                    fontSize: '12px',
                    top: '8px',
                    left: '8px',
                    width: 'calc(100% - 14px)',
                }}
            >
                <Clock size={12} />
                <span>{timeLeft} 남음</span>
            </div>
        )
    }

    // 3. 모집중 (파란 박스)
    return (
        <div className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-[4px] z-10">
            모집중
        </div>
    )
}
