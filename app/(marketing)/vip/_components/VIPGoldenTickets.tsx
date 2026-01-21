export default function VIPGoldenTickets() {
  return (
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
  );
}
