'use client'

import { cn } from '@/lib/utils'
import { Home, LayoutGrid, PlaySquare, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function BottomNav() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 스크롤 보정 (iOS 바운스 등 방지)
      if (currentScrollY < 0) return;

      // 1. 스크롤 내림 & 일정 깊이 이상 -> 숨김
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } 
      // 2. 스크롤 올림 -> 표시
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // 탭 메뉴 정의
  const tabs = [
    {
      name: '홈',
      href: '/',
      icon: Home,
      active: pathname === '/', 
    },
    {
      name: '캠페인',
      href: '/campaigns',
      icon: LayoutGrid,
      active: pathname.startsWith('/campaigns') && pathname.split('/').length <= 2,
    },
    {
      name: '숏츠',
      href: '/shorts',
      icon: PlaySquare,
      active: pathname.startsWith('/shorts') && pathname.split('/').length <= 2,
    },
    {
      name: 'MY',
      href: '/mypage',
      icon: User,
      active: pathname.startsWith('/mypage'),
    },
  ]

  // 상세 페이지에서는 탭바를 숨김 (여기서 리턴 null 처리)
  // 단, 캠페인 리스트(/campaigns)와 숏츠 리스트(/shorts)에서는 보여야 함.
  // 상세(/campaigns/[id], /shorts/[id])에서 숨김
  const isDetailPage = (pathname.startsWith('/campaigns/') && pathname.split('/').length > 2) || 
                       (pathname.startsWith('/shorts/') && pathname.split('/').length > 2);

  if (isDetailPage) {
    return null;
  }

  return (
    <nav 
      className={cn(
        "fixed bottom-0 z-50 w-full max-w-[480px] bg-white/80 backdrop-blur-xl border-t border-white/20 safe-area-bottom transition-transform duration-300 ease-in-out",
        !isVisible && "translate-y-full" // 숨길 때 아래로 이동
      )}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform',
              tab.active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            {/* 아이콘: 활성 상태면 내부를 채움(fill) */}
            <tab.icon
              size={24}
              fill={tab.active ? 'currentColor' : 'none'}
              strokeWidth={tab.active ? 2.5 : 2}
            />
            <span className="text-[10px] font-medium">{tab.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
