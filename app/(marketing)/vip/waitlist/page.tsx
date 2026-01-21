'use client';

import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const PHONE_REGEX = /^010-?([0-9]{4})-?([0-9]{4})$/;

function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/[^0-9]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}

function WaitlistContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason'); 
  const inviterCode = searchParams.get('code') || null; 
  
  const [instagramId, setInstagramId] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const reasonText = reason === 'global' 
    ? "아쉽게도 Season 1 Founding Crew 모집이 모두 마감되었어요."
    : "이 초대장은 유효 기간이 지났거나, 이미 사용된 티켓이에요.";

  const handleJoin = async () => {
    // 1. 유효성 검사
    if (!instagramId.trim() || !phone.trim()) {
      alert("Instagram ID와 전화번호를 모두 입력해주세요.");
      return;
    }

    if (!PHONE_REGEX.test(phone)) {
      alert("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. 전화번호 포맷 통일 (하이픈 제거)
      const cleanPhone = phone.replace(/-/g, '').trim();

      // 3. 중복 확인 (이미 예약한 사람인지 체크)
      const { data: existingUser, error: checkError } = await supabase
        .from('waitlist')
        .select('id')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        alert("이미 예약된 번호예요. 알림 메시지를 조금만 기다려주세요! 😊");
        setIsSubmitted(true);
        return;
      }

      // 4. 데이터 저장 (Insert)
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({
          name: instagramId, // Instagram ID를 name 컬럼에 저장
          phone: cleanPhone,
          reason: reason || 'unknown',
          inviter_code: inviterCode,
          status: 'reserved'
        });

      if (insertError) throw insertError;

      // 5. 성공 처리
      setIsSubmitted(true);

    } catch (error) {
      console.error('Waitlist Save Error:', error);
      alert("예약 처리 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center animate-fade-in relative overflow-hidden">
      
      {/* Background Effect - Aurora with Dark Overlay */}
      <div className="vip-background saturate-50" />
      <div className="absolute inset-0 bg-black/20 z-0" />

      <div className="relative z-10 w-full max-w-sm">
        {/* 1. Icon */}
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] mx-auto backdrop-blur-md">
          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* 2. Message */}
        <div className="mb-10 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-serif-display text-white mb-2 tracking-tight drop-shadow-lg">
            Season 2 Priority
          </h1>
          <p className="text-[#D4AF37] text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-6 opacity-80">
            2차 VIP 모집 사전 예약
          </p>
          
          <div className="text-white/40 text-sm leading-relaxed bg-white/5 rounded-xl p-4 border border-white/5 break-keep">
            <p className="mb-1 text-white/60">{reasonText}</p>
            <p className="text-xs">
              지금 예약해 두시면, 다음 시즌 오픈 시<br/>
              <span className="text-white/90 font-medium border-b border-white/20 pb-0.5">가장 먼저</span> 초대장을 보내드릴게요.
            </p>
          </div>
        </div>

        {/* 3. Reservation Form */}
        {!isSubmitted ? (
          <div className="w-full space-y-4 transition-all duration-500">
            <div className="relative">
              <input 
                type="text" 
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value)}
                placeholder="Instagram ID (@없이 입력)"
                autoCapitalize="off"
                autoComplete="off"
                className="vip-input text-center focus:border-white/50 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.1)] focus:bg-white/10"
              />
            </div>
            <div className="relative">
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                placeholder="010-1234-5678"
                maxLength={13}
                className="vip-input text-center tracking-widest focus:border-white/50 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.1)] focus:bg-white/10"
              />
            </div>
            
            <button 
              onClick={handleJoin}
              disabled={isLoading}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all text-sm tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.15)] disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? '잠시만 기다려주세요...' : '2차 모집 알림 신청하기'}
            </button>
            
            <p className="text-[10px] text-white/30 mt-4 animate-pulse break-keep">
              * 추가 모집(Scale-up) 시작 시 제일 먼저 챙겨드릴게요.
            </p>
          </div>
        ) : (
          /* 4. Success Message */
          <div className="animate-fade-in-up p-8 glass-card border-white/10 w-full">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="text-white text-base font-medium mb-1 break-keep">알림 신청이 완료되었어요.</p>
            <p className="text-white/40 text-xs break-keep">
              다음 시즌이 열리면 남겨주신 연락처로<br/>제일 먼저 소식을 전해드릴게요.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="fixed bottom-8 left-0 right-0 opacity-30 grayscale pointer-events-none text-center">
          <span className="text-[10px] font-serif-display text-white tracking-widest uppercase">ANMOKGOSU Inc.</span>
        </div>
      </div>
    </div>
  );
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <WaitlistContent />
    </Suspense>
  );
}
