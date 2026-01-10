'use client';

import authService from '@/app/_services/auth';
import { useModalStore } from '@/app/_store/useModalStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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
            // 로그인 체크 (UI 반응성을 위해 로딩 표시나 즉각적인 모달이 좋음)
            // authService.getCurrentUser()가 빠르겠지만, 확실히 check
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

            // 로그인 되어 확인되면 이동
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

    return (
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
                    className="border-glow w-full h-[52px] text-lg font-bold rounded-xl shadow-2xl bg-black/65 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white transition-all active:scale-[0.98]" 
                    onClick={handleButtonClick}
                >
                    {getButtonText()}
                </Button>
            </div>
        </div>
    );
}
