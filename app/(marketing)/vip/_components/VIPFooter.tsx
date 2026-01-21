export default function VIPFooter() {
  return (
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
  );
}
