'use client';

import { formatRemainingTime, getCampaignStatus } from "@/lib/campaign-status";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
  startDate: string;
  endDate: string;
  status: 'open' | 'closed';
}

// 날짜 포맷팅 함수 (1.8(목) 형태)
function formatDateWithDay(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[date.getDay()];
  return `${month}.${day}(${dayName})`;
}

export default function PeriodSection({ startDate, endDate, status }: Props) {
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

  // 마운트 전에는 로딩 스켈레톤 표시
  if (!mounted || !campaignStatus) {
    return (
      <div className="w-full px-5 pt-6 pb-4 bg-white animate-pulse">
        <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
        <div className="h-6 w-40 bg-slate-200 rounded" />
      </div>
    );
  }

  const { isClosed, isComingSoon, isOpen, isUrgent, dday, remainingTime } = campaignStatus;

  // 상태 배지 텍스트 및 스타일
  const getBadge = () => {
    if (isComingSoon) {
      return { text: '오픈예정', className: 'bg-slate-200 text-slate-600' };
    }
    if (isClosed) {
      return { text: '마감', className: 'bg-slate-200 text-slate-400' };
    }
    if (isUrgent) {
      return { text: '마감임박', className: 'bg-red-500 text-white' };
    }
    return { text: '모집중', className: 'bg-blue-600 text-white' };
  };

  const badge = getBadge();

  // 타이머 표시 여부: 모집예정 또는 마감임박
  const showTimer = isComingSoon || (isOpen && isUrgent);

  return (
    <>
    <div className="w-full px-5 pt-6 pb-4 flex items-center justify-between bg-white">
      {/* 좌측: 라벨 + 날짜 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">신청기간</span>
          <span className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded",
            badge.className
          )}>
            {badge.text}
          </span>
        </div>
        <div className={cn(
          "text-base font-medium",
          isClosed ? "text-slate-400" : "text-slate-900"
        )}>
          {formatDateWithDay(startDate)} - {formatDateWithDay(endDate)}
        </div>
      </div>

      {/* 우측: D-Day 또는 마감 또는 오픈예정 */}
      <div className={cn(
        "text-2xl font-bold",
        isClosed ? "text-slate-300" : isComingSoon ? "text-slate-400" : isUrgent ? "text-red-500" : "text-blue-600"
      )}>
        {isClosed ? '마감' : isComingSoon ? '오픈예정' : dday}
      </div>
    </div>

    {/* 타이머 섹션 (오픈예정 또는 마감임박일 때만) */}
    {showTimer && (
      <TimerBanner 
        remainingTime={remainingTime}
        title={isComingSoon ? '오픈까지' : '마감까지'}
      />
    )}
    </>
  );
}

// 타이머 배너 컴포넌트
function TimerBanner({ remainingTime, title }: { remainingTime: number; title: string }) {
  const [timeLeft, setTimeLeft] = useState(formatRemainingTime(remainingTime));

  useEffect(() => {
    // remainingTime이 변경되면 바로 업데이트
    setTimeLeft(formatRemainingTime(remainingTime));
  }, [remainingTime]);

  // 개별 숫자를 박스로 렌더링
  const DigitBox = ({ digit }: { digit: string }) => (
    <span className="inline-flex items-center justify-center w-8 h-10 bg-white text-slate-900 text-xl font-bold rounded">
      {digit}
    </span>
  );

  return (
    <div className="px-5 py-4 bg-white">
      <div className="w-full py-5 bg-slate-800 flex flex-col items-center gap-3 rounded-lg">
      {/* 타이틀 */}
      <div className="text-white font-bold text-base">
        {title}
      </div>
      
      {/* 타이머 */}
      <div className="flex items-center gap-1">
        <DigitBox digit={timeLeft.hours[0]} />
        <DigitBox digit={timeLeft.hours[1]} />
        <span className="text-white text-xl font-bold mx-0.5">:</span>
        <DigitBox digit={timeLeft.minutes[0]} />
        <DigitBox digit={timeLeft.minutes[1]} />
        <span className="text-white text-xl font-bold mx-0.5">:</span>
        <DigitBox digit={timeLeft.seconds[0]} />
        <DigitBox digit={timeLeft.seconds[1]} />
      </div>
    </div>
    </div>
  );
}
