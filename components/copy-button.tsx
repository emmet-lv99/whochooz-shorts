'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface Props {
    text: string;
    className?: string;
}

export default function CopyButton({ text, className }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button 
            className={className || "text-xs text-blue-600 font-medium px-2 py-1 hover:bg-blue-50 rounded transition-colors flex items-center gap-1 shrink-0"}
            onClick={handleCopy}
        >
            {copied ? (
                <>
                    <Check size={12} />
                    복사됨
                </>
            ) : (
                <>
                    <Copy size={12} />
                    복사
                </>
            )}
        </button>
    );
}
