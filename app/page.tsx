import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { campaignService } from "./_services/campaign";

export default async function Home() {
  // 1. 서비스 데이터 호출 (Store 불필요!)
  const campaigns = await campaignService.getAllList();

  return (
    <main className="pb-20">{/* Bottom Nav 공간 확보*/}
      {/* 2. 섹션 타이틀 */}
      <section className="px-4 py-6">
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-lg font-bold">🔥 지금 뜨는 캠페인</h2>
          <Link href="/campaigns" className="text-sm text-slate-500 hover:text-blue-600">더보기</Link>
        </div>
        {/* 3. 캠페인 리스트 */}
        <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Link href={`/campaigns/${campaign.id}`} key={campaign.id} className="block">
            <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
              {/* 썸네일 */}
              <div className="relative aspect-video bg-slate-100">
                <img src={campaign.thumbnail_url} className="w-full h-full object-cover" alt={campaign.title} />
                {/* 모집중/마감 배지 */}
                <Badge className={`absolute top-2 right-2 ${campaign.status === 'open' ? 'bg-blue-600' : 'bg-slate-500'}`}>{campaign.status === 'open' ? '모집중' : '마감'}</Badge>
                </div>
                {/* 텍스트 정보 */}
                <CardContent className="p-4">
                  <div className="text-xs text-slate-500 mb-1">{campaign.brand}</div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">{campaign.title}</h3>
                  <div className="mt-2 text-sm text-blue-600 font-medium"> 🎁 {campaign.benefit}</div>
                </CardContent>
            </Card>
          </Link>
        ))}
        </div>
      {/* 데이터 없을 경우 */}
      {campaigns.length === 0 && <p>진행 중인 캠페인이 없습니다.</p>}
      </section>
    </main>
  );
}
