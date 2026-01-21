export default function VIPLivePreview() {
  return (
    <div className="w-full max-w-sm mx-auto mt-16 mb-20 flex flex-col items-center animate-fade-in-up delay-300">
      
      {/* 1. Status Indicator */}
      <div className="flex items-center space-x-2 mb-4 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <p className="text-[11px] text-white/80 tracking-wide font-medium">
          LIVE : 최종 튜닝 진행 중
        </p>
      </div>

      {/* 2. Phone Mockup */}
      <div className="relative w-[260px] h-[520px] bg-gray-900 rounded-[2.5rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden ring-1 ring-white/10 transform transition-transform hover:scale-105 duration-500">
        
        <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-xl w-24 mx-auto z-20"></div>

        <iframe 
          src="https://whochooz-shorts.vercel.app/" 
          className="w-full h-full border-0 bg-white"
          title="WhoChooz Live Preview"
          loading="lazy"
          style={{ 
            filter: 'blur(6px)',
            pointerEvents: 'none',
            userSelect: 'none'
          }} 
        />

        {/* 3. Lock Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
          
          {/* Icon: Clock */}
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-4 border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-white font-serif text-xl mb-2 tracking-tight">
            Final Calibration
          </h3>
          
          <p className="text-white/70 text-xs font-light leading-relaxed">
            최고의 경험을 위해<br/>
            <span className="text-[#D4AF37] font-semibold">마지막 튜닝</span>을 진행하고 있습니다.
          </p>
          
          <p className="mt-3 text-[10px] text-white/40 border-t border-white/10 pt-3 w-full">
            * Founding Crew에게 가장 먼저 공개됩니다
          </p>

        </div>

        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-20"></div>

      </div>

    </div>
  );
}
