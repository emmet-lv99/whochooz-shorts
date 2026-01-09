'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
    campaignId: string;
    status: 'open' | 'closed' | 'coming_soon';
    startDate: string;
}

export default function FloatingActionBar({ campaignId, status, startDate }: Props) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    const handleButtonClick = () => {
        if (status === 'open') {
            router.push(`/campaigns/${campaignId}/apply`);
            return;
        }

        if (status === 'closed') {
            setModalContent({
                title: '마감된 캠페인',
                message: '아쉽지만 모집이 마감되었습니다.\n다음에 다시 도전해주세요!'
            });
        } else if (status === 'coming_soon') {
            const openDate = new Date(startDate).toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
            setModalContent({
                title: '오픈 예정',
                message: `아직 모집 기간이 아닙니다.\n${openDate}에 오픈됩니다.`
            });
        }
        setShowModal(true);
    };

    const getButtonText = () => {
        switch (status) {
            case 'closed': return '마감되었습니다';
            case 'coming_soon': return '오픈 예정';
            default: return '체험단 신청하기';
        }
    };

    return (
        <>
            <div className="fixed bottom-0 z-[1001] w-full max-w-[480px] p-4 safe-area-bottom pointer-events-none">
                {/* 툴팁: 오픈 상태일 때만 표시 */}
                {status === 'open' && (
                    <div className="flex justify-center mb-3">
                        <div className="relative bg-white px-3 py-1.5 rounded-full shadow-md text-[13px] pointer-events-auto">
                            <span>지금 </span>
                            <span className="text-red-500 font-bold">23명</span>
                            <span>이 보고 있어요.</span>
                            {/* 말풍선 꼬리 */}
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2.5 h-2.5 bg-white rotate-45" />
                        </div>
                    </div>
                )}
                
                <div className="pointer-events-auto">
                    <Button 
                        className="border-glow w-full h-[52px] text-lg font-bold rounded-xl shadow-2xl bg-black/65 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white" 
                        onClick={handleButtonClick}
                    >
                        {getButtonText()}
                    </Button>
                </div>
            </div>

            {/* 알림 모달 */}
            {showModal && (
                <div className="fixed inset-0 z-[1002] flex items-center justify-center px-4 animate-in fade-in duration-500">
                    {/* 배경 오버레이 (더 투명하게) */}
                    <div 
                        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
                        onClick={() => setShowModal(false)}
                    />
                    
                    {/* 모달 컨텐츠 (글래스모피즘 - 더 투명하게) */}
                    <div className="relative w-full max-w-xs bg-slate-900/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 fade-in duration-500 slide-in-from-bottom-2">
                        <h3 className="text-lg font-bold text-center text-white mb-2">
                            {modalContent.title}
                        </h3>
                        <p className="text-sm text-center text-slate-300 mb-6 whitespace-pre-wrap leading-relaxed">
                            {modalContent.message}
                        </p>
                        <Button 
                            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl h-11"
                            onClick={() => setShowModal(false)}
                        >
                            확인
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
