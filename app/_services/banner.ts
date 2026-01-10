// app/_services/banner.ts
import { supabase } from "@/lib/supabase";

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  bg_color: string; // 기본값 #000000
  order: number;
  visibility: 'all' | 'guest' | 'user'; 
}

export const bannerService = {
  // 모든 활성화된 배너 가져오기 (정렬: order 오름차순)
  async getActiveBanners() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
    
    return data as Banner[];
  }
}
