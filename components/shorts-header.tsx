'use client';

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ShortsHeader() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className={cn(
                "sticky top-0 z-[99] flex items-center h-14 px-4 transition-all duration-300",
                isScrolled 
                    ? "bg-white/70 backdrop-blur-md border-b border-white/20" 
                    : "bg-transparent border-b border-transparent"
            )}
        >
             {/* 뒤로가기 대신 로고나 단순히 타이틀만 보여줄 수도 있음. 
                현재 기획상 쇼츠 탭이 메인 탭 중 하나라면 뒤로가기가 필요 없을 수 있으나,
                Detail page 등에서 진입하는 경우도 고려. 
                하지만 BottomNav에 있는 메인 메뉴이므로 뒤로가기 보다는 그냥 타이틀만 있는 게 나을 수도 있음. 
                일단 CampaignHeader와 맞춤. */}
            <h1 className="text-xl font-bold text-slate-900 flex-1">
                Shorts
            </h1>
        </header>
    );
}
