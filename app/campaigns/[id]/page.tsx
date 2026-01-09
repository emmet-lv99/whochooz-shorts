import CopyButton from "@/components/copy-button";
import DetailButton from "@/components/detail-button";
import DetailHeader from "@/components/detail-header";
import FloatingActionBar from "@/components/floating-action-bar";
import KakaoMap from "@/components/kakao-map";
import PeriodSection from "@/components/period-section";
import ThumbCarousel from "@/components/thumb-carousel";
import { getCampaignStatus } from "@/lib/campaign-status";
import { MapPin } from "lucide-react";
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
            <DetailButton description={campaign.description} title={campaign.title} />
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

            {/* 3. 방문/체험 기한 */}
            <div className="flex">
              <span className="w-24 text-slate-500 shrink-0">방문/체험 기한</span>
              <span className="text-slate-900">{campaign.exp_period_guide || '선정 후 14일 이내 방문/체험'}</span>
            </div>

            {/* 4. 리뷰기한 */}
            <div className="flex">
              <span className="w-24 text-slate-500 shrink-0">리뷰기한</span>
              <span className="text-slate-900">{campaign.review_period_guide || '방문 후 7일 이내 등록'}</span>
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
          <div className="space-y-4 text-sm">
            {/* 0. 필수 해시태그 (카드형) */}
            {campaign.hashtags && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-700">필수 해시태그</span>
                  <CopyButton text={campaign.hashtags} />
                </div>
                <p className="text-blue-600 font-medium">{campaign.hashtags}</p>
              </div>
            )}

            {/* 1. 리뷰 등록 기한 */}
            <div className="flex">
              <span className="w-24 text-slate-500 shrink-0">리뷰 등록</span>
              <span className="text-slate-900">{campaign.review_period_guide || '방문 후 7일 이내'}</span>
            </div>

            {/* 2. 얼굴 노출 */}
            <div className="flex">
              <span className="w-24 text-slate-500 shrink-0">얼굴 노출</span>
              <span className="text-slate-900">{campaign.is_face_required ? '필수' : '선택'}</span>
            </div>

            {/* 3. 원본 제출 */}
            <div className="flex">
              <span className="w-24 text-slate-500 shrink-0">원본 제출</span>
              <span className="text-slate-900">{campaign.is_original_required ? '필수' : '선택'}</span>
            </div>
          </div>
        </div>

        {/* ===== 리뷰제작 가이드 ===== */}
        {campaign.guide && (
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">리뷰제작 가이드</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{campaign.guide}</p>
          </div>
        )}

        {/* ===== 추가 안내사항 ===== */}
        {campaign.notice && (
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">추가 안내사항</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{campaign.notice}</p>
          </div>
        )}

        {/* ===== 주의사항 ===== */}
        {campaign.warning && (
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">주의사항</h3>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-sm text-red-700 whitespace-pre-wrap">{campaign.warning}</p>
            </div>
          </div>
        )}
        

      </div>
      {/* 3. 하단 고정 버튼 (Floating Action Button) */}
      <FloatingActionBar 
        campaignId={campaign.id} 
        status={campaignStatus.state}
        startDate={campaign.start_date}
      />
    </main>
  )
}