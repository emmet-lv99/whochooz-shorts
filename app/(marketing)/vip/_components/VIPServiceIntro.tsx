interface VIPServiceIntroProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function VIPServiceIntro({ isOpen, setIsOpen }: VIPServiceIntroProps) {
  return (
    <div className="w-full max-w-sm mx-auto mt-6 mb-8">
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center w-full py-2 transition-all"
      >
        <span className="text-[10px] tracking-[0.2em] text-[#D4AF37] group-hover:text-white transition-colors uppercase mr-2">
          What is WhoChooz
        </span>
        <svg 
          className={`w-3 h-3 text-[#D4AF37] transform transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content Area */}
      <div 
        className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? 'max-h-80 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-5 backdrop-blur-md">
          
          {/* Benefit 1: Zero Cost Sponsorship */}
          <div className="flex items-start space-x-3 text-left">
            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
            <div>
              <h4 className="text-white text-sm font-serif italic mb-1">Zero Cost Sponsorship</h4>
              <p className="text-white/60 text-xs leading-relaxed">
                금전적 부담은 일체 없습니다.<br/>
                트렌디한 <span className="text-white/90 font-medium">상품</span>부터 핫한 <span className="text-white/90 font-medium">방문 서비스</span>까지,<br/>
                오직 신청을 통해 무료로 경험하세요.
              </p>
            </div>
          </div>

          {/* Benefit 2: Short-form Reviewer */}
          <div className="flex items-start space-x-3 text-left">
            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
            <div>
              <h4 className="text-white text-sm font-serif italic mb-1">Short-form Reviewer</h4>
              <p className="text-white/60 text-xs leading-relaxed">
                지루한 블로그 포스팅은 그만.<br/>
                당신의 감각이 담긴 <span className="text-white/90 font-medium">숏폼 영상</span> 하나면<br/>
                모든 체험단 활동이 완료됩니다.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
