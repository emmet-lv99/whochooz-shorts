import { supabase } from "@/lib/supabase";

export const bookmarkService = {
  // 북마크 토글 (있으면 삭제, 없으면 추가) -> 최종 상태 반환 (true: 저장됨, false: 해제됨)
  async toggleBookmark(campaignId: string, userId: string) {
    // 1. 조회
    const { data } = await supabase
        .from('bookmarks')
        .select()
        .eq('campaign_id', campaignId)
        .eq('user_id', userId)
        .maybeSingle();
    
    if (data) {
        // 2-1. 있으면 삭제 (Remove Bookmark)
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('campaign_id', campaignId)
            .eq('user_id', userId);
            
        if(error) throw error;
        return false; // Result: Unbookmarked
    } else {
        // 2-2. 없으면 추가 (Add Bookmark)
        const { error } = await supabase
            .from('bookmarks')
            .insert({ campaign_id: campaignId, user_id: userId });

        if(error) throw error;
        return true; // Result: Bookmarked
    }
  },

  // 초기 로딩 시 북마크 여부 확인
  async checkIsBookmarked(campaignId: string, userId: string) {
      const { data } = await supabase
        .from('bookmarks')
        .select('created_at')
        .eq('campaign_id', campaignId)
        .eq('user_id', userId)
        .maybeSingle();
      return !!data;
  },

  // 마이페이지용: 내가 저장한 캠페인 가져오기
  async getMyBookmarks(userId: string) {
      const { data, error } = await supabase
        .from('bookmarks')
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
