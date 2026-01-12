import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string; // user.id 와 동일
  name?: string;
  phone?: string;
  zipcode?: string;         // 우편번호 (신규 추가)
  address?: string;         // 기본 주소
  detailed_address?: string; // 상세 주소 (DB 컬럼: detailed_address)
}

export const userService = {
  // 유저 프로필 조회
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.warn('Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  },

  // 유저 프로필 업데이트 (이름, 연락처, 주소 등)
  async updateProfile(userId: string, data: { 
      name?: string; 
      phone?: string;
      zipcode?: string; 
      address?: string; 
      detailed_address?: string; // DB 컬럼: detailed_address
  }) {
    // 업데이트할 객체 생성 (undefined 값은 제외하거나 그대로 업데이트 - 여기선 그대로 덮어씀)
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;
    if (data.zipcode) updateData.zipcode = data.zipcode;
    if (data.address) updateData.address = data.address;
    if (data.detailed_address) updateData.detailed_address = data.detailed_address;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  // 프로필이 없는 경우 생성 (옵션)
  async upsertProfile(profile: Partial<Profile> & { id: string }) {
      const { error } = await supabase
      .from('profiles')
      .upsert(profile)
      
      if (error) {
          console.error('Error upserting profile:', error);
          throw error;
      }
  }
}
