'use client';

import { motion } from 'framer-motion';

export default function PartnerSolution() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      
      {/* Background Burst */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C6F920] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      {/* Centered Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 max-w-4xl w-full z-10">
        
        {/* Content Side */}
        <div className="flex-1 max-w-md">
          <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-left"
        >
          그래서 없앴습니다.<br/>
          창작을 방해하는 <span className="text-gradient-lime">'불필요한 과정'</span>들을.
        </motion.h2>

        <div className="space-y-6">
          {[
            { title: 'No Sales Hustle (영업 없음)', desc: '팔로워 0명이라도 OK. 광고주 설득은 우리가 합니다.' },
            { title: 'No Script Interference (간섭 없음)', desc: '광고주의 강요는 없습니다. 최소 스펙만 지키고 당신이 기획한 대로 찍으세요.' },
            { title: 'No Complex Terms (복잡함 없음)', desc: '계약서 검토, 정산... 머리 아픈 행정 업무는 잊으세요.' },
          ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#C6F920] flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 whitespace-nowrap">{item.title}</h3>
                  <p className="text-white/60 text-sm whitespace-pre-wrap">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Visual Side (Glass Phone Mockup) */}
        <motion.div 
          initial={{ opacity: 0, x: 50, rotateY: 30 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex justify-center perspective-1000"
        >
          <div className="w-[260px] h-[520px] border-4 border-white/20 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl shadow-2xl relative overflow-hidden transform rotate-y-12 hover:rotate-y-0 transition-transform duration-500">
             {/* Phone Notch */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20" />
             
             {/* Screen UI Mockup */}
             <div className="w-full h-full p-6 flex flex-col pt-16 space-y-4 opacity-80">
                <div className="w-full h-32 rounded-2xl bg-white/5 animate-pulse" />
                <div className="w-full h-20 rounded-2xl bg-white/5 animate-pulse delay-75" />
                <div className="w-full h-20 rounded-2xl bg-white/5 animate-pulse delay-150" />
             </div>

             {/* Reflective Shine */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
