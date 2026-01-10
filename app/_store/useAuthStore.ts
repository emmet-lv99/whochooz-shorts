import { User } from '@supabase/supabase-js';
import { create } from 'zustand';
import authService from '../_services/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean; // 초기 인증 체크 중인지 여부
  isAuthenticated: boolean; // 편의를 위한 헬퍼 상태
  
  // Actions
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // 앱 시작 시엔 로딩 중
  isAuthenticated: false,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),

  logout: async () => {
    await authService.signOut();
    set({ user: null, isAuthenticated: false });
  }
}));
