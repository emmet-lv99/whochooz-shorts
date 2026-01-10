'use client';

import { VideoDetail } from '@/app/_services/video';
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ShortsPlayerProps {
    video: VideoDetail;
}

export default function ShortsPlayer({ video }: ShortsPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const animationRef = useRef<number>();
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true); // 자동재생 가정
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    // 부드러운 진행률 업데이트를 위한 루프
    const updateProgress = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            if (duration) {
                setProgress((current / duration) * 100);
            }
        }
        animationRef.current = requestAnimationFrame(updateProgress);
    };

    // 재생 상태에 따라 애니메이션 루프 제어
    useEffect(() => {
        if (isPlaying) {
            animationRef.current = requestAnimationFrame(updateProgress);
        } else {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        }
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying]);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div 
            className="relative h-[100dvh] w-full bg-black flex items-center justify-center overflow-hidden"
            onClick={togglePlay}
        >
            {/* 비디오 플레이어 */}
            <video 
                ref={videoRef}
                src={video.video_url} 
                className="w-full h-full object-cover"
                playsInline
                loop
                autoPlay 
                muted={isMuted}
                // onTimeUpdate는 제거 (requestAnimationFrame 사용)
            />

            {/* 재생/일시정지 아이콘 (중앙) - 일시정지 때만 보이기 */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20 pointer-events-none">
                    <Play className="w-16 h-16 text-white/80 fill-white" />
                </div>
            )}

            {/* 상단 헤더 */}
            <header className="absolute top-0 left-0 w-full p-4 z-30 pt-safe-top">
                <div className="flex justify-between items-center">
                    <button onClick={(e) => { e.stopPropagation(); router.back(); }} className="p-2 -ml-2 text-white drop-shadow-md">
                        <ChevronLeft size={32} />
                    </button>
                    
                    {/* 음소거 토글 버튼 */}
                    <button 
                        onClick={toggleMute} 
                        className="p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/20 text-white"
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>
            </header>

            {/* 하단 정보 & CTA */}
            <div className="absolute bottom-0 left-0 w-full p-5 pb-8 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-32 space-y-5">
                
                {/* 텍스트 정보 */}
                <div className="space-y-2">
                    {video.campaigns && (
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-base drop-shadow-md">
                                @{video.campaigns.brand}
                            </span>
                            <span className="text-white/80 text-xs px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                공식
                            </span>
                        </div>
                    )}
                    <h1 className="text-white text-lg leading-snug font-medium line-clamp-3 drop-shadow-md pr-10">
                        {video.description}
                    </h1>
                     {/* 해시태그 */}
                     {video.campaigns?.hashtags && (
                        <p className="text-blue-300/90 text-sm font-medium drop-shadow-sm">
                            {video.campaigns.hashtags}
                        </p>
                    )}
                </div>

                {/* 캠페인 신청 버튼 (글래스모피즘 + 애니메이션) */}
                {video.campaigns && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Link href={`/campaigns/${video.campaigns.id}`} className="block w-full">
                            <div className="relative group overflow-hidden rounded-lg border border-white/40 bg-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all active:scale-[0.98]">
                                {/* 빛나는 효과 (Shimmer) */}
                                <div className="absolute inset-0 translate-x-[-100%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                
                                <div className="relative flex items-center justify-between px-5 h-14">
                                    <div className="flex flex-col justify-center">
                                        <span className="text-white text-xs opacity-80">이 제품이 궁금하다면?</span>
                                        <span className="text-white font-bold text-base">무료로 체험단 신청하기</span>
                                    </div>
                                    <ChevronRight className="text-white animate-pulse" size={24} />
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>

            {/* 진행률 바 (최하단) */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-40">
                <div 
                    className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_10px_white]" 
                    style={{ width: `${progress}%` }} 
                />
            </div>
        </div>
    );
}
