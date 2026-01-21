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
      desc: '화려한 기술은 필요 없습니다.\n꾸밈없는 솔직한 15초면 충분해요.',
    },
    {
      step: '03',
      icon: '🎁',
      title: '돈 주고 사지 말고,\n영상으로 받으세요.',
      desc: '갖고 싶던 힙한 브랜드 제품,\n이제 내 돈 쓰지 말고 협찬받으세요.',
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

        {/* Desktop: Grid / Mobile: Horizontal Scroll (Snap) */}
        <div className="flex flex-row overflow-x-auto md:overflow-visible gap-4 md:gap-8 snap-x snap-mandatory px-6 md:px-0 -mx-6 md:mx-0 py-4 no-scrollbar">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex-shrink-0 w-[85vw] md:w-auto md:flex-1 snap-center bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:bg-white/10 transition-colors"
            >
               <span className="absolute top-6 right-6 text-6xl font-black text-white/5 select-none font-serif-display group-hover:text-white/10 transition-colors">{item.step}</span>
               
               <div className="text-4xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-300">{item.icon}</div>
               
               <h3 className="text-2xl font-bold mb-4 whitespace-pre-line leading-snug">{item.title}</h3>
               <p className="text-white/50 text-sm whitespace-pre-line leading-relaxed">{item.desc}</p>

               {/* Arrow for connection (Desktop only) */}
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
        
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
}
