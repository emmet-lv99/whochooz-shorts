'use client'

import { campaignService } from "@/app/_services/campaign";
import { userService } from "@/app/_services/user";
import { useAuthStore } from "@/app/_store/useAuthStore";
import { useModalStore } from "@/app/_store/useModalStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDaumPostcodePopup } from 'react-daum-postcode';
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
    zipcode?: string;
    address?: string;
    detailed_address?: string;
    sns_url: string;
    content: string;
    is_agreed_all: boolean;
    is_agreed_penalty: boolean;
    is_agreed_privacy: boolean;
    is_agreed_marketing: boolean;
    is_agreed_third_party: boolean;
}


interface Props {
  campaignId: string
  campaignType: 'visit' | 'delivery'
}

export function ApplyForm ({campaignId, campaignType}: Props) {
  
  const router = useRouter();
  const { open } = useModalStore();
  const { user } = useAuthStore(); // Global Auth State

  // 2. 폼 훅 초기화
  const {register, handleSubmit, control, setValue, watch, formState: {errors, isSubmitting}} = useForm<ApplyFormValues>({
    defaultValues: {
      is_agreed_penalty: false,
      is_agreed_privacy: false,
      is_agreed_third_party: false,
      is_agreed_marketing: false
    }
  });  

  // 프로필 정보 불러오기 (이름, 연락처, 주소 등)
  useEffect(() => {
    if (user) {
        userService.getProfile(user.id).then((profile) => {
            console.log("ApplyForm: Fetched profile", profile); // 디버깅용 로그
            if (profile) {
                // 이름, 연락처 자동 입력
                if(profile.name) setValue('name', profile.name);
                if(profile.phone) setValue('phone', profile.phone);

                // 배송지의 경우 주소도 입력
                if(profile.zipcode) setValue('zipcode', profile.zipcode);
                if(profile.address) setValue('address', profile.address);
                if(profile.detailed_address) setValue('detailed_address', profile.detailed_address);
            }
        });
    } else {
        console.log("ApplyForm: No user yet");
    }
  }, [user, setValue]);

  // 다음 주소 찾기 훅
  const openPostcode = useDaumPostcodePopup();

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    setValue('zipcode', data.zonecode);
    setValue('address', fullAddress);
    // 상세주소 포커스 등 UX 처리 가능
  };

  const handleClick = () => {
    openPostcode({ onComplete: handleComplete });
  };

  // 3. 제출 핸들러
  const onSubmit = async (data: ApplyFormValues) => {
    // 1. 로그인 유저 확인 (Store 이용)
    if (!user) {
      open({
        title: '알림',
        content: '로그인이 필요한 서비스입니다.',
        btnText: '로그인 하러 가기',
        onConfirm: () => router.push("/login")
      });
      return;
    }

    // 주소 합치기 (배송형일 경우)
    // DB에 주소 필드가 하나라면 합쳐서 보내거나 별도 컬럼으로 보내거나.
    // 여기서는 service단에서 처리하도록 그대로 넘김.
    if (campaignType === 'delivery') {
         if(!data.address || !data.detailed_address) {
             // 혹시 모를 validation (useForm required로 잡히겠지만)
             return;
         }
    }

    // DB 저장
    const {error} = await campaignService.applyCampaign(campaignId, user, data);
    if(error) {
      // 실패
      open({
        title: '신청 실패',
        content: '신청 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.'
      });
      return;
    }
    // 성공
    // 성공 페이지 이동은 UX상 모달보다 페이지 전환이 나음 (이미 구현됨)
    router.push('/success');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
      
      {/* 섹션 1: 기본 정보 */}
      <div className="bg-white rounded-lg p-5 space-y-5">
        <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">기본 정보</h2>
        
        {/* 이름 */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-slate-700">이름</Label>
          <Input 
            id="name" 
            placeholder="홍길동" 
            className="h-11 rounded-md border-slate-200 focus:border-blue-600 focus:ring-blue-600"
            {...register('name', {required: '이름을 입력해주세요'})}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
      
        {/* 연락처 */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-slate-700">연락처</Label>
          <Input 
            id="phone" 
            placeholder="010-1234-5678" 
            className="h-11 rounded-md border-slate-200 focus:border-blue-600 focus:ring-blue-600"
            {...register('phone', {required: '연락처를 입력해주세요'})}
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>} 
        </div>

        {/* 배송지 (배송형일 경우만 노출) */}
        {campaignType === 'delivery' && (
            <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium text-slate-700">배송지 정보</Label>
                <div className="flex gap-2">
                    <Input 
                        placeholder="우편번호" 
                        readOnly 
                        className="bg-slate-50"
                        {...register('zipcode', {required: '주소를 검색해주세요'})}
                    />
                    <Button type="button" onClick={handleClick} variant="outline" className="whitespace-nowrap">
                        주소 검색
                    </Button>
                </div>
                <Input 
                    placeholder="기본 주소" 
                    readOnly 
                    className="bg-slate-50"
                    {...register('address', {required: '주소를 검색해주세요'})}
                />
                <Input 
                    placeholder="상세 주소를 입력해주세요" 
                    {...register('detailed_address', {required: '상세 주소를 입력해주세요'})}
                />
                 {(errors.zipcode || errors.address || errors.detailed_address) && (
                    <p className="text-red-500 text-xs">배송지 정보를 모두 입력해주세요.</p>
                 )}
            </div>
        )}

        {/* SNS 주소 */}
        <div className="space-y-2">
          <Label htmlFor="sns_url" className="text-sm font-medium text-slate-700">SNS 주소</Label>
          <Input 
            id="sns_url" 
            placeholder="https://www.instagram.com/..." 
            className="h-11 rounded-md border-slate-200 focus:border-blue-600 focus:ring-blue-600"
            {...register('sns_url', {required: 'SNS 주소를 입력해주세요'})}
          />
          {errors.sns_url && <p className="text-red-500 text-xs">{errors.sns_url.message}</p>} 
        </div>
      </div>

      {/* 섹션 2: 지원 동기 */}
      <div className="bg-white rounded-lg p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">지원 동기</h2>
        
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-medium text-slate-700">
            이 캠페인에 참여하고 싶은 이유를 적어주세요.
          </Label>
          <Textarea 
            id="content" 
            placeholder="예) 해당 브랜드의 제품을 평소에 애용하고 있어 SNS에 소개하고 싶습니다."
            rows={5}
            className="rounded-md border-slate-200 focus:border-blue-600 focus:ring-blue-600 resize-none"
            {...register('content', {required: '내용을 입력해주세요'})}
          />
          {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>} 
        </div>
      </div>

      {/* 섹션 3: 약관 동의 */}
      <div className="bg-white rounded-lg p-5 space-y-4">
        <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">약관 동의</h2>

        {/* 위약금 동의 (필수) */}
        <div className="flex items-center space-x-3 py-2">
          <Controller 
            control={control}
            name="is_agreed_penalty"
            rules={{required: "위약금 동의는 필수입니다."}} 
            render={({field}) => (
              <Checkbox 
                id="penalty" 
                checked={field.value} 
                onCheckedChange={field.onChange}
                className="w-5 h-5 rounded border-slate-300"
              />
            )}
          />
          <Label htmlFor="penalty" className="text-sm text-slate-700 cursor-pointer flex-1">
            위약금 정책 동의 <span className="text-red-500">(필수)</span>
          </Label>
        </div>
        {errors.is_agreed_penalty && <p className="text-red-500 text-xs -mt-2">{errors.is_agreed_penalty.message}</p>}

        {/* 개인정보 동의(필수) */}
        <div className="flex items-center space-x-3 py-2">
          <Controller 
            control={control}
            name="is_agreed_privacy"
            rules={{required: "개인정보 동의는 필수입니다."}} 
            render={({field}) => (
              <Checkbox 
                id="privacy" 
                checked={field.value} 
                onCheckedChange={field.onChange}
                className="w-5 h-5 rounded border-slate-300"
              />
            )}
          />
          <Label htmlFor="privacy" className="text-sm text-slate-700 cursor-pointer flex-1">
            개인정보 처리 동의 <span className="text-red-500">(필수)</span>
          </Label>
        </div>
        {errors.is_agreed_privacy && <p className="text-red-500 text-xs -mt-2">{errors.is_agreed_privacy.message}</p>}

        {/* 제3자 정보 제공 동의(필수) */}
        <div className="flex items-center space-x-3 py-2">
          <Controller 
            control={control}
            name="is_agreed_third_party"
            rules={{required: "제3자 정보 제공 동의는 필수입니다."}} 
            render={({field}) => (
              <Checkbox 
                id="third_party" 
                checked={field.value} 
                onCheckedChange={field.onChange}
                className="w-5 h-5 rounded border-slate-300"
              />
            )}
          />
          <Label htmlFor="third_party" className="text-sm text-slate-700 cursor-pointer flex-1">
            제 3자 정보 제공 동의 <span className="text-red-500">(필수)</span>
          </Label>
        </div>
        {errors.is_agreed_third_party && <p className="text-red-500 text-xs -mt-2">{errors.is_agreed_third_party.message}</p>}

        {/* 마케팅 동의(선택) */}
        <div className="flex items-center space-x-3 py-2 border-t border-slate-100 pt-4">
          <Controller 
            control={control}
            name="is_agreed_marketing"
            rules={{required: false}} 
            render={({field}) => (
              <Checkbox 
                id="marketing" 
                checked={field.value} 
                onCheckedChange={field.onChange}
                className="w-5 h-5 rounded border-slate-300"
              />
            )}
          />
          <Label htmlFor="marketing" className="text-sm text-slate-500 cursor-pointer flex-1">
            마케팅 정보 수신 동의 <span className="text-slate-400">(선택)</span>
          </Label>
        </div>
      </div>

      {/* 하단 여백 (플로팅 버튼 공간 확보) */}
      <div className="h-4"/>

      {/* 제출 버튼 (플로팅) */}
      <div className="fixed bottom-0 z-[1001] w-full max-w-[480px] p-4 safe-area-bottom pointer-events-none left-1/2 -translate-x-1/2">
        <div className="pointer-events-auto">
          <Button 
            type="submit" 
            className="border-glow w-full h-[52px] text-lg font-bold rounded-lg shadow-2xl bg-black/65 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white" 
            disabled={isSubmitting}
          >
            {isSubmitting ? '제출 중...' : '신청하기'}
          </Button>
        </div>
      </div>
    </form>
  )
}