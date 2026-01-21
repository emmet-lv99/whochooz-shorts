"use client";

import vipService from "@/app/_services/vip";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="font-serif-display text-2xl md:text-3xl text-white mb-2">
            Welcome to the Club.
          </h1>
          <p className="text-white/50 text-sm">
            귀하는 WhoChooz의 Founding Crew로 공식 등록되었습니다.
          </p>
        </div>

        {/* [CORE] The Black Metal Card with Holographic Effect */}
        <div className="animate-slide-up-delay-1 mb-8 perspective-1000">
          <div 
            className="relative w-full aspect-[1.58/1] rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 ease-out group cursor-pointer"
            style={{
              transform: isInteracting 
                ? `perspective(1000px) rotateY(${(mousePos.x - 50) * 0.35}deg) rotateX(${(50 - mousePos.y) * 0.35}deg)`
                : `perspective(1000px) rotateY(${-8 + Math.sin(autoAngle * 0.02) * 12}deg) rotateX(${5 + Math.cos(autoAngle * 0.015) * 6}deg)`,
              transformStyle: 'preserve-3d',
            }}
            onMouseMove={(e) => {
              setIsInteracting(true);
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setMousePos({ x, y });
            }}
            onMouseLeave={() => {
              setIsInteracting(false);
              setMousePos({ x: 50, y: 50 });
            }}
            onTouchMove={(e) => {
              setIsInteracting(true);
              const touch = e.touches[0];
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((touch.clientX - rect.left) / rect.width) * 100;
              const y = ((touch.clientY - rect.top) / rect.height) * 100;
              setMousePos({ x, y });
            }}
            onTouchEnd={() => {
              setIsInteracting(false);
              setMousePos({ x: 50, y: 50 });
            }}
          >
            
            {/* 1. Metal Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"></div>
            
            {/* 2. Aurora Effect (은은한 오로라) */}
            <div 
              className="absolute inset-0 opacity-40 mix-blend-screen"
              style={{
                background: `
                  linear-gradient(
                    ${autoAngle * 0.3}deg,
                    rgba(76, 0, 255, 0.3) 0%,
                    rgba(0, 255, 200, 0.2) 25%,
                    rgba(255, 100, 200, 0.2) 50%,
                    rgba(100, 200, 255, 0.3) 75%,
                    rgba(200, 100, 255, 0.2) 100%
                  )
                `,
              }}
            ></div>

            {/* 3. Holographic Soft Glow */}
            <div 
              className="absolute inset-0 opacity-20 mix-blend-soft-light transition-opacity duration-500"
              style={{
                background: `
                  radial-gradient(
                    ellipse 80% 60% at ${isInteracting ? mousePos.x : 50 + Math.sin(autoAngle * 0.02) * 30}% ${isInteracting ? mousePos.y : 50 + Math.cos(autoAngle * 0.015) * 25}%,
                    rgba(212,175,55,0.6) 0%,
                    rgba(255,245,220,0.3) 30%,
                    rgba(180,150,100,0.1) 60%,
                    transparent 100%
                  )
                `,
              }}
            ></div>
            
            {/* 4. Subtle Shine Highlight */}
            <div 
              className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
              style={{
                background: `
                  radial-gradient(
                    ellipse 60% 40% at ${isInteracting ? mousePos.x : 50 + Math.sin(autoAngle * 0.02) * 30}% ${isInteracting ? mousePos.y : 50 + Math.cos(autoAngle * 0.015) * 25}%,
                    rgba(255,255,255,0.5) 0%,
                    rgba(255,255,255,0.15) 40%,
                    transparent 70%
                  )
                `,
              }}
            ></div>
            
            {/* 4. Gold Glow Border */}
            <div className="absolute inset-0 border-2 border-[#D4AF37]/50 rounded-2xl shadow-[inset_0_0_20px_rgba(212,175,55,0.2)]"></div>
            
            {/* 5. Sparkle Effect (on hover) */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
              <div className="absolute top-[40%] right-[20%] w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-100 shadow-[0_0_8px_white]"></div>
              <div className="absolute bottom-[30%] left-[60%] w-1 h-1 bg-white rounded-full animate-pulse delay-200 shadow-[0_0_10px_white]"></div>
            </div>
            
            {/* Card Content */}
            <div className="relative z-10 p-6 flex flex-col justify-between h-full text-left">
              
              {/* Top Row: Logo & VIP Access */}
              <div className="flex justify-between items-start">
                <div className="text-white/90 font-serif text-lg tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  WhoChooz
                </div>
                <div className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  VIP ACCESS
                </div>
              </div>
              
              {/* Center: User Nickname (Gold Gradient with 3D effect) */}
              <div className="flex-1 flex items-center justify-center">
                <h2 
                  className="text-2xl md:text-3xl font-bold font-serif tracking-widest uppercase bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(212,175,55,0.3))',
                  }}
                >
                  {nickname || "MEMBER"}
                </h2>
              </div>
              
              {/* Bottom Row: IC Chip & Member Since */}
              <div className="flex justify-between items-end">
                {/* IC Chip Graphic */}
                <div className="w-10 h-8 rounded-sm bg-gradient-to-br from-[#D4AF37] via-[#FCF6BA] to-[#B38728] opacity-90 flex items-center justify-center shadow-lg">
                  <div className="w-6 h-5 border border-black/30 rounded-sm bg-gradient-to-br from-[#FCF6BA] to-[#B38728]">
                    <div className="grid grid-cols-3 gap-px p-0.5">
                      <div className="h-1 bg-black/20 rounded-sm"></div>
                      <div className="h-1 bg-black/20 rounded-sm"></div>
                      <div className="h-1 bg-black/20 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-white/50 text-[10px] tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  MEMBER SINCE {currentYear}
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Rewards: The Golden Tickets */}
        <div className="animate-slide-up-delay-2 mb-8">
          <div className="bg-white/5 border border-[#D4AF37]/20 rounded-xl p-5 backdrop-blur-sm">
            <p className="text-[#D4AF37] text-xs font-medium uppercase tracking-widest mb-2">
              🎁 Special Authority Granted
            </p>
            <h3 className="text-white text-lg font-serif mb-3">
              신뢰할 수 있는 동료 <span className="text-[#D4AF37] font-bold">3명</span>을 직접 초대하세요
            </h3>
            <div className="flex justify-center gap-3 mb-3">
              <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">🎟️</span>
              <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">🎟️</span>
              <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">🎟️</span>
            </div>
            <p className="text-white/40 text-xs">
              각 티켓은 <span className="text-white/70">1명</span>을 초대할 수 있습니다
            </p>
          </div>
        </div>

        {/* Action: Invite Code */}
        {referralCode && (
          <div className="animate-slide-up-delay-3">
            <div className="bg-black/30 border border-[#D4AF37]/30 rounded-xl p-5">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
                나의 초대 코드
              </p>
              
              <div
                onClick={handleCopyCode}
                className="bg-black/50 rounded-lg py-3 px-4 mb-4 cursor-pointer hover:bg-black/70 transition-colors border border-white/5"
              >
                <p className="font-mono text-xl text-[#D4AF37] tracking-widest">
                  {referralCode}
                </p>
              </div>
              
              <button
                onClick={handleCopyLink}
                className="w-full bg-[#D4AF37] hover:bg-[#b89628] text-[#1a1a1a] font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                초대 링크 복사
              </button>
            </div>
          </div>
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
