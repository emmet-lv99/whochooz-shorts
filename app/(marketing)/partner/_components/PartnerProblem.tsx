'use client';

import { motion } from 'framer-motion';

export default function PartnerProblem() {
  const cards = [
    {
      icon: '🚫',
      title: '죄송합니다.\n팔로워 수가 부족합니다.',
      desc: '센스는 자신 있는데,\n숫자에 막혀 거절당한 경험.',
      rotate: -5
    },
    {
      icon: '📝',
      title: '블로그 포스팅\n2,000자 필수',
      desc: '영상 찍기도 바쁜데,\n구구절절한 글쓰기 숙제까지.',
      rotate: 5
    },
    {
      icon: '🔄',
      title: '가이드라인 미준수\n수정 요청',
      desc: '내 스타일은 무시당하고,\n광고주 입맛만 맞추는 피곤함.',
      rotate: -3
    }
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative z-10">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" /> {/* Dimmed Background */}
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-5xl font-bold mb-16 text-center leading-tight text-white/90"
      >
        협찬 한번 받기<br/>
        <span className="text-white/40">너무 힘드셨죠?</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50, rotate: card.rotate * 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: card.rotate }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            className="group relative overflow-hidden p-8 rounded-3xl flex flex-col items-start justify-between min-h-[280px] bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-white/40 hover:shadow-[0_8px_32px_rgba(198,249,32,0.1)] transition-all duration-500"
          >
            {/* Glass Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <span className="text-4xl mb-6 filter drop-shadow-md">{card.icon}</span>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-3 whitespace-pre-line leading-snug">{card.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line group-hover:text-white/80 transition-colors">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
