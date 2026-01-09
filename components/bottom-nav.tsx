'use client'

import { cn } from '@/lib/utils'
import { Home, PlaySquare } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()

  // 탭 메뉴 정의
  const tabs = [
    {
      name: '홈',
      href: '/',
      icon: Home,
      active: pathname === '/' || pathname.startsWith('/campaigns'),
    },
    {
      name: '숏츠',
      href: '/shorts',
      icon: PlaySquare,
      active: pathname.startsWith('/shorts'),
    },
  ]

  // 특정 페이지(상세, 신청 등)에서는 탭바를 숨기고 싶다면 여기서 처리 가능
  // 예: if (pathname.includes('/apply')) return null

  if (pathname.includes('/campaigns/')) {
    return null;
  }

  if (pathname.includes('/shorts/')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 z-50 w-full max-w-[480px] bg-white/80 backdrop-blur-xl border-t border-white/20 safe-area-bottom">
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
