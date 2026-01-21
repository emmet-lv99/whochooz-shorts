'use client';

import { motion } from 'framer-motion';

export default function PartnerProcess() {
  const steps = [
    {
      step: '01',
      icon: '🛍️',
      title: '쇼핑하듯\n고르세요.',
      desc: '협찬을 기다리지 마세요.\n내가 원하는 제품을 직접 선택합니다.',
    },
    {
      step: '02',
      icon: '🎬',
      title: '느낌대로\n찍으세요.',
      desc: '15초 숏폼이든, 1분 릴스든.\n당신의 스타일대로.',
    },
    {
      step: '03',
      icon: '💰',
      title: '제품 받고,\n돈도 법니다.',
      desc: '무료 협찬은 기본.\n조회수가 터지면 보너스 포인트까지.',
    }
  ];

  return (
    <section className="min-h-screen py-24 flex flex-col justify-center">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-16 text-center"
        >
          <span className="text-[#C6F920] font-bold tracking-widest uppercase text-sm mb-2 block">Process</span>
          <h2 className="text-3xl md:text-5xl font-bold">이렇게 쉬워도 되나요?</h2>
        </motion.div>

        {/* Desktop: Grid / Mobile: Vertical or Scroll (Let's stick to Grid for simplicity first, responsive flex) */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:bg-white/10 transition-colors"
            >
               <span className="absolute top-6 right-6 text-6xl font-black text-white/5 select-none font-serif-display group-hover:text-white/10 transition-colors">{item.step}</span>
               
               <div className="text-4xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-300">{item.icon}</div>
               
               <h3 className="text-2xl font-bold mb-4 whitespace-pre-line leading-snug">{item.title}</h3>
               <p className="text-white/50 text-sm whitespace-pre-line leading-relaxed">{item.desc}</p>

               {/* Arrow for connection (except last) */}
               {idx < 2 && (
                 <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 text-white/20">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </div>
               )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
