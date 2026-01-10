// app/shorts/[id]/page.tsx
import ShortsPlayer from "@/components/shorts-player";
import { notFound } from "next/navigation";
import { videoService } from "../../_services/video";

interface Props {
  params: { id: string }
}

export default async function ShortsDetailPage({ params }: Props) {
  // 1. 데이터 조회 (JOIN된 캠페인 정보 포함)
  const video = await videoService.getDetail(params.id);

  if (!video) return notFound();

  return <ShortsPlayer video={video} />;
}