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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white font-sans break-keep">
      
      {/* 1. Background (Neon Lime Aurora) */}
      <div className="partner-background" />
      <div className="absolute inset-0 bg-black/10 z-0" />

      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
        
        {/* 2. Beta Badge (Glass Capsule) */}
        {!isSubmitted && (
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-fade-in shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6F920] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6F920]"></span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C6F920] text-shadow-sm">Beta Season</span>
          </div>
        )}

        {/* 3. Hero Section */}
        {!isSubmitted ? (
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
              협찬, 기다리지 말고<br/>
              <span className="text-lime-neon transparent bg-clip-text bg-gradient-to-r from-white to-[#C6F920] opacity-90">직접 선택하세요.</span>
            </h1>
            <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-md mx-auto">
              복잡한 가이드, 지루한 원고 작성은 없습니다.<br/>
              오직 당신의 <span className="text-white/90 font-medium">감각적인 숏폼</span> 하나면 충분합니다.
            </p>
          </div>
        ) : (
          /* Success View (Digital Receipt) */
          <div className="animate-fade-in-up w-full max-w-sm mx-auto">
             <div className="bg-[#fafafa] text-black rounded-t-none rounded-b-xl relative pt-1 pb-8 px-6 shadow-2xl transform rotate-1">
               {/* Top Neon Border */}
               <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C6F920]" />
               
               <div className="mt-8 flex flex-col items-center text-center space-y-4">
                 <div className="w-12 h-12 rounded-full border-2 border-[#C6F920] flex items-center justify-center text-[#9AC319]">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 
                 <div>
                   <h3 className="text-xl font-bold tracking-tight mb-1">Pre-Registered</h3>
                   <p className="text-[10px] text-gray-400 uppercase tracking-widest">Digital Receipt</p>
                 </div>

                 <div className="w-full border-t border-dashed border-gray-300 my-4" />

                 <div className="text-sm font-medium text-gray-800">
                   <p>2026. 02 Grand Open</p>
                   <p className="text-xs text-gray-500 mt-1 font-normal">알림을 기다려주세요.</p>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* 4. Input Section (The Portal) */}
        {!isSubmitted && (
          <div className="w-full max-w-sm animate-slide-up-delay-1 space-y-4">
             <div className="glass-panel p-1.5 rounded-2xl flex items-center space-x-2">
                <input 
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  maxLength={13}
                  className="partner-input flex-1 bg-transparent border-none text-center h-12 focus:ring-0 focus:shadow-none placeholder:text-white/20"
                />
                <button 
                  onClick={handleJoin}
                  disabled={isLoading}
                  className="partner-button h-12 px-6 rounded-xl font-bold text-sm shrink-0"
                >
                  {isLoading ? '...' : '지원하기'}
                </button>
             </div>
          </div>
        )}

        {/* 5. Feature Cards (Glass Tiles) */}
        {!isSubmitted && (
          <div className="grid grid-cols-3 gap-3 w-full mt-16 animate-slide-up-delay-2">
            {[
              { icon: '🛍️', title: 'Pick', desc: '쇼핑하듯\n선택' },
              { icon: '🚫', title: 'No Text', desc: '원고 작성\n스트레스 X' },
              { icon: '🎁', title: 'Get', desc: '제품 협찬\n+ 포인트' },
            ].map((item, idx) => (
              <div key={idx} className="glass-panel partner-card p-4 rounded-xl flex flex-col items-center text-center">
                <span className="text-2xl mb-2 filter drop-shadow-md">{item.icon}</span>
                <h3 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">{item.title}</h3>
                <p className="text-[10px] text-white/50 leading-tight whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
