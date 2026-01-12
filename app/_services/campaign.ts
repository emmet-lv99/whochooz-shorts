// app/_services/campaign.ts
import { ApplyFormValues } from "@/components/apply-form";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { userService } from "./user";

// 1. 필요한 데이터 타입 정의 (DB 컬럼과 일치)
export interface Campaign {
    id: string;
    title: string;
    brand: string;
    description: string;
    channel: string;
    thumbnail_url: string;
    benefit: string;
    start_date: string;
    end_date: string;
    type: 'visit' | 'delivery'
    location?: string;
    exp_period_guide?: string;     // 방문/체험 기한
    review_period_guide?: string;  // 리뷰 등록 기한
    hashtags?: string;              // 필수 해시태그
    is_face_required?: boolean;    // 얼굴 노출 필수 여부
    is_original_required?: boolean; // 원본 제출 필수 여부
    guide?: string;                 // 리뷰제작 가이드
    notice?: string;                // 추가 안내사항
    warning?: string;               // 주의사항
    recruit_count: number;
    status: 'open' | 'closed'
}

// 2. 서비스 로직 구현 (데이터 접근 함수들)
export const campaignService = {
  // 메인 홈: 최신순 4개만 가져오기 (쇼윈도용 - 이제 안 쓸 수도 있음)
  async getLatestList() {
    const {data, error} = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false }) // 최신순
      .limit(4);
    
    if (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
    return data as Campaign[];
  },

  // 캠페인 리스트: 전체 가져오기 (페이지네이션 지원)
  async getAllList(status?: 'open' | 'closed', page = 1, limit = 10) {
    const now = new Date().toISOString();
    
    // 1. 기본 쿼리 생성
    let query = supabase
      .from('campaigns')
      .select('*');
    
    // 2. 상태 필터 적용
    if (status === 'open') {
      // 모집중 + 모집예정
      query = query
        .neq('status', 'closed')
        .gte('end_date', now);
    } else if (status === 'closed') {
      // 마감
      query = query.or(`status.eq.closed,end_date.lt.${now}`);
    }
    
    // 3. 정렬
    if (status === 'closed') {
      query = query.order('end_date', { ascending: false });
    } else {
      query = query.order('end_date', { ascending: true }); // 마감 임박순
    }

    // 4. 페이지네이션 적용 (Supabase range는 0-index)
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    // 5. 쿼리 실행
    const {data, error} = await query;
    
    if (error) {
      console.error('Error fetching all campaigns:', error);
      return [];
    }
    
    return data as Campaign[];
  },

  // 상세 페이지: ID로 하나만 조회
  async getDetail(id: string) {
    const {data, error} = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching campaign detail:', error);
      return null;
    }
    return data as Campaign;
  },

  // 캠페인 신청
  async applyCampaign(campaignId: string, user: User, data: ApplyFormValues) {
    try {
      // 1. 신청 내역 저장
      const {error: insertError} = await supabase.from('applications').insert({
        campaign_id: campaignId,
        user_id: user.id,
        name: data.name,
        phone: data.phone,
        zipcode: data.zipcode || null,
        shipping_addr: data.address || null,   // DB 컬럼: shipping_addr
        detailed_address: data.detailed_address || null, // DB 컬럼: detailed_address
        sns_url: data.sns_url,
        content: data.content,
        is_agreed_penalty: data.is_agreed_penalty,
        is_agreed_privacy: data.is_agreed_privacy,
        is_agreed_marketing: data.is_agreed_marketing,
        is_agreed_third_party: data.is_agreed_third_party,
        status: 'pending',
      });
      
      if(insertError) {
        console.error('Insert Application Error:', insertError);
        throw insertError;
      }

      // 2. 캠페인 신청자 수 증가 (+1)
      const { error: updateError } = await supabase.rpc('increment_apply_count', { campaign_id: campaignId });
      
      if (updateError) {
          console.warn('Failed to increment apply count. Maybe RPC missing?', updateError);
      }

      // 3. 유저 프로필 업데이트 (이름, 연락처, 주소 최신화)
      // 입력된 정보로 프로필을 업데이트합니다.
      await userService.updateProfile(user.id, { 
          name: data.name,
          phone: data.phone,
          // 주소 정보가 있는 경우(배송형 등) 함께 업데이트
          zipcode: data.zipcode, 
          address: data.address,
          detailed_address: data.detailed_address
      });

      return {error: null}
    } catch(e) {
      console.error('Apply Campaign Error:', e)
      return {error: e}
    }  
  },

  // 내 신청 내역 조회
  async getMyApplications(userId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        campaigns (
          id,
          title,
          brand,
          thumbnail_url,
          status,
          end_date
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching my applications:', error);
      return [];
    }
    return data;
  }
}
