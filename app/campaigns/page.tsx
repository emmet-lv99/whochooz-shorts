import CampaignCard from "@/components/campaign-card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { campaignService } from "../_services/campaign";

interface Props {
    searchParams: {
        status?: 'open' | 'closed';
    };
}    

import CampaignHeader from "@/components/campaign-header"; // Import 추가

export default async function CampaignsPage({ searchParams }: Props) {
    const currentStatus = searchParams.status || 'open';
    const campaigns = await campaignService.getAllList(currentStatus); 

    return (
        <main className="pb-20 min-h-screen">
            {/* 1. 헤더 */}
            <CampaignHeader />

            {/* 2. 탭 */}
            <div className="flex items-center gap-2 px-4 pt-6 pb-3">
                <Link href="/campaigns?status=open" 
                    className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                        currentStatus === 'open' 
                            ? "bg-slate-900 text-white" 
                            : "text-slate-400 hover:text-slate-600"
                    )}>
                    모집중
                </Link>
                <Link href="/campaigns?status=closed"
                    className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                        currentStatus === 'closed' 
                            ? "bg-slate-900 text-white" 
                            : "text-slate-400 hover:text-slate-600"
                    )}>
                    마감됨
                </Link>
            </div>

            {/* 3. 리스트 (2열 그리드) */}
            <div className="px-4 py-4 grid grid-cols-2 gap-x-3 gap-y-8">
                {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
            </div>

            {/* 데이터 없을 때 */}
            {campaigns.length === 0 && (
                <div className="py-20 text-center text-slate-400 text-sm">
                    해당하는 캠페인이 없습니다.
                </div>
            )}
        </main>
    )
}
