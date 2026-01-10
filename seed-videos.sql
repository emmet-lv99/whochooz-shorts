-- 쇼츠 영상 더미 데이터 20개 추가 (PostgreSQL)
-- campaign_id는 기존 campaigns 테이블에서 랜덤으로 선택하여 연결합니다.

INSERT INTO videos (
  description, video_url, thumbnail_url, campaign_id
) VALUES
(
  '이 맛집 실화야? 입에서 살살 녹는 참치 먹방 🐟', 
  'https://www.youtube.com/shorts/VIDEO_ID_1', 
  'https://images.unsplash.com/photo-1595166946001-26c7d2af1f42?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '3초만에 물광 피부 되는 법 ✨ 시카 앰플 리뷰', 
  'https://www.youtube.com/shorts/VIDEO_ID_2', 
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '연남동 수제버거 폼 미쳤다..🍔 치즈 폭포 주의', 
  'https://www.youtube.com/shorts/VIDEO_ID_3', 
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '차에 타자마자 향기 무엇? 차량용 디퓨저 언박싱', 
  'https://www.youtube.com/shorts/VIDEO_ID_4', 
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '잠실 뷰맛집 카페에서 인생샷 건지기 ☕️ 애프터눈티', 
  'https://www.youtube.com/shorts/VIDEO_ID_5', 
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '대학생 데일리백 추천! 에코백 코디 모음', 
  'https://www.youtube.com/shorts/VIDEO_ID_6', 
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '개털 머릿결 복구하는 꿀템 발견! 노워시 트리트먼트', 
  'https://www.youtube.com/shorts/VIDEO_ID_7', 
  'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '이태원 루프탑 와인바 분위기 대박..🌙 데이트 코스 추천', 
  'https://www.youtube.com/shorts/VIDEO_ID_8', 
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '감성 캠핑 필수템! 레트로 스피커 사용기 🎵', 
  'https://www.youtube.com/shorts/VIDEO_ID_9', 
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '다이어트 도시락이 이렇게 맛있어도 됨? 😋', 
  'https://www.youtube.com/shorts/VIDEO_ID_10', 
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
-- 11~20번 추가
(
  '성수동 핫플 카페 도장깨기! 여기는 꼭 가야해', 
  'https://www.youtube.com/shorts/VIDEO_ID_11', 
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '올리브영 세일 추천템! 내돈내산 립 틴트 발색', 
  'https://www.youtube.com/shorts/VIDEO_ID_12', 
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '제주도 흑돼지 맛집! 육즙 팡팡 터짐 🍖', 
  'https://www.youtube.com/shorts/VIDEO_ID_13', 
  'https://images.unsplash.com/photo-1602115160868-b86ce65f9720?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '집들이 선물로 딱인 인테리어 조명 💡', 
  'https://www.youtube.com/shorts/VIDEO_ID_14', 
  'https://images.unsplash.com/photo-1513506003011-3b032f7396c5?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '운동할 때 입기 좋은 레깅스 추천! 핏 대박', 
  'https://www.youtube.com/shorts/VIDEO_ID_15', 
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '강릉 오션뷰 펜션 브이로그 🌊 힐링 그 자체', 
  'https://www.youtube.com/shorts/VIDEO_ID_16', 
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '아이패드 드로잉 입문! 종이질감 필름 후기 ✏️', 
  'https://www.youtube.com/shorts/VIDEO_ID_17', 
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '편의점 신상 간식 리뷰! 이건 꼭 먹어야해', 
  'https://www.youtube.com/shorts/VIDEO_ID_18', 
  'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '반려견이랑 호캉스 다녀옴 🐶 펫 프렌들리 호텔', 
  'https://www.youtube.com/shorts/VIDEO_ID_19', 
  'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
),
(
  '크리스마스 홈파티 요리 만들기 🎄 스테이크 굽는 법', 
  'https://www.youtube.com/shorts/VIDEO_ID_20', 
  'https://images.unsplash.com/photo-1543826173-70651703c5a4?w=800&q=80',
  (SELECT id FROM campaigns ORDER BY RANDOM() LIMIT 1)
);
