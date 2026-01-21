// VIP 페이지 로딩 상태 컴포넌트
export default function VIPLoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="vip-spinner mx-auto mb-6" />
        <p className="text-white/60 text-sm">초대장을 확인하고 있습니다...</p>
      </div>
    </div>
  );
}
