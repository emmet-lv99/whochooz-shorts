"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import vipService, { CheckInviteResult } from "@/app/_services/vip";

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
              <span className="w-2 h-2 bg-[var(--vip-gold)] rounded-full" />
              FOUNDING CREW
            </div>

            <h1 className="font-serif-display text-3xl md:text-4xl text-white mb-3">
              Welcome.
            </h1>
            {ownerName && (
              <p className="text-white/60">
                <span className="text-vip-gold font-medium">{ownerName}</span>님의 초대입니다.
              </p>
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
                placeholder="Instagram ID (@)"
                className="vip-input"
                autoComplete="off"
                autoCapitalize="off"
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
                "Activate Membership"
              )}
            </button>
          </div>
        </form>

        {/* 하단 안내 */}
        <p className="text-center text-white/30 text-xs mt-8 animate-slide-up-delay-3">
          가입 시 마스터 권한(초대권 3장)이 부여됩니다.
        </p>
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
