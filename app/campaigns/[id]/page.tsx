import CopyButton from "@/components/copy-button";
import DetailHeader from "@/components/detail-header";
import KakaoMap from "@/components/kakao-map";
import PeriodSection from "@/components/period-section";
import ThumbCarousel from "@/components/thumb-carousel";
import { Button } from "@/components/ui/button";
import { getCampaignStatus } from "@/lib/campaign-status";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { campaignService } from "../../_services/campaign";

interface Props {
    params: {
        id: string;
    };
}

export default async function CampaignsPage({ params }: Props) {
    // 1. 데이터 가져오기
    const campaign = await campaignService.getDetail(params.id);

    // 2.데이터 없으면 404페이지로
    if(!campaign) {
        notFound();
    }

    // 3. 캠페인 상태 계산 (통합 로직)
    const campaignStatus = getCampaignStatus({
      status: campaign.status,
      startDate: campaign.start_date,
      endDate: campaign.end_date,
    });
    const { isClosed, isComingSoon } = campaignStatus;

    return (
      <main className="pb-24 bg-white relative">
        {/* 1. 헤더 (Fixed) */}
        <DetailHeader />

        {/* 2. 썸네일 캐러셀 */}
        <ThumbCarousel 
          imageUrl={campaign.thumbnail_url} 
          status={campaign.status}
          startDate={campaign.start_date}
          endDate={campaign.end_date}
        />

        {/* 3. 신청 기간 섹션 */}
        <PeriodSection
          startDate={campaign.start_date}
          endDate={campaign.end_date}
          status={campaign.status}
        />

        {/* 4. 제공 혜택 */}
        <div className="px-5 py-4 bg-white">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="font-bold mb-1 text-slate-700">제공 혜택</h3>
            <p className="text-blue-600 font-semibold text-lg">{campaign.benefit}</p>
          </div>
        </div>

        {/* 5. 상세 정보 */}
        <div className="p-5 space-y-6">
          <div>
            <div className="text-sm text-slate-500 mb-1">
              {campaign.brand}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {campaign.title}
            </h1>
            {/* 본문 (HTML 등) */}
            <div className="pt-2">
              <p className="whitespace-pre-wrap">{campaign.description}</p>
            </div>
            {/* 자세히 보기 버튼 */}
            <Button variant="outline" className="w-full mt-4 h-11 text-slate-600 border-slate-300 shadow-none">
              자세히 보기
            </Button>
          </div>
        {/* ===== 캠페인 안내 ===== */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">캠페인 안내</h3>
          <div className="space-y-4 text-sm">
            {/* 1. 신청기간 */}
            <div className="flex">
              <span className="w-24 text-slate-500 shrink-0">신청기간</span>
              <span className="text-slate-900">{new Date(campaign.start_date).toLocaleDateString('ko-KR')} ~ {new Date(campaign.end_date).toLocaleDateString('ko-KR')}</span>
            </div>

            {/* 2. 제공사항 */}
            <div className="flex">
              <span className="w-24 text-slate-500 shrink-0">제공사항</span>
              <span className="text-slate-900 font-medium">{campaign.benefit}</span>
            </div>

            {/* 3. 방문기간 */}
            <div className="flex">
              <span className="w-24 text-slate-500 shrink-0">방문기간</span>
              <span className="text-slate-900">{campaign.period_guide || '선정 후 개별 안내'}</span>
            </div>

            {/* 4. 플랫폼 */}
            <div className="flex">
              <span className="w-24 text-slate-500 shrink-0">플랫폼</span>
              <span className="text-slate-900">{campaign.channel}</span>
            </div>

            {/* 5. 캠페인 형식 */}
            <div className="flex">
              <span className="w-24 text-slate-500 shrink-0">캠페인 형식</span>
              <span className="text-slate-900">{campaign.type === 'visit' ? '방문형' : '배송형'}</span>
            </div>

            {/* 6. 장소 (방문형일 때만) */}
            {campaign.location && (
              <div className="flex flex-col gap-1">
                <span className="text-slate-500">주소</span>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-900 flex-1 break-all">
                    {campaign.location}
                  </span>
                  <CopyButton text={campaign.location} />
                </div>
    
                {/* 방문형일 때만 지도 노출 */}
                {campaign.type === 'visit' && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
                      <KakaoMap address={campaign.location} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== 컨텐츠 안내 ===== */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">컨텐츠 안내</h3>
          <div className="space-y-3 text-sm text-slate-600">
            {/* TODO: 컨텐츠 가이드 정보 추가 */}
            <p className="text-slate-400">컨텐츠 가이드 정보가 여기에 표시됩니다.</p>
          </div>
        </div>
        

      </div>
      {/* 3. 하단 고정 버튼 (Floating Action Button) */}
      <div className="fixed bottom-0 w-full max-w-[480px] p-4 safe-area-bottom pointer-events-none">
        {/* 툴팁: 마감이 아닐 때만 표시 */}
        {!isClosed && (
          <div className="flex z-1001 justify-center mb-2">
            <div className="relative bg-white px-4 py-2 rounded-full shadow-md text-sm pointer-events-auto">
              <span>지금 </span>
              <span className="text-red-500 font-bold">23명</span>
              <span>이 보고 있어요.</span>
              {/* 말풍선 꼬리 */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white rotate-45 shadow-sm" />
            </div>
          </div>
        )}
        <Link href={`/campaigns/${campaign.id}/apply`} className="pointer-events-auto">
            <Button className="w-full h-[50px] text-lg font-bold rounded-lg shadow-lg" disabled={isClosed}>
            {isClosed ? '마감되었습니다' : '체험단 신청하기'}
            </Button>
          </Link>
      </div>
    </main>
  )
}