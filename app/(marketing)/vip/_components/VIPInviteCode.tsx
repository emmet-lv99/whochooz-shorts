interface VIPInviteCodeProps {
  referralCode: string;
  onCopyCode: () => void;
  onCopyLink: () => void;
}

export default function VIPInviteCode({
  referralCode,
  onCopyCode,
  onCopyLink,
}: VIPInviteCodeProps) {
  return (
    <div className="animate-slide-up-delay-3">
      <div className="bg-black/30 border border-[#D4AF37]/30 rounded-xl p-5">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
          나의 초대 코드
        </p>
        
        <div
          onClick={onCopyCode}
          className="bg-black/50 rounded-lg py-3 px-4 mb-4 cursor-pointer hover:bg-black/70 transition-colors border border-white/5"
        >
          <p className="font-mono text-xl text-[#D4AF37] tracking-widest">
            {referralCode}
          </p>
        </div>
        
        <button
          onClick={onCopyLink}
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
  );
}
