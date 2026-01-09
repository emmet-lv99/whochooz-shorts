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
        <header 
            className={cn(
                "sticky top-0 z-[99] flex items-center h-14 px-4 transition-all duration-300",
                isScrolled 
                    ? "bg-white/70 backdrop-blur-md border-b border-white/20" 
                    : "bg-transparent border-b border-transparent"
            )}
        >
            <Link href="/" className="mr-4">
                <ChevronLeft className="w-6 h-6 text-slate-900" />
            </Link>
            <h1 className="text-lg font-bold text-slate-900">
                모든 캠페인
            </h1>
        </header>
    );
}
