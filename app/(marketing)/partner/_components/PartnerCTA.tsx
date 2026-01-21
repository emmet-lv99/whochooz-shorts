'use client';

import { supabase } from '@/lib/supabase';
import { formatPhoneNumber, PHONE_REGEX } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PartnerCTA({ onSuccess }: { onSuccess: () => void }) {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    // 1. Validation
    if (!phone) return alert('전화번호를 입력해주세요.');
    if (!PHONE_REGEX.test(phone)) return alert('올바른 휴대폰 번호를 입력해주세요.');
    const cleanPhone = phone.replace(/-/g, '').trim();

    setIsLoading(true);

    try {
      // 2. Existing Check
      const { data: existing } = await supabase
        .from('waitlist')
        .select('id')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (existing) {
        alert('이미 신청된 번호입니다. 2월 오픈 알림을 기다려주세요! 🔔');
        onSuccess();
        return;
      }

      // 3. Insert
      const { error } = await supabase
        .from('waitlist')
        .insert({
          phone: cleanPhone,
          name: 'Partner Applicant',
          reason: 'partner_landing_c',
          status: 'reserved'
        });

      if (error) throw error;
      
      onSuccess();
    } catch (e) {
      console.error(e);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="partner-cta" className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 relative">
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#C6F920]/10 to-transparent pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-xl text-center z-10"
      >
        <span className="text-[#C6F920] font-bold uppercase tracking-widest text-xs mb-4 block">Are you ready?</span>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          지금 파트너로 등록하면<br/>
          <span className="text-white">2월, 첫 번째 주인공이 됩니다.</span>
        </h2>
        <p className="text-white/60 mb-12">
          심사 대기 없음. 비용 0원.<br/>
          전화번호 하나로 3초 만에 사전 등록하세요.
        </p>

        <div className="w-full max-w-sm mx-auto p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center shadow-2xl">
          <input 
            type="tel"
            placeholder="010-1234-5678"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            maxLength={13}
            className="flex-1 bg-transparent border-none text-white text-center h-14 text-lg focus:ring-0 placeholder:text-white/20"
          />
          <button 
            onClick={handleJoin}
            disabled={isLoading}
            className="h-14 px-8 rounded-xl bg-gradient-to-r from-[#C6F920] to-[#9AC319] text-black font-bold text-sm hover:scale-105 active:scale-95 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : '완료'}
          </button>
        </div>

        <p className="text-white/30 text-[10px] mt-6">
          * 2026. 02 그랜드 오픈 시 알림 문자 발송
        </p>
      </motion.div>
    </section>
  );
}
