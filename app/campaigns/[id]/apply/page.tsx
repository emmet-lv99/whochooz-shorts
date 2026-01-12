// app/campaigns/[id]/apply/page.tsx

import { campaignService } from "@/app/_services/campaign";
import { ApplyForm } from "@/components/apply-form";
import DetailHeader from "@/components/detail-header";
import { notFound } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function ApplyPage({ params }: Props) {
    // 1. 캠페인 정보 조회 (제목, 브랜드명 표시용)
    const campaign = await campaignService.getDetail(params.id);

    // 캠페인이 존재하지 않으면 404 페이지로 이동
    if (!campaign) {
      notFound();
    }

    return (
      <main className="bg-slate-50 min-h-screen pb-24">
        {/* 헤더 */}
        <DetailHeader />

        {/* 상단 캠페인 정보 */}
        <div className="pt-14 px-5 py-6 bg-white border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900">체험단 신청하기</h1>
          <p className="text-sm text-slate-500 mt-1">{campaign.brand} · {campaign.title}</p>
        </div>

        {/* 입력 폼 (Client Component) */}
        <ApplyForm campaignId={campaign.id} campaignType={campaign.type} />
      </main>
    )
}