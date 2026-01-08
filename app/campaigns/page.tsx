import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react"; // Heart 제거
import Link from "next/link";
import { campaignService } from "../_services/campaign";

// D-Day 계산 함수
function getDday(endDateStr: string) {
    const end = new Date(endDateStr);
    const now = new Date();
    end.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '마감';
    if (diffDays === 0) return '오늘마감';
    return `D-${diffDays}`;
}

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

            {/* 3. 리스트 (2열 그리드) */}
            <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-8">
                {campaigns.map((campaign) => {
                    const dday = getDday(campaign.end_date);
                    const isClosed = campaign.status === 'closed' || dday === '마감';
                    
                    return (
                        <Link href={`/campaigns/${campaign.id}`} key={campaign.id} className="block group">
                            {/* 카드 컴포넌트 커스텀 */}
                            <div className="flex flex-col gap-3 hover-lift">
                                {/* 썸네일 영역 (하트 버튼 제거됨) */}
                                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                                    <img 
                                        src={campaign.thumbnail_url} 
                                        className={cn("w-full h-full object-cover transition-transform duration-500 group-hover:scale-105", isClosed && "grayscale")} 
                                        alt={campaign.title} 
                                    />
                                </div>

                                {/* 텍스트 정보 */}
                                <div className="space-y-1">
                                    {/* D-Day */}
                                    <div className="flex items-center gap-2 text-xs font-bold">
                                        <span className={cn(isClosed ? "text-slate-400" : "text-red-500")}>
                                            {isClosed ? '마감' : dday}
                                        </span>
                                    </div>
                                    
                                    {/* 타이틀 */}
                                    <h3 className={cn("text-base font-bold leading-tight line-clamp-2", isClosed ? "text-slate-400" : "text-slate-900")}>
                                        {campaign.title}
                                    </h3>

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
