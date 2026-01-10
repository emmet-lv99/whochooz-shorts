'use client';

import authService from '@/app/_services/auth';
import { useModalStore } from '@/app/_store/useModalStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import BookmarkButton from './bookmark-button';

interface Props {
    campaignId: string;
    status: 'open' | 'closed' | 'coming_soon';
    startDate: string;
}

export default function FloatingActionBar({ campaignId, status, startDate }: Props) {
    const router = useRouter();
    const { open } = useModalStore();

    const handleButtonClick = async () => {
        if (status === 'open') {
            const user = await authService.getCurrentUser();
            
            if (!user) {
                open({
                    title: '로그인 필요',
                    content: '체험단 신청을 위해 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?',
                    btnText: '로그인 하러 가기',
                    cancelText: '나중에',
                    onConfirm: () => router.push('/login')
                });
                return;
            }

            router.push(`/campaigns/${campaignId}/apply`);
            return;
        }

        if (status === 'closed') {
            open({
                title: '마감된 캠페인',
                content: '아쉽지만 모집이 마감되었습니다.\n다음에 다시 도전해주세요!'
            });
        } else if (status === 'coming_soon') {
            const openDate = new Date(startDate).toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
            open({
                title: '오픈 예정',
                content: `아직 모집 기간이 아닙니다.\n${openDate}에 오픈됩니다.`
            });
        }
    };

    const getButtonText = () => {
        switch (status) {
            case 'closed': return '마감되었습니다';
            case 'coming_soon': return '오픈 예정';
            default: return '체험단 신청하기';
        }
    };

    const isDisabled = status === 'closed';

    return (
        <div className="fixed bottom-0 z-[1001] w-full max-w-[480px] p-4 safe-area-bottom pointer-events-none">
            {/* 툴팁: 오픈 상태일 때만 표시 */}
            {status === 'open' && (
                <div className="flex justify-center mb-3">
                    <div className="relative bg-white px-3 py-1.5 rounded-full shadow-md text-[13px] pointer-events-auto animate-bounce-custom">
                        <span>지금 </span>
                        <span className="text-red-500 font-bold">23명</span>
                        <span>이 보고 있어요.</span>
                        {/* 말풍선 꼬리 */}
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2.5 h-2.5 bg-white rotate-45" />
                    </div>
                </div>
            )}
            
            <div className="pointer-events-auto flex items-stretch gap-3">
                {/* 🆕 북마크(저장) 버튼 */}
                <div className="w-[52px] h-[52px] shrink-0 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-lg border border-white/40 shadow-lg">
                    <BookmarkButton campaignId={campaignId} iconSize={26} variant="default" />
                </div>

                {/* 신청 버튼 */}
                <Button 
                    className={`flex-1 h-[52px] text-lg font-bold rounded-lg shadow-2xl backdrop-blur-md border border-white/20 text-white transition-all active:scale-[0.98]
                        ${isDisabled ? 'bg-slate-400 cursor-not-allowed' : 'bg-black/85 hover:bg-black/90 border-glow'}
                    `}
                    onClick={handleButtonClick}
                    disabled={isDisabled}
                >
                    {getButtonText()}
                </Button>
            </div>
        </div>
    );
}
