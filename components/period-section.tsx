'use client';

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
  startDate: string;
  endDate: string;
  status: 'open' | 'closed';
}

// D-Day 계산 함수
function getDday(endDateStr: string): { text: string; isUrgent: boolean; isClosed: boolean } {
  const end = new Date(endDateStr);
  const now = new Date();
  end.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: '마감', isUrgent: false, isClosed: true };
  if (diffDays === 0) return { text: 'D-Day', isUrgent: true, isClosed: false };
  if (diffDays <= 3) return { text: `D-${diffDays}`, isUrgent: true, isClosed: false };
  return { text: `D-${diffDays}`, isUrgent: false, isClosed: false };
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

// 오픈예정 여부 체크
function isComingSoon(startDateStr: string): boolean {
  const start = new Date(startDateStr);
  const now = new Date();
  return now < start;
}

export default function PeriodSection({ startDate, endDate, status }: Props) {
  const [dday, setDday] = useState(getDday(endDate));
  const [comingSoon, setComingSoon] = useState(isComingSoon(startDate));

  useEffect(() => {
    // 매 초마다 업데이트 (자정에 D-Day 변경 반영)
    const interval = setInterval(() => {
      setDday(getDday(endDate));
      setComingSoon(isComingSoon(startDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const isClosed = status === 'closed' || dday.isClosed;

  // 상태 배지 텍스트 및 스타일
  const getBadge = () => {
    if (comingSoon) {
      return { text: '오픈예정', className: 'bg-slate-200 text-slate-600' };
    }
    if (isClosed) {
      return { text: '마감', className: 'bg-slate-200 text-slate-400' };
    }
    if (dday.isUrgent) {
      return { text: '마감임박', className: 'bg-red-500 text-white' };
    }
    return { text: '모집중', className: 'bg-blue-600 text-white' };
  };

  const badge = getBadge();

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
        isClosed ? "text-slate-300" : comingSoon ? "text-slate-400" : dday.isUrgent ? "text-red-500" : "text-blue-600"
      )}>
        {isClosed ? '마감' : comingSoon ? '오픈예정' : dday.text}
      </div>
    </div>

    {/* 타이머 섹션 (오픈예정 또는 마감임박일 때만) */}
    {(comingSoon || dday.isUrgent) && (
      <TimerBanner 
        targetDate={comingSoon ? startDate : endDate}
        title={comingSoon ? '오픈까지' : '마감까지'}
      />
    )}
    </>
  );
}

// 타이머 배너 컴포넌트
function TimerBanner({ targetDate, title }: { targetDate: string; title: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

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
