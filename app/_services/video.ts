import { supabase } from "@/lib/supabase";
export interface Video {
    id: string;
    video_url: string;
    thumbnail_url: string;
    description: string;
    campaign_id: string;
    campaigns?: { // JOIN된 데이터 (옵셔널)
        title: string;
        brand: string;
        hashtags: string;
    }
}
export interface VideoDetail extends Video {
    campaigns: {
        id: string;
        title: string;
        brand: string;
        hashtags: string;
    }
}

export const videoService = {
    // 1. 전체 리스트 가져오기 (페이지네이션 지원)
    async getAllList(page = 1, limit = 10) {
        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            const { data, error } = await supabase
                .from('videos')
                .select('*, campaigns(title, brand, hashtags)')
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;
            return data as Video[];
        } catch (e) {
            console.error('videoService.getAllList error:', e);
            return [];
        }
    },

    // 2. 상세 조회 (캠페인 정보 JOIN)
    async getDetail(id: string) {
        try {
            const { data, error } = await supabase
                .from('videos')
                .select(`
                    *,
                    campaigns (
                        id, title, brand, hashtags
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as VideoDetail;
        } catch (e) {
            console.error('videoService.getDetail error:', e);
            return null;
        }
    }
}