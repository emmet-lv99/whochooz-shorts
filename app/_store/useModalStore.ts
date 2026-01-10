import { ReactNode } from 'react';
import { create } from 'zustand';

export interface ModalOptions {
  title?: string;
  content: ReactNode;
  btnText?: string;      // 확인 버튼 텍스트 (기본: 확인)
  cancelText?: string;   // 취소 버튼 텍스트 (없으면 숨김)
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ModalState {
  isOpen: boolean;
  options: ModalOptions | null;
  isLoading: boolean;
  
  // Actions
  open: (options: ModalOptions) => void;
  close: () => void;
  setLoading: (loading: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  options: null,
  isLoading: false,

  open: (options) => set({ isOpen: true, options }),
  close: () => set({ isOpen: false }), // options는 애니메이션 종료 후 처리를 위해 컴포넌트에서 초기화 권장되지만, 여기선 심플하게 유지
  setLoading: (isLoading) => set({ isLoading }),
}));
