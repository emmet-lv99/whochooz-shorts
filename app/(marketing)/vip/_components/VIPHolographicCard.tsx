interface VIPHolographicCardProps {
  nickname: string;
  currentYear: number;
  mousePos: { x: number; y: number };
  setMousePos: (pos: { x: number; y: number }) => void;
  isInteracting: boolean;
  setIsInteracting: (interacting: boolean) => void;
  autoAngle: number;
}

export default function VIPHolographicCard({
  nickname,
  currentYear,
  mousePos,
  setMousePos,
  isInteracting,
  setIsInteracting,
  autoAngle,
}: VIPHolographicCardProps) {
  return (
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
        
        {/* 2. Aurora Effect */}
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
        
        {/* 5. Gold Glow Border */}
        <div className="absolute inset-0 border-2 border-[#D4AF37]/50 rounded-2xl shadow-[inset_0_0_20px_rgba(212,175,55,0.2)]"></div>
        
        {/* 6. Twinkling Stars Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_6px_white,0_0_12px_rgba(212,175,55,0.5)]"
            style={{
              top: '15%',
              left: '20%',
              opacity: Math.abs(Math.sin(autoAngle * 0.05)) * 0.8,
              transform: `scale(${0.5 + Math.abs(Math.sin(autoAngle * 0.05)) * 0.5})`,
            }}
          ></div>
          <div 
            className="absolute w-0.5 h-0.5 rounded-full bg-white shadow-[0_0_4px_white,0_0_8px_rgba(212,175,55,0.4)]"
            style={{
              top: '35%',
              right: '25%',
              opacity: Math.abs(Math.sin(autoAngle * 0.07 + 1)) * 0.7,
              transform: `scale(${0.5 + Math.abs(Math.sin(autoAngle * 0.07 + 1)) * 0.5})`,
            }}
          ></div>
          <div 
            className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_6px_white,0_0_10px_rgba(212,175,55,0.5)]"
            style={{
              bottom: '25%',
              left: '65%',
              opacity: Math.abs(Math.sin(autoAngle * 0.04 + 2)) * 0.9,
              transform: `scale(${0.5 + Math.abs(Math.sin(autoAngle * 0.04 + 2)) * 0.5})`,
            }}
          ></div>
          <div 
            className="absolute w-0.5 h-0.5 rounded-full bg-[#FCF6BA] shadow-[0_0_4px_rgba(252,246,186,0.8)]"
            style={{
              top: '55%',
              left: '12%',
              opacity: Math.abs(Math.sin(autoAngle * 0.06 + 3)) * 0.6,
              transform: `scale(${0.5 + Math.abs(Math.sin(autoAngle * 0.06 + 3)) * 0.5})`,
            }}
          ></div>
          <div 
            className="absolute w-0.5 h-0.5 rounded-full bg-white shadow-[0_0_5px_white]"
            style={{
              top: '70%',
              right: '15%',
              opacity: Math.abs(Math.sin(autoAngle * 0.08 + 4)) * 0.7,
              transform: `scale(${0.5 + Math.abs(Math.sin(autoAngle * 0.08 + 4)) * 0.5})`,
            }}
          ></div>
          <div 
            className="absolute w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]"
            style={{
              top: '25%',
              right: '40%',
              opacity: Math.abs(Math.sin(autoAngle * 0.03 + 5)) * 0.5,
              transform: `scale(${0.3 + Math.abs(Math.sin(autoAngle * 0.03 + 5)) * 0.4})`,
            }}
          ></div>
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
  );
}
