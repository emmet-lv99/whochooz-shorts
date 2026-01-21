'use client';

import { motion } from 'framer-motion';

export default function PartnerSolution() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      
      {/* Background Burst */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C6F920] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      {/* Centered Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 max-w-5xl w-full z-10">
        
        {/* Content Side */}
        <div className="flex-1 max-w-lg">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-left"
          >
            그래서 없앴습니다.<br/>
            <span className="text-gradient-lime">귀찮은 모든 것들을.</span>
          </motion.h2>

          <div className="space-y-6">
            {[
              { title: 'No Follower Count', desc: '팔로워 0명이어도 영상 퀄리티만 좋다면 OK.' },
              { title: 'No Script Stress', desc: '대본 없음. 가이드 없음. 100% 자율 리뷰.' },
              { title: 'No Contact', desc: '광고주와 직접 연락할 필요 없음. 앱으로 끝.' },
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
          <div className="w-[280px] h-[560px] border-4 border-white/20 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl shadow-2xl relative overflow-hidden transform rotate-y-12 hover:rotate-y-0 transition-transform duration-500">
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
