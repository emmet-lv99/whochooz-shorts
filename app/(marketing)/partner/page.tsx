'use client';

import { supabase } from '@/lib/supabase';
import { formatPhoneNumber, PHONE_REGEX } from '@/lib/utils';
import { useState } from 'react';
import '../marketing.css'; // 스타일 로드

export default function PartnerLandingPage() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleJoin = async () => {
    // 1. Validation
    if (!phone) return alert('전화번호를 입력해주세요.');
    
    // 포맷팅된 번호 검증 (010-XXXX-XXXX)
    if (!PHONE_REGEX.test(phone)) return alert('올바른 휴대폰 번호를 입력해주세요.');
    
    // DB 저장용 하이픈 제거
    const cleanPhone = phone.replace(/-/g, '').trim();

    setIsLoading(true);

    try {
      // 2. Deduplication
      const { data: existing } = await supabase
        .from('waitlist')
        .select('id')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (existing) {
        alert('이미 신청된 번호입니다. 2월 오픈 알림을 기다려주세요! 🔔');
        setIsSubmitted(true);
        setIsLoading(false);
        return;
      }

      // 3. Insert
      const { error } = await supabase
        .from('waitlist')
        .insert({
          phone: cleanPhone,
          name: 'Partner Applicant', // 이름 입력 생략 (간편 지원)
          reason: 'partner_landing_c', // 유입 경로 구분
          status: 'reserved'
        });

      if (error) throw error;
      
      // 4. Success
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="partner-wrapper min-h-screen flex flex-col items-center justify-center relative text-white font-sans break-keep selection:bg-[#C6F920] selection:text-black">
      
      {/* 1. Background (Mesh Gradient + Noise) */}
      <div className="partner-background">
        <div className="aurora-blob blob-lime" />
        <div className="aurora-blob blob-purple" />
        <div className="aurora-blob blob-white" />
      </div>
      <div className="noise-overlay" />

      {/* Content */}
      <main className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
        
        {/* 2. Beta Badge (Refined) */}
        {!isSubmitted && (
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10 animate-fade-in shadow-lg hover:border-white/20 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6F920] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6F920]"></span>
            </span>
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#C6F920] drop-shadow-sm">Beta Season</span>
          </div>
        )}

        {/* 3. Hero Section (Typography) */}
        {!isSubmitted ? (
          <div className="text-center mb-14 animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight drop-shadow-2xl">
              협찬, 기다리지 말고<br/>
              <span className="text-gradient-lime">직접 선택하세요.</span>
            </h1>
            <p className="text-white/60 text-sm md:text-lg leading-relaxed max-w-md mx-auto font-light">
              복잡한 가이드, 지루한 원고 작성은 없습니다.<br/>
              오직 당신의 <span className="text-white font-medium border-b border-white/20 pb-0.5">감각적인 숏폼</span> 하나면 충분합니다.
            </p>
          </div>
        ) : (
          /* Success View (Digital Receipt) */
          <div className="animate-fade-in-up w-full max-w-sm mx-auto perspective-1000">
             <div className="bg-[#fafafa] text-black rounded-t-sm rounded-b-2xl relative pt-2 pb-10 px-8 shadow-2xl transform rotate-1 origin-top hover:rotate-0 transition-transform duration-500">
               {/* Top Neon Border */}
               <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C6F920]" />
               
               <div className="mt-8 flex flex-col items-center text-center space-y-6">
                 <div className="w-14 h-14 rounded-full border-[3px] border-[#C6F920] flex items-center justify-center text-[#9AC319] bg-white shadow-inner">
                   <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 
                 <div>
                   <h3 className="text-2xl font-bold tracking-tight mb-1">Pre-Registered</h3>
                   <p className="text-[11px] text-gray-400 uppercase tracking-[0.2em]">Digital Receipt</p>
                 </div>

                 <div className="w-full border-t-2 border-dashed border-gray-200" />

                 <div className="text-base font-medium text-gray-800">
                   <p>2026. 02 Grand Open</p>
                   <p className="text-xs text-gray-400 mt-2 font-normal">알림을 기다려주세요.</p>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* 4. Input Section (Levitating Glass Portal) */}
        {!isSubmitted && (
          <div className="w-full max-w-sm animate-slide-up-delay-1 mb-16">
             <div className="partner-input-wrapper flex items-center p-1.5 gap-2 backdrop-blur-xl">
                <input 
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  maxLength={13}
                  className="partner-input"
                />
                <button 
                  onClick={handleJoin}
                  disabled={isLoading}
                  className="partner-button shrink-0"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  ) : '지원하기'}
                </button>
             </div>
          </div>
        )}

        {/* 5. Feature Cards (High-end Glass Tiles) */}
        {!isSubmitted && (
          <div className="grid grid-cols-3 gap-4 w-full animate-slide-up-delay-2">
            {[
              { icon: '🛍️', title: 'Pick', desc: '쇼핑하듯\n선택' },
              { icon: '🚫', title: 'No Text', desc: '원고 작성\n스트레스 X' },
              { icon: '🎁', title: 'Get', desc: '제품 협찬\n+ 포인트' },
            ].map((item, idx) => (
              <div key={idx} className="glass-panel-pro p-5 rounded-2xl flex flex-col items-center text-center group cursor-default">
                <span className="text-3xl mb-3 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                <h3 className="text-[11px] font-bold text-white mb-1.5 uppercase tracking-widest">{item.title}</h3>
                <p className="text-[10px] text-white/50 leading-tight whitespace-pre-line group-hover:text-white/80 transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
