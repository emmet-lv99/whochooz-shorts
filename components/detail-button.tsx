'use client';

import FullScreenModal from '@/components/fullscreen-modal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Props {
    description: string;
    title?: string;
}

export default function DetailButton({ description, title }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button 
                variant="outline" 
                className="w-full mt-4 h-11 text-slate-600 border-slate-300 shadow-none"
                onClick={() => setIsOpen(true)}
            >
                자세히 보기
            </Button>

            <FullScreenModal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)}
                title={title || '상세 정보'}
            >
                <div className="p-5">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {description}
                    </p>
                </div>
            </FullScreenModal>
        </>
    );
}
