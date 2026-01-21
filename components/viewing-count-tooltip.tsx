'use client';

import { useEffect, useState } from 'react';

export default function ViewingCountTooltip() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // 1. 초기값 설정: 15 ~ 45명 사이 랜덤
    const initialCount = Math.floor(Math.random() * (45 - 15 + 1)) + 15;
    setCount(initialCount);

    // 2. 주기적으로 숫자 변경 (3초 ~ 6초 간격 랜덤)
    const interval = setInterval(() => {
      setCount((prev) => {
        if (!prev) return initialCount;
        
        // -3 ~ +3 사이 랜덤 증감
        const change = Math.floor(Math.random() * 7) - 3; 
        const nextCount = prev + change;

        // 최소 8명, 최대 80명 유지 (너무 적거나 많지 않게)
        if (nextCount < 8) return 8 + Math.floor(Math.random() * 3);
        if (nextCount > 80) return 80 - Math.floor(Math.random() * 3);
        
        return nextCount;
      });
    }, 4500); // 4.5초마다 변경

    return () => clearInterval(interval);
  }, []);

  // 초기 렌더링 시 깜빡임 방지 (null일 땐 렌더링 안함)
  if (!count) return null;

  return (
    <div className="flex justify-center mb-3">
        <div className="relative bg-white px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-slate-100/50 text-[13px] pointer-events-auto animate-bounce-custom">
            <span className="text-slate-600">지금 </span>
            <span className="text-red-500 font-bold">{count}명</span>
            <span className="text-slate-600">이 보고 있어요.</span>
            {/* 말풍선 꼬리 */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2.5 h-2.5 bg-white rotate-45 border-b border-r border-slate-100/50" />
        </div>
    </div>
  );
}
