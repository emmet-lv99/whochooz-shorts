'use client'

import { useModalStore } from "@/app/_store/useModalStore"
import { useEffect, useState } from "react"

export default function GlobalModal() {
  const { isOpen, options, close, isLoading, setLoading } = useModalStore()
  
  // 닫힘 애니메이션을 위한 렌더링 지연 상태
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
        setShouldRender(true)
    } else {
        const timer = setTimeout(() => setShouldRender(false), 300) // 300ms(애니메이션 시간) 후 언마운트
        return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender || !options) return null;

  const handleConfirm = async () => {
    if (options.onConfirm) {
        try {
            const result = options.onConfirm()
            // Promise인 경우 로딩 처리
            if (result instanceof Promise) {
                setLoading(true)
                await result
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }
    close()
  }

  const handleCancel = () => {
    options.onCancel?.()
    close()
  }

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Backdrop */}
        <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={!isLoading && options.cancelText ? handleCancel : undefined}
        />

        {/* Modal Card */}
        <div className={`relative w-full max-w-[320px] bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            
            {/* Content */}
            <div className="p-6 text-center">
                {options.title && (
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {options.title}
                    </h3>
                )}
                <div className="text-slate-600 text-[15px] leading-relaxed break-keep whitespace-pre-line">
                    {options.content}
                </div>
            </div>

            {/* Footer */}
            <div className="flex border-t border-slate-200/60 bg-slate-50/50">
                {options.cancelText && (
                    <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 py-4 text-[15px] font-medium text-slate-500 hover:bg-slate-100/50 transition-colors active:bg-slate-200/50 disabled:opacity-50"
                    >
                    {options.cancelText}
                    </button>
                )}
                
                {options.cancelText && <div className="w-[1px] bg-slate-200/60" />}
                
                <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={`flex-1 py-4 text-[15px] font-bold text-indigo-600 hover:bg-indigo-50/50 transition-colors active:bg-indigo-100/50 disabled:opacity-50 disabled:cursor-not-allowed ${!options.cancelText && 'w-full'}`}
                >
                    {isLoading ? '처리중...' : (options.btnText || '확인')}
                </button>
            </div>
        </div>
    </div>
  )
}
