"use client";

import vipService from "@/app/_services/vip";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import VIPGoldenTickets from "../_components/VIPGoldenTickets";
import VIPHolographicCard from "../_components/VIPHolographicCard";
import VIPInviteCode from "../_components/VIPInviteCode";

function VIPSuccessContent() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 }); // 홀로그래픽 효과용
  const [isInteracting, setIsInteracting] = useState(false); // 유저 인터랙션 여부
  const [autoAngle, setAutoAngle] = useState(0); // 자동 애니메이션 각도

  // 자동 애니메이션: 유저가 인터랙션하지 않을 때 카드가 움직임 (빠른 템포)
  useEffect(() => {
    if (isInteracting) return;
    
    const interval = setInterval(() => {
      setAutoAngle(prev => prev + 2); // 더 빠른 움직임
    }, 30); // 더 짧은 간격
    
    return () => clearInterval(interval);
  }, [isInteracting]);

  // 내 추천 코드 조회
  useEffect(() => {
    async function fetchCode() {
      if (!phone) {
        setIsLoading(false);
        return;
      }

      const result = await vipService.getMyReferralCode(phone);
      setReferralCode(result.code);
      setNickname(result.nickname || "");
      setIsLoading(false);
    }

    fetchCode();
  }, [phone]);

  // 클립보드 복사 (URL)
  const handleCopyLink = async () => {
    if (!referralCode) return;

    const inviteUrl = `${window.location.origin}/vip?code=${referralCode}`;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // 코드만 복사
  const handleCopyCode = async () => {
    if (!referralCode) return;

    try {
      await navigator.clipboard.writeText(referralCode);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="vip-spinner mx-auto mb-6" />
          <p className="text-white/60 text-sm">멤버십을 활성화하고 있습니다...</p>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm text-center">
        
        {/* Header: The Celebration */}
        <div className="animate-slide-up mb-8">
          <h1 className="font-serif-display text-2xl md:text-3xl text-white mb-2">
            Welcome to the Club.
          </h1>
          <p className="text-white/50 text-sm">
            귀하는 WhoChooz의 Founding Crew로 공식 등록되었습니다.
          </p>
        </div>

        {/* [CORE] The Black Metal Card with Holographic Effect */}
        <VIPHolographicCard
          nickname={nickname}
          currentYear={currentYear}
          mousePos={mousePos}
          setMousePos={setMousePos}
          isInteracting={isInteracting}
          setIsInteracting={setIsInteracting}
          autoAngle={autoAngle}
        />

        {/* Rewards: The Golden Tickets */}
        <VIPGoldenTickets />

        {/* Action: Invite Code */}
        {referralCode && (
          <VIPInviteCode
            referralCode={referralCode}
            onCopyCode={handleCopyCode}
            onCopyLink={handleCopyLink}
          />
        )}

        {/* 캡처 유도 문구 */}
        <p className="text-white/20 text-[10px] mt-10 animate-slide-up-delay-3">
          * 카드를 캡처하여 인스타그램 스토리에 인증하세요
        </p>

      </div>

      {/* 토스트 메시지 */}
      <div className={`vip-toast ${showToast ? "show" : ""}`}>
        복사되었습니다
      </div>
    </div>
  );
}

// Suspense로 래핑 (useSearchParams 사용을 위해)
export default function VIPSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="vip-spinner" />
        </div>
      }
    >
      <VIPSuccessContent />
    </Suspense>
  );
}
