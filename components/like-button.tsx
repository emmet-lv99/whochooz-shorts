'use client'

import { likeService } from "@/app/_services/like"
import { useAuthStore } from "@/app/_store/useAuthStore"
import { useModalStore } from "@/app/_store/useModalStore"
import { cn } from "@/lib/utils"
// Heart -> Bookmark 교체
import { Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface LikeButtonProps {
    campaignId: string
    className?: string
    iconSize?: number
    variant?: 'default' | 'white' // 아이콘 색상 테마
}

export default function LikeButton({ campaignId, className, iconSize = 24, variant = 'default' }: LikeButtonProps) {
    const { user } = useAuthStore()
    const { open } = useModalStore()
    const router = useRouter()
    
    const [isLiked, setIsLiked] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    // 초기 상태 로드
    useEffect(() => {
        if (!user) {
            setIsLiked(false)
            return
        }
        likeService.checkIsLiked(campaignId, user.id).then(setIsLiked)
    }, [campaignId, user])

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // 1. 비로그인 체크
        if (!user) {
            open({
                title: '로그인 필요',
                content: '관심 캠페인 저장은 로그인이 필요합니다.\n로그인하시겠습니까?',
                btnText: '로그인',
                cancelText: '취소',
                onConfirm: () => router.push('/login')
            })
            return
        }

        // 2. 낙관적 업데이트
        const newState = !isLiked
        setIsLiked(newState)
        if (newState) setIsAnimating(true)

        try {
            const result = await likeService.toggleLike(campaignId, user.id)
            if (result !== newState) setIsLiked(result)
        } catch (error) {
            console.error(error)
            setIsLiked(!newState)
        }
    }

    // 스타일 설정 (모던한 느낌: 저장 시 검정색 fill)
    const activeColor = "fill-slate-900 text-slate-900"; 
    const inactiveColor = variant === 'white' ? "text-white" : "text-slate-400";
    // 마이페이지나 흰 배경에서는 slate-400이 깔끔함.

    return (
        <button 
            onClick={handleClick}
            className={cn(
                "relative flex items-center justify-center transition-transform active:scale-90 cursor-pointer z-10 p-2",
                isAnimating && "animate-bookmark-bounce", // 커스텀 애니메이션 클래스 필요하면 추가, 여기선 scale로 충분
                className
            )}
            onAnimationEnd={() => setIsAnimating(false)}
        >
            <Bookmark 
               size={iconSize} 
               className={cn(
                 "transition-all duration-300",
                 isLiked ? activeColor : inactiveColor
               )}
               strokeWidth={isLiked ? 0 : 1.5} // 채워졌을 땐 외곽선 없음
            />
        </button>
    )
}
