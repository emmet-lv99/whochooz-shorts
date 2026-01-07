'use client'

import authService from "@/app/_services/auth";
import { campaignService } from "@/app/_services/campaign";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Checkbox } from './ui/checkbox';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";


// 1. 입력받을 데이터 타입 정의
export interface ApplyFormValues {
    name: string;
    phone: string;
    sns_url: string;
    content: string;
    is_agreed_all: boolean;
    is_agreed_penalty: boolean;
    is_agreed_privacy: boolean;
    is_agreed_marketing: boolean;
    is_agreed_third_party: boolean;
}


export function ApplyForm ({campaignId}:{campaignId: string}) {
  
  const router = useRouter();

  // 2. 폼 훅 초기화
  const {register, handleSubmit, control, formState: {errors, isSubmitting}} = useForm<ApplyFormValues>({
    defaultValues: {
      is_agreed_penalty: false,
      is_agreed_privacy: false,
      is_agreed_third_party: false,
      is_agreed_marketing: false
    }
  });  

  // 3. 제출 핸들러
  const onSubmit = async (data: ApplyFormValues) => {
    // 1. 로그인 유저 확인
    const user = await authService.getCurrentUser();
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/login"); // 로그인 페이지로 이동
      return;
    }

    // DB 저장
    const {error} = await campaignService.applyCampaign(campaignId, user, data);
    if(error) {
      // 실패
      alert('신청 중 오류가 발생했습니다.');
      return;
    }
    // 성공
    router.push('/success');
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-5">
      {/*1. 이름 */}
      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <Input id="name" placeholder="홍길동" {...register('name', {required: '이름을 입력해주세요'})}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
    
      {/* 2. 연락처 */}
      <div className="space-y-2">
        <Label htmlFor="phone">연락처</Label>
        <Input id="phone" placeholder="010-1234-5678" {...register('phone', {required: '연락처를 입력해주세요'})}
        />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>} 
      </div>

      {/* 3. SNS 주소 */}
      <div className="space-y-2">
        <Label htmlFor="sns_url">SNS 주소</Label>
        <Input id="sns_url" placeholder="https://www.instagram.com/..." {...register('sns_url', {required: 'SNS 주소를 입력해주세요'})}
        />
        {errors.sns_url && <p className="text-red-500">{errors.sns_url.message}</p>} 
      </div>

      {/* 4. 지원 동기 */}
      <div className="space-y-2">
        <Label htmlFor="content">지원 동기</Label>
        <Textarea 
          id="content" 
          placeholder="이 캠페인에 참여하고 싶은 이유를 적어주세요."
          rows={4}
          {...register('content', {required: '내용을 입력해주세요'})}
        />
        {errors.content && <p className="text-red-500">{errors.content.message}</p>} 
      </div>

      {/* 5. 약관 동의 */}
      <div className="space-y-2 pt-4 border-t">
        {/* 전체 동의 로직은 나중에 구현하고, 일단 개별 체크박스 나열 */}

        {/* 위약금 동의 (필수) */}
          <div className="flex items-stert space-x-2">
            <Controller 
            control={control}
            name="is_agreed_penalty"
            rules={{required: "위약금 동의는 필수입니다."}} 
            render={({field}) => (
                <Checkbox id="penalty" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="penalty">위약금 정책 동의 (필수)</Label>
          </div>
          {errors.is_agreed_penalty && <p className="text-red-500">{errors.is_agreed_penalty.message}</p>}

        {/* 개인정보 동의(필수) */}
        <div className="flex items-stert space-x-2">
          <Controller 
            control={control}
            name="is_agreed_privacy"
            rules={{required: "개인정보 동의는 필수입니다."}} 
            render={({field}) => (
                <Checkbox id="privacy" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          <Label htmlFor="privacy">개인정보 처리 동의 (필수)</Label>
        </div>
        {errors.is_agreed_privacy && <p className="text-red-500">{errors.is_agreed_privacy.message}</p>}

        {/* 제3자 정보 제공 동의(필수) */}
        <div className="flex items-stert space-x-2">
          <Controller 
            control={control}
            name="is_agreed_third_party"
            rules={{required: "제3자 정보 제공 동의는 필수입니다."}} 
            render={({field}) => (
                <Checkbox id="third_party" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          <Label htmlFor="third_party">제 3자 정보 제공 동의 (필수)</Label>
        </div>
        {errors.is_agreed_third_party && <p className="text-red-500">{errors.is_agreed_third_party.message}</p>}

        {/* 마케팅 동의(선택) */}
        <div className="flex items-stert space-x-2">
          <Controller 
            control={control}
            name="is_agreed_marketing"
            rules={{required: false}} 
            render={({field}) => (
                <Checkbox id="marketing" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          <Label htmlFor="marketing">마케팅 정보 수신 동의 (선택)</Label>
        </div>
      </div>

      {/* 6. 제출 버튼 (하단 고정) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t safe-area-bottom flex justify-center">
        <div className="w-full max-w-[480px]">
          <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
            {isSubmitting ? '제출 중...' : '제출하기'}
          </Button>
        </div>
      </div>
      {/* 하단 버튼 공간 확보용 */}
      <div className="h-20"/>
    </form>
  )
}