'use client'

import { bookmarkService } from "@/app/_services/bookmark"
import { useAuthStore } from "@/app/_store/useAuthStore"
import { useModalStore } from "@/app/_store/useModalStore"
import { cn } from "@/lib/utils"
// Bookmark 아이콘 사용
import { Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface BookmarkButtonProps {
    campaignId: string
    className?: string
    iconSize?: number
    variant?: 'default' | 'white' // 아이콘 색상 테마
}

export default function BookmarkButton({ campaignId, className, iconSize = 24, variant = 'default' }: BookmarkButtonProps) {
    const { user } = useAuthStore()
    const { open } = useModalStore()
    const router = useRouter()
    
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    // 초기 상태 로드
    useEffect(() => {
        if (!user) {
            setIsBookmarked(false)
            return
        }
        bookmarkService.checkIsBookmarked(campaignId, user.id).then(setIsBookmarked)
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
        const newState = !isBookmarked
        setIsBookmarked(newState)
        if (newState) setIsAnimating(true)

        try {
            const result = await bookmarkService.toggleBookmark(campaignId, user.id)
            if (result !== newState) setIsBookmarked(result)
        } catch (error) {
            console.error(error)
            setIsBookmarked(!newState)
        }
    }

    // 스타일 설정 (저장 시 검정색 fill)
    const activeColor = "fill-slate-900 text-slate-900"; 
    const inactiveColor = variant === 'white' ? "text-white" : "text-slate-400";

    return (
        <button 
            onClick={handleClick}
            className={cn(
                "relative flex items-center justify-center transition-transform active:scale-90 cursor-pointer z-10 p-2",
                // isAnimating && "animate-bookmark-bounce", // 필요시 애니메이션 추가
                className
            )}
            onAnimationEnd={() => setIsAnimating(false)}
        >
            <Bookmark 
               size={iconSize} 
               className={cn(
                 "transition-all duration-300",
                 isBookmarked ? activeColor : inactiveColor
               )}
               strokeWidth={isBookmarked ? 0 : 1.5}
            />
        </button>
    )
}
