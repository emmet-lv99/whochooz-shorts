import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
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

    return (
      <main className="pb-24 bg-white relative">
        {/* 1. 썸네일 */}
        <div className="relative aspect-video w-full bg-slate-100">
          <img src={campaign.thumbnail_url} className="w-full h-full object-cover" alt={campaign.title} />
        </div>
        {/* 2. 상세 정보 */}
        <div className="p-5 space-y-6">
          <div>
            <div className="text-sm text-slate-500 mb-1">
              {campaign.brand}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {campaign.title}
            </h1>
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary">
                {campaign.type === 'visit' ? '방문형' : '배송형'}
              </Badge>
              <Badge variant="outline">
                {campaign.channel}
              </Badge>
            </div> 
          </div>
        {/* 혜택 박스 */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="font-bold mb-1 text-slate-700">제공 혜택</h3>
          <p className="text-blue-600 font-semibold text-lg">{campaign.benefit}</p>
        </div>
        {/* 정보 리스트 */}
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>신청기간: ~ {new Date(campaign.end_date).toLocaleDateString()}</span>
          </div>
        {campaign.location && (
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>장소: {campaign.location}</span>
          </div>
        )}
        </div>
        {/* 본문 (HTML 등) */}
        <div className="pt-4 border-t border-slate-100">
          <p className="whitespace-pre-wrap">{campaign.description}</p>
        </div>

      </div>
      {/* 3. 하단 고정 버튼 (Bottom Floading Action Button) */}
      <div className="fixed bottom-0 w-full max-w-[480px] p-4 bg-white border-t border-slate-100 safe-area-bottom">
        <Link href={`/campaigns/${campaign.id}/apply`}>
            <Button className="w-full h-12 text-lg font-bold" disabled={campaign.status !== 'open'}>
            {campaign.status === 'open' ? '체험단 신청하기' : '마감되었습니다'}
            </Button>
        </Link>
      </div>
      </main>
    )
}