import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

export const authService = {
  //  로그인
  async signInWithKakao() {
    try{
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      })
      if (error) throw error
      return { error : null }
    } catch (e) {
      return { error: e }
    }
  },
  
  // 로그아웃
  async signOut() {
    return await supabase.auth.signOut()
  },

  // 1. 현재 유저 가져오기
  async getCurrentUser() {
    const {data:{user}} = await supabase.auth.getUser()
    return user
  },

  // 2. 상태 변화 감지 (UI에게는 '구독 취소 함수'만 딱 던져줌)
  onAuthStateChange(callback: (user: User | null) => void) {
    const {data} = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null)
    })
    // 구독 취소 함수 반환
    return () => data.subscription.unsubscribe()
  }

}

export default authService