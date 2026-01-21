"use client";

import vipService, { CheckInviteResult } from "@/app/_services/vip";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import VIPLoadingState from "./_components/VIPLoadingState";
import VIPNoCodeState from "./_components/VIPNoCodeState";

// 컴포넌트 imports

import VIPLivePreview from "./_components/VIPLivePreview";
import VIPServiceIntro from "./_components/VIPServiceIntro";
import VIPValidForm from "./_components/VIPValidForm";

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


function VIPPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  // 상태
  const [pageState, setPageState] = useState<PageState>("loading");

  const [ownerName, setOwnerName] = useState<string>("");

  // 폼 상태
  const [manualCode, setManualCode] = useState("");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isOpen, setIsOpen] = useState(false); // What is WhoChooz 토글 상태





  // 코드 검증
  useEffect(() => {
    async function verifyCode(codeToVerify: string) {
      setPageState("loading");
      const result: CheckInviteResult = await vipService.checkInviteStatus(codeToVerify);

      if (result.status === "OK") {
        setOwnerName(result.owner_name || "");
        setPageState("valid");
      } else if (result.status === "GLOBAL_FULL") {
        router.replace("/vip/waitlist?reason=global");
      } else {
        router.replace(`/vip/waitlist?reason=code&code=${encodeURIComponent(codeToVerify)}`);
      }
    }

    if (code) {
      verifyCode(code);
    } else {
      setPageState("no-code");
    }
  }, [code, router]);

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
    return <VIPLoadingState />;
  }

  // 코드 없이 진입
  if (pageState === "no-code") {
    return (
      <VIPNoCodeState
        manualCode={manualCode}
        setManualCode={setManualCode}
        onSubmit={handleManualCodeSubmit}
      />
    );
  }

  // 유효하지 않은 코드 (리다이렉트 중)
  if (pageState === "invalid") {
    return <VIPLoadingState />;
  }

  // 유효한 코드 - 입력 폼 표시
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 break-keep">
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
              <div className="space-y-1 text-white/60 text-sm md:text-base break-keep">
              <p>
                <span className="text-vip-gold font-semibold">{ownerName}</span>님이
                크리에이터님의 특별한 감각을 알아보고 초대했습니다.
              </p>
              <p>오직 상위 1%를 위한 프라이빗 멤버십에 합류하세요.</p>
            </div>
            )}
          </div>
        </div>

        {/* --- [FINAL CORRECTED] Service Intro Toggle --- */}
        <VIPServiceIntro isOpen={isOpen} setIsOpen={setIsOpen} />
        {/* ----------------------------------------------- */}

        {/* 폼 */}
        {/* 폼 */}
        <VIPValidForm
          instagram={instagram}
          setInstagram={setInstagram}
          phone={phone}
          setPhone={setPhone}
          formError={formError}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          formatPhoneNumber={formatPhoneNumber}
        />

        {/* 하단 안내 */}
        <p className="text-center text-white/30 text-xs mt-8 animate-slide-up-delay-3 break-keep">
        * 멤버십 등록 즉시 <span className="text-vip-gold/80">1,000 Point</span>와 <span className="text-vip-gold/80">초대권 3장</span>을 선물로 드려요.
      </p>

        {/* --- [FINAL POLISH] Service Live Preview Section --- */}
        <VIPLivePreview />

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
