'use client'

import { bookmarkService } from "@/app/_services/bookmark";
import { campaignService } from "@/app/_services/campaign";
import { useAuthStore } from "@/app/_store/useAuthStore";
import { useModalStore } from "@/app/_store/useModalStore";
import { cn } from "@/lib/utils";
import { Bookmark, LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 신청 내역 타입
interface Application {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  campaigns: {
    id: string;
    title: string;
    brand: string;
    thumbnail_url: string;
    status: 'open' | 'closed';
    end_date: string;
  }
}

// 저장한 내역 타입
interface BookmarkItem {
  created_at: string;
  campaigns: {
    id: string;
    title: string;
    brand: string;
    thumbnail_url: string;
    status: 'open' | 'closed';
    end_date: string;
  }
}

export default function MyPage() {
  const router = useRouter();
  const { open } = useModalStore();
  const { user, isLoading: isAuthLoading, logout } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'applications' | 'bookmarks'>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 데이터 로딩 & 인증 가드
  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    async function loadData() {
        if (!user) return; 
        try {
            // 병렬 요청으로 성능 최적화
            const [myApps, myBookmarks] = await Promise.all([
                campaignService.getMyApplications(user.id),
                bookmarkService.getMyBookmarks(user.id)
            ]);
            
            setApplications(myApps as any); 
            setBookmarks(myBookmarks as any);
        } catch (e) {
            console.error(e);
        } finally {
            setIsDataLoading(false);
        }
    }
    
    loadData();
  }, [user, isAuthLoading, router]);

  const handleLogout = async () => {
    open({
        title: '로그아웃',
        content: '정말 로그아웃 하시겠습니까?',
        btnText: '로그아웃',
        cancelText: '취소',
        onConfirm: async () => {
           await logout();
           router.replace('/');
        }
    });
  }

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* 1. 고정 배경 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-400/20 blur-[100px]" />
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[100px]" />
      </div>

      {/* 2. 컨텐츠 영역 */}
      <div className="relative z-10 px-5 pt-20">
        
        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-slate-900 mb-6">마이페이지</h1>

        {/* 프로필 카드 (rounded-lg 적용) */}
        <div className="relative w-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg rounded-lg p-6 mb-8 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden relative shadow-inner">
               {user?.user_metadata?.avatar_url ? (
                 <Image src={user.user_metadata.avatar_url} alt="Profile" fill className="object-cover" />
               ) : (
                 <UserIcon className="w-8 h-8 text-slate-400" />
               )}
            </div>
            
            <div className="flex-1">
                <p className="text-lg font-bold text-slate-900">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || '사용자'}님
                </p>
                <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-slate-200/80 mb-6">
            <button 
                onClick={() => setActiveTab('applications')} 
                className={cn(
                    "flex-1 pb-3 text-sm font-medium border-b-2 transition-all", 
                    activeTab === 'applications' 
                        ? 'border-slate-900 text-slate-900 font-bold' 
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                )}
            >
                신청 내역 <span className="ml-1 text-xs opacity-80 bg-slate-100 px-1.5 py-0.5 rounded-full">{applications.length}</span>
            </button>
            <button 
                onClick={() => setActiveTab('bookmarks')} 
                className={cn(
                    "flex-1 pb-3 text-sm font-medium border-b-2 transition-all", 
                    activeTab === 'bookmarks' 
                        ? 'border-slate-900 text-slate-900 font-bold' 
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                )}
            >
                저장한 캠페인 <span className="ml-1 text-xs opacity-80 bg-slate-100 px-1.5 py-0.5 rounded-full">{bookmarks.length}</span>
            </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="min-h-[200px]">
            {activeTab === 'applications' ? (
                // === 신청 내역 ===
                applications.length === 0 ? (
                    <EmptyState message="아직 신청한 캠페인이 없어요." linkText="캠페인 둘러보기" />
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <Link href={`/campaigns/${app.campaigns?.id}`} key={app.id} className="block group">
                                <div className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-sm rounded-lg p-4 flex gap-4 transition-all hover:scale-[1.01] active:scale-[0.99]">
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                                        {app.campaigns?.thumbnail_url && (
                                            <Image src={app.campaigns.thumbnail_url} alt="" fill className="object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(app.status)}`}>
                                                {getStatusText(app.status)}
                                            </span>
                                            <span className="text-xs text-slate-400 truncate tracking-tight">{new Date(app.created_at).toLocaleDateString()} 신청</span>
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 truncate mb-0.5 group-hover:text-indigo-600 transition-colors">{app.campaigns?.title}</h3>
                                        <p className="text-xs text-slate-500">{app.campaigns?.brand}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )
            ) : (
                // === 저장한 캠페인 ===
                bookmarks.length === 0 ? (
                    <EmptyState message="저장한 캠페인이 없어요." linkText="캠페인 구경가기" />
                ) : (
                    <div className="space-y-4">
                        {bookmarks.map((item) => (
                             <Link href={`/campaigns/${item.campaigns?.id}`} key={item.campaigns?.id} className="block group">
                                <div className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-sm rounded-lg p-4 flex gap-4 transition-all hover:scale-[1.01] active:scale-[0.99]">
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                                        {/* 북마크 아이콘 오버레이 */}
                                        <div className="absolute top-0 right-1 z-10 bg-white/30 p-1 rounded-b-md backdrop-blur-sm border-x border-b border-white/50 shadow-sm">
                                            <Bookmark className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
                                        </div>
                                        {item.campaigns?.thumbnail_url && (
                                            <Image src={item.campaigns.thumbnail_url} alt="" fill className="object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            {/* Saved 뱃지 */}
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200`}>
                                                Saved
                                            </span>
                                            <span className="text-xs text-slate-400 truncate tracking-tight">{item.campaigns?.brand}</span>
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 truncate mb-0.5 group-hover:text-indigo-600 transition-colors">{item.campaigns?.title}</h3>
                                        <p className="text-xs text-slate-500">
                                            {item.campaigns?.status === 'closed' ? '마감됨' : '모집중'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )
            )}
        </div>

        {/* 로그아웃 버튼 */}
        <div className="mt-8 border-t border-slate-200/50 pt-8">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium"
            >
                <LogOut className="w-4 h-4" />
                로그아웃
            </button>
        </div>

      </div>
    </div>
  )
}

function EmptyState({message, linkText}: {message: string, linkText: string}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <div className="text-3xl grayscale opacity-50">📂</div>
            </div>
            <p className="text-slate-500 text-sm mb-3">{message}</p>
            <Link href="/" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
                {linkText}
            </Link>
        </div>
    )
}

function getStatusBadgeStyle(status: string) {
    switch(status) {
        case 'approved': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        case 'rejected': return 'bg-slate-100 text-slate-500 border-slate-200';
        case 'pending':
        default: return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    }
}

function getStatusText(status: string) {
    switch(status) {
        case 'approved': return '선정됨';
        case 'rejected': return '미선정';
        case 'pending':
        default: return '검토중';
    }
}
