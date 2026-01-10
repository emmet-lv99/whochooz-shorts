'use client'

import { likeService } from "@/app/_services/like"
import { useAuthStore } from "@/app/_store/useAuthStore"
import { useModalStore } from "@/app/_store/useModalStore"
import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"
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
                content: '관심 캠페인 담기는 로그인이 필요합니다.\n로그인하시겠습니까?',
                btnText: '로그인',
                cancelText: '취소',
                onConfirm: () => router.push('/login')
            })
            return
        }

        // 2. 낙관적 업데이트 (UI 먼저 변경)
        const newState = !isLiked
        setIsLiked(newState)
        if (newState) setIsAnimating(true) 

        try {
            const result = await likeService.toggleLike(campaignId, user.id)
            if (result !== newState) setIsLiked(result) // 서버 결과와 다르면 동기화
        } catch (error) {
            console.error(error)
            setIsLiked(!newState) // 에러 시 롤백
        }
    }

    // 스타일 설정
    const strokeColor = variant === 'white' 
        ? (isLiked ? 'text-red-500' : 'text-white') 
        : (isLiked ? 'text-red-500' : 'text-slate-400');

    return (
        <button 
            onClick={handleClick}
            className={cn(
                "relative flex items-center justify-center transition-transform active:scale-75 cursor-pointer z-10 p-2",
                isAnimating && "animate-bounce", // 간단한 바운스 효과
                className
            )}
            style={{ animationDuration: '0.4s' }}
            onAnimationEnd={() => setIsAnimating(false)}
        >
            <Heart 
               size={iconSize} 
               className={cn(
                 "transition-colors duration-200",
                 isLiked ? "fill-red-500 text-red-500" : strokeColor
               )}
               strokeWidth={2}
            />
        </button>
    )
}
