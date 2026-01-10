'use client'

import authService from "@/app/_services/auth";
import { campaignService } from "@/app/_services/campaign";
import { useModalStore } from "@/app/_store/useModalStore";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 신청 내역 타입 (Service에서 반환하는 타입에 맞춤)
interface Application {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  // Supabase join result (table name key)
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
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // 1. 유저 확인
      const currentUser = await authService.getCurrentUser();
      
      if (!currentUser) {
        // 비로그인 상태면 로그인 페이지로
        router.replace('/login');
        return;
      }
      setUser(currentUser);

      // 2. 신청 내역 가져오기
      const apps = await campaignService.getMyApplications(currentUser.id);
      
      // 데이터 확인용 로그
      console.log('My Applications:', apps);
      
      setApplications(apps as any); 
      setIsLoading(false);
    }
    
    init();
  }, [router]);

  const handleLogout = async () => {
    open({
        title: '로그아웃',
        content: '정말 로그아웃 하시겠습니까?',
        btnText: '로그아웃',
        cancelText: '취소',
        onConfirm: async () => {
           await authService.signOut();
           router.replace('/');
        }
    });
  }

  // 로딩 화면
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* 1. 고정 배경 (Fixed Background) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-400/20 blur-[100px]" />
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[100px]" />
      </div>

      {/* 2. 컨텐츠 영역 */}
      <div className="relative z-10 px-5 pt-20">
        
        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-slate-900 mb-6">마이페이지</h1>

        {/* 프로필 카드 (Glassmorphism) */}
        <div className="relative w-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg rounded-2xl p-6 mb-8 flex items-center gap-4">
            {/* 프로필 이미지 */}
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden relative shadow-inner">
               {user?.user_metadata?.avatar_url ? (
                 <Image src={user.user_metadata.avatar_url} alt="Profile" fill className="object-cover" />
               ) : (
                 <UserIcon className="w-8 h-8 text-slate-400" />
               )}
            </div>
            
            {/* 유저 정보 */}
            <div className="flex-1">
                <p className="text-lg font-bold text-slate-900">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || '사용자'}님
                </p>
                <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
        </div>

        {/* 활동 요약 (Dashboard) */}
        <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm text-center">
                <p className="text-sm text-slate-500 mb-1">총 신청</p>
                <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm text-center">
                <p className="text-sm text-slate-500 mb-1">선정됨</p>
                <p className="text-2xl font-bold text-indigo-600">
                    {applications.filter(a => a.status === 'approved').length}
                </p>
            </div>
        </div>

        {/* 신청 내역 리스트 */}
        <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-4">나의 캠페인 활동</h2>
            
            {applications.length === 0 ? (
                <div className="bg-white/40 border border-slate-100 rounded-xl p-8 text-center text-slate-400 text-sm">
                    아직 신청한 캠페인이 없어요.
                    <Link href="/" className="block mt-3 text-indigo-600 underline font-medium">캠페인 둘러보기</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-sm rounded-xl p-4 flex gap-4 transition-all hover:scale-[1.01]">
                            {/* 썸네일 */}
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                                {app.campaigns?.thumbnail_url && (
                                    <Image src={app.campaigns.thumbnail_url} alt="" fill className="object-cover" />
                                )}
                            </div>

                            {/* 정보 */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(app.status)}`}>
                                        {getStatusText(app.status)}
                                    </span>
                                    <span className="text-xs text-slate-400 truncate tracking-tight">{new Date(app.created_at).toLocaleDateString()} 신청</span>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 truncate mb-0.5">{app.campaigns?.title}</h3>
                                <p className="text-xs text-slate-500">{app.campaigns?.brand}</p>
                            </div>
                        </div>
                    ))}
                </div>
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

// 헬퍼 함수: 상태 뱃지 스타일
function getStatusBadgeStyle(status: string) {
    switch(status) {
        case 'approved': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        case 'rejected': return 'bg-slate-100 text-slate-500 border-slate-200';
        case 'pending':
        default: return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    }
}

// 헬퍼 함수: 상태 텍스트
function getStatusText(status: string) {
    switch(status) {
        case 'approved': return '선정됨';
        case 'rejected': return '미선정';
        case 'pending':
        default: return '검토중';
    }
}
