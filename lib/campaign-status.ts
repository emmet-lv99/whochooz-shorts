// lib/campaign-status.ts
// 캠페인 상태 계산 유틸리티 (심플 버전)

export type CampaignState = 'coming_soon' | 'open' | 'closed';

interface CampaignStatusParams {
  status: 'open' | 'closed';  // DB status (강제 마감용)
  startDate: string;           // 모집 시작일
  endDate: string;             // 모집 마감일
}

interface CampaignStatusResult {
  state: CampaignState;        // 계산된 상태: 마감 | 모집예정 | 모집중
  isClosed: boolean;           // 마감 여부
  isComingSoon: boolean;       // 모집예정 여부
  isOpen: boolean;             // 모집중 여부
  isUrgent: boolean;           // 마감임박 여부 (D-3 이하, UI 스타일용)
  dday: string;                // D-Day 텍스트
  remainingTime: number;       // 남은 시간 (ms) - 타이머용
}

/**
 * 캠페인 상태 계산 함수 (심플 버전)
 * 
 * 3가지 상태:
 * 1. 마감: status === 'closed' || now > end_date
 * 2. 모집예정: status !== 'closed' && now < start_date
 * 3. 모집중: status !== 'closed' && start_date <= now <= end_date
 */
export function getCampaignStatus({
  status,
  startDate,
  endDate,
}: CampaignStatusParams): CampaignStatusResult {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 1. 마감: status === 'closed' || now > end_date
  if (status === 'closed' || now > end) {
    return {
      state: 'closed',
      isClosed: true,
      isComingSoon: false,
      isOpen: false,
      isUrgent: false,
      dday: '마감',
      remainingTime: 0,
    };
  }

  // 2. 모집예정: now < start_date
  if (now < start) {
    const remainingTime = start.getTime() - now.getTime();
    return {
      state: 'coming_soon',
      isClosed: false,
      isComingSoon: true,
      isOpen: false,
      isUrgent: false,
      dday: '오픈예정',
      remainingTime,
    };
  }

  // 3. 모집중: start_date <= now <= end_date
  const remainingTime = end.getTime() - now.getTime();
  
  // D-Day 계산 (날짜 기준, 표시용)
  const endDate0 = new Date(endDate);
  const nowDate0 = new Date();
  endDate0.setHours(0, 0, 0, 0);
  nowDate0.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((endDate0.getTime() - nowDate0.getTime()) / (1000 * 60 * 60 * 24));

  // 마감임박: D-3 이하 (UI 스타일 변형용)
  const isUrgent = diffDays <= 3;
  const dday = diffDays === 0 ? 'D-Day' : `D-${diffDays}`;

  return {
    state: 'open',
    isClosed: false,
    isComingSoon: false,
    isOpen: true,
    isUrgent,
    dday,
    remainingTime,
  };
}

/**
 * 남은 시간을 HH:MM:SS 형식으로 변환
 */
export function formatRemainingTime(remainingMs: number): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  if (remainingMs <= 0) {
    return { hours: '00', minutes: '00', seconds: '00' };
  }

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
}
