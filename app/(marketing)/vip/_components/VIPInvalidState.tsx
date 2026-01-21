type InvalidReason = "GLOBAL_FULL" | "CODE_EXHAUSTED" | "INVALID";

// 휴대폰 번호 포맷팅 (010-1234-5678)
function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/[^0-9]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}

interface VIPInvalidStateProps {
  invalidReason: InvalidReason;
  waitlistName: string;
  setWaitlistName: (name: string) => void;
  waitlistPhone: string;
  setWaitlistPhone: (phone: string) => void;
  waitlistLoading: boolean;
  waitlistSubmitted: boolean;
  onWaitlistSubmit: () => void;
}

const errorMessages: Record<InvalidReason, { titleEn: string; desc: React.ReactNode }> = {
  GLOBAL_FULL: {
    titleEn: "Season 1 Sold Out",
    desc: (
      <>
        Founding Crew 1,000명 모집이<br/>
        <span className="text-white font-bold">전석 마감</span>되었습니다.
      </>
    ),
  },
  CODE_EXHAUSTED: {
    titleEn: "Invitation Expired",
    desc: (
      <>
        이 초대장의 유효 기간이 만료되었거나<br/>
        발급된 티켓이 모두 소진되었습니다.
      </>
    ),
  },
  INVALID: {
    titleEn: "Invalid Access",
    desc: "유효하지 않은 초대 코드입니다.",
  },
};

// Silver Theme (Gold는 VIP 전용)
export default function VIPInvalidState({
  invalidReason,
  waitlistName,
  setWaitlistName,
  waitlistPhone,
  setWaitlistPhone,
  waitlistLoading,
  waitlistSubmitted,
  onWaitlistSubmit,
}: VIPInvalidStateProps) {
  const { titleEn, desc } = errorMessages[invalidReason];

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center animate-slide-up">
        
        {/* Icon: Sold Out / Closed (Silver Theme) */}
        <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>

        {/* Title: English for premium vibe */}
        <h1 className="text-2xl md:text-3xl font-serif text-white mb-3 tracking-tight">
          {titleEn}
        </h1>
        
        <div className="text-white/50 text-sm leading-relaxed mb-10">
          {desc}
        </div>

        {/* Waitlist Form: Silver Theme */}
        {(invalidReason === "GLOBAL_FULL" || invalidReason === "CODE_EXHAUSTED") && (
          <>
            {!waitlistSubmitted ? (
              <div className="w-full space-y-3 transition-all duration-500">
                <input 
                  type="text" 
                  value={waitlistName}
                  onChange={(e) => setWaitlistName(e.target.value)}
                  placeholder="이름"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder:text-white/20 focus:border-gray-500 focus:bg-white/10 focus:outline-none transition-colors text-center text-sm"
                />

                <input 
                  type="tel" 
                  value={waitlistPhone}
                  onChange={(e) => setWaitlistPhone(formatPhoneNumber(e.target.value))}
                  placeholder="010-1234-5678"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder:text-white/20 focus:border-gray-500 focus:bg-white/10 focus:outline-none transition-colors text-center tracking-widest text-sm"
                />
                
                <button 
                  onClick={onWaitlistSubmit}
                  disabled={!waitlistName || !waitlistPhone || waitlistLoading}
                  className="w-full bg-white text-black font-medium py-3.5 rounded-lg hover:bg-gray-200 transition-all text-sm tracking-wide shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {waitlistLoading ? "처리 중..." : "2차 모집 알림 예약하기"}
                </button>
                
                <p className="text-[10px] text-white/30 mt-2">
                  * 추가 모집(Scale-up) 시 가장 먼저 초대장을 보내드립니다.
                </p>
              </div>
            ) : (
              <div className="animate-fade-in p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </div>
                <p className="text-gray-300 text-sm font-medium">예약되었습니다.</p>
                <p className="text-white/40 text-xs mt-1">
                  다음 시즌 오픈 시 문자로 알려드릴게요.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
