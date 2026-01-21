"use client";

import vipService, { CheckInviteResult } from "@/app/_services/vip";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// 한국 휴대폰 번호 정규식
const PHONE_REGEX = /^010-?([0-9]{4})-?([0-9]{4})$/;

// 휴대폰 번호 포맷팅 (010-1234-5678)
function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/[^0-9]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}

type PageState = "loading" | "no-code" | "valid" | "invalid";
type InvalidReason = "GLOBAL_FULL" | "CODE_EXHAUSTED" | "INVALID";

function VIPPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  // 상태
  const [pageState, setPageState] = useState<PageState>("loading");
  const [invalidReason, setInvalidReason] = useState<InvalidReason>("INVALID");
  const [ownerName, setOwnerName] = useState<string>("");

  // 폼 상태
  const [manualCode, setManualCode] = useState("");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // 코드 검증
  useEffect(() => {
    async function verifyCode(codeToVerify: string) {
      setPageState("loading");
      const result: CheckInviteResult = await vipService.checkInviteStatus(codeToVerify);

      if (result.status === "OK") {
        setOwnerName(result.owner_name || "");
        setPageState("valid");
      } else {
        setInvalidReason(result.status as InvalidReason);
        setPageState("invalid");
      }
    }

    if (code) {
      verifyCode(code);
    } else {
      setPageState("no-code");
    }
  }, [code]);

  // 수동 코드 입력 후 검증
  const handleManualCodeSubmit = () => {
    if (!manualCode.trim()) return;
    router.push(`/vip?code=${encodeURIComponent(manualCode.trim())}`);
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // 유효성 검사
    if (!instagram.trim()) {
      setFormError("Instagram ID를 입력해주세요.");
      return;
    }

    if (!PHONE_REGEX.test(phone)) {
      setFormError("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    const result = await vipService.register({
      phone_number: phone,
      nickname: instagram.replace(/^@/, ""), // @ 제거
      invited_by: code!,
    });

    setIsSubmitting(false);

    if (result.success) {
      // 성공 페이지로 이동 (phone 전달)
      router.push(`/vip/success?phone=${encodeURIComponent(phone)}`);
    } else {
      setFormError(result.message || "오류가 발생했습니다.");
    }
  };

  // 로딩 상태
  if (pageState === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="vip-spinner mx-auto mb-6" />
          <p className="text-white/60 text-sm">초대장을 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 코드 없이 진입
  if (pageState === "no-code") {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="animate-slide-up">
            <div className="vip-badge mx-auto mb-8">
              <span className="w-2 h-2 bg-[var(--vip-gold)] rounded-full" />
              PRIVATE ACCESS
            </div>

            <h1 className="font-serif-display text-3xl md:text-4xl text-white mb-4">
              초대 코드가 필요합니다
            </h1>
            <p className="text-white/50 mb-10">
              VIP 멤버로부터 초대 코드를 받으셨나요?
            </p>
          </div>

          <div className="glass-card p-6 animate-slide-up-delay-1">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="초대 코드 입력"
              className="vip-input mb-4 text-center tracking-wider uppercase"
              onKeyDown={(e) => e.key === "Enter" && handleManualCodeSubmit()}
            />
            <button
              onClick={handleManualCodeSubmit}
              disabled={!manualCode.trim()}
              className="vip-button w-full"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 유효하지 않은 코드
  if (pageState === "invalid") {
    const errorMessages: Record<InvalidReason, { title: string; desc: string }> = {
      GLOBAL_FULL: {
        title: "선착순 1,000명이 마감되었습니다",
        desc: "다음 시즌 오픈 시 우선 안내를 받으시겠습니까?",
      },
      CODE_EXHAUSTED: {
        title: "이미 소진된 초대장입니다",
        desc: "이 초대 코드의 모든 티켓이 사용되었습니다.",
      },
      INVALID: {
        title: "잘못된 접근입니다",
        desc: "유효하지 않은 초대 코드입니다.",
      },
    };

    const { title, desc } = errorMessages[invalidReason];

    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center animate-slide-up">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v.01M12 12v-4m0 13a9 9 0 110-18 9 9 0 010 18z"
              />
            </svg>
          </div>

          <h1 className="font-serif-display text-2xl md:text-3xl text-white mb-3">
            {title}
          </h1>
          <p className="text-white/50 mb-8">{desc}</p>

          {(invalidReason === "GLOBAL_FULL" || invalidReason === "CODE_EXHAUSTED") && (
            <button className="vip-button">우선 대기 신청</button>
          )}
        </div>
      </div>
    );
  }

  // 유효한 코드 - 입력 폼 표시
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="animate-slide-up">
            <div className="vip-badge mx-auto mb-8">
              <span className="w-2 h-2 bg-[var(--vip-gold)] rounded-full animate-pulse" />
              FOUNDING CREW
            </div>

            <h1 className="font-serif-display text-4xl md:text-5xl text-white mb-4">
              Dear. Creator
            </h1>
            {ownerName && (
              <div className="space-y-1 text-white/60 text-sm md:text-base">
                <p>
                  <span className="text-vip-gold font-semibold">Founder {ownerName}</span>님이
                  귀하의 감각을 높이 평가하여 초대했습니다.
                </p>
                <p>상위 1%를 위한 프라이빗 멤버십을 시작해 보세요.</p>
              </div>
            )}
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-card p-6 space-y-4 animate-slide-up-delay-1">
            <div>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram ID (@없이 입력)"
                className="vip-input"
                autoComplete="off"
                autoCapitalize="off"
                autoFocus
              />
            </div>

            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                placeholder="010-1234-5678"
                className="vip-input"
                maxLength={13}
              />
            </div>

            {formError && (
              <p className="text-red-400 text-sm text-center">{formError}</p>
            )}
          </div>

          <div className="animate-slide-up-delay-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="vip-button w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  처리 중...
                </>
              ) : (
                "VIP 멤버십 활성화하기 ✨"
              )}
            </button>
          </div>
        </form>

        {/* 하단 안내 */}
        <p className="text-center text-white/30 text-xs mt-8 animate-slide-up-delay-3">
          * 가입 즉시 <span className="text-vip-gold/80">1,000 Point</span>와 <span className="text-vip-gold/80">초대권 3장</span>이 지급됩니다.
        </p>

        {/* --- [NEW] Service Live Preview Section --- */}
        <div className="w-full max-w-sm mx-auto mt-12 mb-4 flex flex-col items-center animate-fade-in">
          
          {/* 1. Status Indicator */}
          <div className="flex items-center space-x-2 mb-4 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
            <span className="text-sm">🟢</span>
            <p className="text-[11px] text-white/60 tracking-wide font-medium">
              LIVE : 비공개 리허설 중
            </p>
          </div>

          {/* 2. Phone Mockup Container */}
          <div className="relative w-[260px] h-[520px] bg-gray-900 rounded-[2.5rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden ring-1 ring-white/10 transform transition-transform hover:scale-105 duration-500">
            
            {/* Dynamic Island (Notch) */}
            <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-xl w-24 mx-auto z-20"></div>

            {/* 3. Actual Service Iframe */}
            <iframe 
              src="https://whochooz-shorts.vercel.app/" 
              className="w-full h-full border-0 bg-white"
              title="WhoChooz Live Preview"
              loading="lazy"
              style={{ 
                filter: 'blur(4px)',
                pointerEvents: 'none',
                userSelect: 'none'
              }} 
            />

            {/* 4. Lock Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
              
              {/* Lock Icon Circle */}
              <div className="w-12 h-12 rounded-full bg-[var(--vip-gold)]/20 flex items-center justify-center mb-4 border border-[var(--vip-gold)]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <svg className="w-5 h-5 text-vip-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <h3 className="text-white font-serif-display text-xl mb-2">Private Access</h3>
              <p className="text-white/60 text-xs font-light leading-relaxed">
                현재 내부 멤버들과 함께<br/>
                비공개 시연을 진행 중입니다.
              </p>

            </div>

            {/* Bottom Gradient Reflection (Detail) */}
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-20"></div>

          </div>

        </div>
        {/* ------------------------------------------- */}
        {/* Trust & Footer Section */}
        <div className="mt-16 w-full border-t border-white/5 pt-8 pb-4 flex flex-col items-center space-y-4 animate-slide-up-delay-3">
          {/* Operator Info */}
          <div className="text-center space-y-1">
            <p className="text-[10px] text-white/30 tracking-widest uppercase">Operated by</p>
            <h4 className="text-sm font-serif-display text-white/50 font-bold tracking-wider">ANMOKGOSU Inc.</h4>
          </div>

          {/* Family Services Links */}
          <div className="flex space-x-6 text-[10px] text-white/30">
            <a
              href="https://anmokgosu.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-vip-gold transition-colors border-b border-transparent hover:border-vip-gold"
            >
              Anmokgosu Media ↗
            </a>
            <span className="text-white/10">|</span>
            <a
              href="https://pf.anmokgosu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-vip-gold transition-colors border-b border-transparent hover:border-vip-gold"
            >
              Pickymall Solution ↗
            </a>
          </div>

          {/* Copyright & Info */}
          <div className="text-[9px] text-white/20 text-center leading-relaxed">
            <p>서울시 강남구 테헤란로 5길 7</p>
            <p>© 2026 WhoChooz Lab. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Suspense로 래핑 (useSearchParams 사용을 위해)
export default function VIPPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="vip-spinner" />
        </div>
      }
    >
      <VIPPageContent />
    </Suspense>
  );
}
