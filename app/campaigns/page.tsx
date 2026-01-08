import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { campaignService } from "../_services/campaign";

// app/campaigns/page.tsx
interface Props {
    searchParams: {
        status?: 'open' | 'closed';
    };
}    
export default async function CampaignsPage({ searchParams }: Props) {
    const currentStatus = searchParams.status || 'open';
    const campaigns = await campaignService.getAllList(currentStatus); 

    return (
        <main className="pb-20 bg-white min-h-screen">
            {/* 1. 헤더 */}
            <header className="sticky top-0 z-10 flex items-center h-14 px-4 bg-white border-b">
                <Link href="/" className="mr-4">
                    <ChevronLeft className="w-6 h-6 text-slate-900" />
                </Link>
              <h1 className="text-lg font-bold">
                모든 캠페인
              </h1>
            </header>
            {/* 2. 탭 */}
            <div className="flex border-b">
              <Link href="/campaigns?status=open" 
              className={cn("flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors",
                            currentStatus === 'open' 
                            ? "border-slate-900 text-slate-900" 
                            : "border-transparent text-slate-400")}>
                모집중
              </Link>
              <Link href="/campaigns?status=closed"
              className={cn("flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors",
                            currentStatus === 'closed' 
                            ? "border-slate-900 text-slate-900" 
                            : "border-transparent text-slate-400")}>
                마감됨
              </Link>
            </div>
           {/* 3. 리스트 */}
            <div className="p-4 space-y-4">
                {campaigns.map((campaign) => (
                    <Link href={`/campaigns/${campaign.id}`} key={campaign.id} className="block">
                        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative aspect-video bg-slate-100">
                                <img src={campaign.thumbnail_url} className="w-full h-full object-cover" alt={campaign.title} />
                                <Badge className={cn("absolute top-2 right-2", campaign.status === 'open' ? "bg-blue-600" : "bg-slate-500")}>
                                    {campaign.status === 'open' ? '모집중' : '마감'}
                                </Badge>
                            </div>
                            <CardContent className="p-4">
                                <div className="text-xs text-slate-500 mb-1">{campaign.brand}</div>
                                <h3 className="font-bold text-slate-900 line-clamp-1">{campaign.title}</h3>
                                <div className="mt-2 text-sm text-blue-600 font-medium">🎁 {campaign.benefit}</div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            
                {/* 데이터 없을 때 */}
                {campaigns.length === 0 && (
                    <div className="py-20 text-center text-slate-400 text-sm">
                        해당하는 캠페인이 없습니다.
                    </div>
                )}
            </div>
        </main>
    )
}
