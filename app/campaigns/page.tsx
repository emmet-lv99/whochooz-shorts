import StatusBadge from "@/components/status-badge";
import { getCampaignStatus } from "@/lib/campaign-status";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { campaignService } from "../_services/campaign";

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
            <div className="flex items-center gap-2 px-4 pt-6 pb-3 bg-white">
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
                {campaigns.map((campaign) => {
                    // 통합 유틸리티 사용
                    const campaignStatus = getCampaignStatus({
                        status: campaign.status,
                        startDate: campaign.start_date,
                        endDate: campaign.end_date,
                    });
                    const { isClosed, isComingSoon, dday } = campaignStatus;
                    
                    return (
                        <Link href={`/campaigns/${campaign.id}`} key={campaign.id} className="block group">
                            {/* 카드 컴포넌트 커스텀 */}
                            <div className="flex flex-col gap-3 transition-transform duration-300 hover:scale-95 active:scale-95">
                                {/* 썸네일 영역 */}
                                <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                                    <StatusBadge status={campaign.status} startDate={campaign.start_date} endDate={campaign.end_date} />
                                    <img 
                                        src={campaign.thumbnail_url} 
                                        className={cn("w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-90", isClosed && "grayscale")} 
                                        alt={campaign.title} 
                                    />
                                </div>

                                {/* 텍스트 정보 */}
                                <div className="space-y-1">
                                    {/* D-Day */}
                                    <div className="flex items-center gap-2 text-xs font-bold">
                                        <span className={cn(isClosed ? "text-slate-400" : isComingSoon ? "text-slate-500" : "text-red-500")}>
                                            {isComingSoon ? '오픈예정' : dday}
                                        </span>
                                    </div>
                                    
                                    {/* 타이틀 */}
                                    <h3 className={cn("text-base font-medium leading-tight line-clamp-1", isClosed ? "text-slate-400" : "text-slate-900")}>
                                        {campaign.title}
                                    </h3>

                                    {/* 혜택 (가장 중요) */}
                                    <div className={cn("text-sm font-bold line-clamp-1", isClosed ? "text-slate-400" : "text-blue-600")}>
                                        {campaign.benefit}
                                    </div>

                                    {/* 모집 인원 정보 */}
                                    <div className="text-xs text-slate-400 mt-1">
                                        모집 {campaign.recruit_count}명
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
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
