// app/_services/campaign.ts
import { ApplyFormValues } from "@/components/apply-form";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

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
  // 메인 홈: 최신순 4개만 가져오기 (쇼윈도용)
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

  // 캠페인 리스트: 전체 가져오기
  // status 파라미터:
  // - 'open': 모집중 + 모집예정 (status != 'closed' AND end_date >= now)
  // - 'closed': 마감 (status = 'closed' OR end_date < now)
  async getAllList(status?: 'open' | 'closed') {
    const now = new Date().toISOString();
    
    // 1. 기본 쿼리 생성
    let query = supabase
      .from('campaigns')
      .select('*');
    
    // 2. 상태 필터 적용 (프론트엔드 로직과 동일)
    if (status === 'open') {
      // 모집중 + 모집예정: status가 closed가 아니고, end_date가 현재보다 크거나 같은 것
      query = query
        .neq('status', 'closed')
        .gte('end_date', now);
    } else if (status === 'closed') {
      // 마감: status가 closed이거나, end_date가 현재보다 작은 것
      // Supabase .or() 사용
      query = query.or(`status.eq.closed,end_date.lt.${now}`);
    }
    
    // 3. 정렬: 모집중은 마감 임박순, 마감은 최근 마감순
    if (status === 'closed') {
      query = query.order('end_date', { ascending: false });
    } else {
      query = query.order('end_date', { ascending: true }); // 마감 임박순
    }
    
    // 4. 쿼리 실행
    const {data, error} = await query;
    
    // 5. 에러 처리
    if (error) {
      console.error('Error fetching all campaigns:', error);
      return [];
    }
    
    // 6. 결과 반환
    console.log(data);
    return data as Campaign[];
  },

  // 상세 페이지: ID로 하나만 조회
  async getDetail(id: string) {
    // 상세 조회 시에는 연관된 videos 정보도 같이 가져올 수 있음 ( 여기선 일단 기본 정보만)
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
        user_id: user.id, // 진짜 유저 ID 사용!
        name: data.name,
        phone: data.phone,
        sns_url: data.sns_url,
        content: data.content,
        is_agreed_penalty: data.is_agreed_penalty,
        is_agreed_privacy: data.is_agreed_privacy,
        is_agreed_marketing: data.is_agreed_marketing,
        is_agreed_third_party: data.is_agreed_third_party,
        status: 'pending',
      });
      
      if(insertError) throw insertError;

      // 2. 캠페인 신청자 수 증가 (+1) - RPC 사용 권장
      // (DB Function: create or replace function increment_apply_count(row_id uuid) ...)
      const { error: updateError } = await supabase.rpc('increment_apply_count', { campaign_id: campaignId });
      
      if (updateError) {
          // RPC가 없거나 실패해도 신청 자체는 성공으로 처리 (단, 로깅)
          console.warn('Failed to increment apply count. Maybe RPC missing?', updateError);
          // Fallback: RPC 없을 경우 수동 업데이트 시도하지 않음 (복잡도 증가 방지)
      }

      return {error: null} // 성공
    } catch(e) {
      console.log(e)
      return {error: e} // 실패
    }  
  }
}
