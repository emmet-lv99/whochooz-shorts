'use client';

import { motion } from 'framer-motion';

export default function PartnerSuccess() {
  return (
    <div className="w-full max-w-sm mx-auto perspective-1000 my-20">
      <motion.div 
        initial={{ rotateX: -10, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-[#fafafa] text-black rounded-t-sm rounded-b-2xl relative pt-2 pb-10 px-8 shadow-2xl transform origin-top"
      >
        {/* Top Neon Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C6F920]" />
        
        <div className="mt-8 flex flex-col items-center text-center space-y-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-14 h-14 rounded-full border-[3px] border-[#C6F920] flex items-center justify-center text-[#9AC319] bg-white shadow-inner"
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
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
      </motion.div>
    </div>
  );
}
