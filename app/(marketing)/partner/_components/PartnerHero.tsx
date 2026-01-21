'use client';

import { motion } from 'framer-motion';

export default function PartnerHero({ onScrollToCTA }: { onScrollToCTA: () => void }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center relative px-6 py-20">
      
      {/* Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 hover:border-white/20 transition-colors cursor-default"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6F920] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6F920]"></span>
        </span>
        <span className="text-[11px] uppercase font-bold tracking-widest text-[#C6F920] drop-shadow-sm">Early Access</span>
      </motion.div>

      {/* Headline */}
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl md:text-7xl font-bold mb-8 leading-tight tracking-tight drop-shadow-2xl"
      >
        제안서 쓸 시간에<br/>
        <span className="text-gradient-lime">영상 하나 더 찍으세요.</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-white/60 text-sm md:text-xl leading-relaxed max-w-2xl mx-auto font-light mb-12"
      >
        팔로워 수? 블로그 원고? 복잡한 건 저희가 합니다.<br/>
        당신은 오직 <span className="text-white font-medium border-b border-white/20 pb-0.5">감각적인 숏폼</span>만 준비하세요.
      </motion.p>

      {/* Breathing CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onScrollToCTA}
        className="px-8 py-4 rounded-full bg-[#C6F920] text-black font-bold text-lg shadow-[0_0_20px_rgba(198,249,32,0.4)] animate-pulse-slow partner-button-hero"
      >
        파트너 등록하기
      </motion.button>

      {/* Custom CSS for slow pulse if needed, or use tailwind animate-pulse */}
      <style jsx>{`
        .partner-button-hero {
          animation: breathing 3s infinite ease-in-out;
        }
        @keyframes breathing {
          0%, 100% { box-shadow: 0 0 20px rgba(198,249,32,0.4); }
          50% { box-shadow: 0 0 40px rgba(198,249,32,0.6); }
        }
      `}</style>
    </section>
  );
}
