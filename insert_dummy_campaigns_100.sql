-- 100개의 더미 캠페인 데이터 생성 SQL
-- Supabase SQL Editor에서 이 쿼리를 실행하면 100개의 캠페인이 추가됩니다.

INSERT INTO campaigns (
  brand, 
  title, 
  description, 
  thumbnail_url, 
  benefit, 
  channel, 
  type, 
  start_date, 
  end_date, 
  recruit_count, 
  status,
  is_face_required,
  is_original_required,
  hashtags,
  location
)
SELECT
  -- 1. 브랜드명 (랜덤)
  (ARRAY['나이키', '스타벅스', '올리브영', '다이소', '쿠팡', '배달의민족', '무신사', '토스', '카카오', '네이버', '삼성전자', 'LG생활건강'])[floor(random()*12)+1] || ' (Dummy ' || i || ')',
  
  -- 2. 제목 (랜덤 조합)
  (ARRAY[
    '신상 출시 기념 체험단 모집', 
    '여름맞이 특별 리뷰 이벤트', 
    '선착순 100명 한정! 얼리버드 모집', 
    '블로거/인스타그래머 필수 참여 챌린지', 
    '프리미엄 라인 런칭 기념 체험단', 
    '당신의 일상을 바꿔줄 아이템', 
    '맛집 탐방하고 식사권 받자!'
  ])[floor(random()*7)+1] || ' - ' || i || '기',
  
  -- 3. 설명
  '이 캠페인은 테스트용 더미 데이터입니다. 번호: ' || i || '번. 편안하게 테스트하세요. 실제 캠페인이 아닙니다.',
  
  -- 4. 썸네일 (Unsplash 고퀄리티 이미지 15종 순환)
  (ARRAY[
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', -- food (burger)
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', -- fashion (shopping)
    'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=800&q=80', -- beauty (cream)
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', -- salad
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80', -- travel (italy)
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80', -- makeup
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', -- tech (headphone)
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', -- watch
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80', -- camera
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', -- shoes
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', -- red shoes
    'https://images.unsplash.com/photo-1503602642458-2321114458ce?w=800&q=80', -- minimal plant
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80', -- blue shoes
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80', -- steak
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80'  -- coffee
  ])[(i % 15) + 1],

  -- 5. 혜택
  (ARRAY['10만원 상당 제품 제공', '5만원 백화점 상품권', '프리미엄 세트 증정', '2인 식사권 제공', '네이버 페이 3만 포인트'])[floor(random()*5)+1],

  -- 6. 채널
  (ARRAY['INSTAGRAM', 'SHORTS', 'BLOG'])[floor(random()*3)+1],

  -- 7. 타입 (배송/방문)
  CASE WHEN (random() > 0.5) THEN 'visit' ELSE 'delivery' END,

  -- 8. 시작일 (최근 1~10일 전)
  NOW() - (floor(random() * 10) || ' days')::interval,

  -- 9. 종료일 (오늘부터 1~50일 후)
  NOW() + (floor(random() * 50 + 1) || ' days')::interval,

  -- 10. 모집 인원
  floor(random() * 50) + 5,

  -- 11. 상태 (대부분 Open)
  'open',

  -- 12. 얼굴 노출 필수 여부
  (random() > 0.5),

  -- 13. 원본 필수 여부
  (random() > 0.5),

  -- 14. 해시태그
  '#체험단 #이벤트 #후기 #' || i || '번캠페인 #좋아요',

  -- 15. 위치 (방문형일 때만 랜덤 서울 주소)
  CASE 
    WHEN (random() > 0.5) THEN (ARRAY['서울 강남구 테헤란로 123', '서울 마포구 양화로 45', '서울 성동구 성수이로 78', '경기 성남시 분당구 판교역로 99'])[floor(random()*4)+1] 
    ELSE NULL 
  END

FROM generate_series(1, 100) AS i;
