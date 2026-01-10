import { supabase } from "@/lib/supabase";

export const likeService = {
  // 좋아요 토글 (있으면 삭제, 없으면 추가) -> 최종 상태 반환 (true: 찜함, false: 해제함)
  async toggleLike(campaignId: string, userId: string) {
    // 1. 조회
    const { data } = await supabase
        .from('likes')
        .select()
        .eq('campaign_id', campaignId)
        .eq('user_id', userId)
        .maybeSingle();
    
    if (data) {
        // 2-1. 있으면 삭제 (Unlike)
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('campaign_id', campaignId)
            .eq('user_id', userId);
            
        if(error) throw error;
        return false; // Result: Unliked
    } else {
        // 2-2. 없으면 추가 (Like)
        const { error } = await supabase
            .from('likes')
            .insert({ campaign_id: campaignId, user_id: userId });

        if(error) throw error;
        return true; // Result: Liked
    }
  },

  // 초기 로딩 시 좋아요 여부 확인
  async checkIsLiked(campaignId: string, userId: string) {
      const { data } = await supabase
        .from('likes')
        .select('created_at')
        .eq('campaign_id', campaignId)
        .eq('user_id', userId)
        .maybeSingle();
      return !!data;
  },

  // 마이페이지용: 내가 찜한 캠페인 가져오기
  async getMyLikes(userId: string) {
      const { data, error } = await supabase
        .from('likes')
        .select(`
            created_at,
            campaigns (
                id, title, brand, thumbnail_url, status, end_date
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if(error) throw error;
      return data || [];
  }
}
