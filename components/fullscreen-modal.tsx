'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function FullScreenModal({ isOpen, onClose, title, children }: Props) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            // 스크롤 방지
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen && !isAnimating) return null;

    return (
        <div 
            className={`fixed inset-0 z-[9999] flex justify-center transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onTransitionEnd={() => !isOpen && setIsAnimating(false)}
        >
            {/* 배경 오버레이 */}
            <div 
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            
            {/* 모달 컨테이너 (모바일 뷰 크기) */}
            <div 
                className={`relative w-full max-w-[480px] h-full bg-white transform transition-transform duration-300 ${
                    isOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                {/* 헤더 */}
                <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 bg-white border-b">
                    <h1 className="text-lg font-bold text-slate-900">
                        {title || '상세 정보'}
                    </h1>
                    <button 
                        onClick={onClose}
                        className="p-2 -mr-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-600" />
                    </button>
                </header>

                {/* 컨텐츠 영역 */}
                <div className="h-[calc(100%-56px)] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
