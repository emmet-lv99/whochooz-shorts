'use client'

import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface ModalOptions {
  title?: string;
  content: ReactNode;
  btnText?: string;      // 확인 버튼 텍스트
  cancelText?: string;   // 취소 버튼 텍스트 (없으면 확인 버튼만 노출)
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ModalContextType {
  open: (options: ModalOptions) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 모달 열기
  const open = useCallback((opts: ModalOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  // 모달 닫기
  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
        setOptions(null);
        setIsLoading(false);
    }, 300); // 애니메이션 시간 고려
  }, []);

  // 확인 버튼 클릭
  const handleConfirm = async () => {
    if (options?.onConfirm) {
      try {
          const result = options.onConfirm();
          if (result instanceof Promise) {
              setIsLoading(true);
              await result;
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
    }
    close();
  };

  const handleCancel = () => {
    options?.onCancel?.();
    close();
  };

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}
      {/* 모달 UI 렌더링 */}
      {isOpen && options && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div 
             className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
             onClick={options.cancelText ? handleCancel : undefined} // 캔슬 버튼 있을 때만 배경 클릭 닫기 허용
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-[320px] bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             
             {/* Content */}
             <div className="p-6 text-center">
                {options.title && (
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {options.title}
                    </h3>
                )}
                <div className="text-slate-600 text-[15px] leading-relaxed break-keep">
                    {options.content}
                </div>
             </div>

             {/* Footer (Buttons) */}
             <div className="flex border-t border-slate-200/60 bg-slate-50/50">
                 {options.cancelText && (
                     <button
                        onClick={handleCancel}
                        className="flex-1 py-4 text-[15px] font-medium text-slate-500 hover:bg-slate-100/50 transition-colors active:bg-slate-200/50"
                     >
                        {options.cancelText}
                     </button>
                 )}
                 {options.cancelText && <div className="w-[1px] bg-slate-200/60" />}
                 <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={`flex-1 py-4 text-[15px] font-bold text-indigo-600 hover:bg-indigo-50/50 transition-colors active:bg-indigo-100/50 ${!options.cancelText && 'w-full'}`}
                 >
                    {isLoading ? '처리중...' : (options.btnText || '확인')}
                 </button>
             </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
