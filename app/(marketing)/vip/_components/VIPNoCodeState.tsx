interface VIPNoCodeStateProps {
  manualCode: string;
  setManualCode: (code: string) => void;
  onSubmit: () => void;
}

export default function VIPNoCodeState({ 
  manualCode, 
  setManualCode, 
  onSubmit 
}: VIPNoCodeStateProps) {
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
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          <button
            onClick={onSubmit}
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
