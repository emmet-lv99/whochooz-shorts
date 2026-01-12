'use client';

import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CampaignHeader() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div 
            className={cn(
                "sticky top-0 h-14 z-50 flex items-center px-4 transition-all duration-300",
                isScrolled 
                    ? "bg-white/70 backdrop-blur-md border-b border-white/20" 
                    : "bg-transparent border-b border-transparent"
            )}
        >
             <Link href="/" className="p-2 -ml-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                 <ChevronLeft size={24} />
             </Link>
             <h1 className="text-lg font-bold ml-1 text-slate-900">전체 캠페인</h1>
        </div>
    );
}
