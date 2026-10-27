/**
 * 알고쇼핑(AlgoShopping) - 주요 소매 품목 30개 데이터베이스
 * 
 * 가격 기준 단위: 해당 상품 1개를 구매하는 표준 기준
 * 실제 판매 포장 단위와 다를 경우 unitDescription을 통해 표시
 */

import { GroceryItem, ItemCategory } from '../types';

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  all: '전체 품목 (30종)',
  grains_staple: '곡물·유제품·식자재',
  vegetables_fruit: '신선 채소·과일',
  meat_seafood: '정육·수산물',
  processed_pantry: '가공식품·양념·음료',
  household: '일상·생활용품'
};

export const GROCERY_ITEMS: GroceryItem[] = [
  {
    id: 1,
    name: '쌀',
    category: 'grains_staple',
    categoryLabel: '곡물·주식',
    unit: '1kg',
    unitDescription: '시중 10kg/20kg 포장 소분 환산 기준',
    basePrice: 3400,
    popular: true
  },
  {
    id: 2,
    name: '계란',
    category: 'grains_staple',
    categoryLabel: '신선 축산가공',
    unit: '10구',
    unitDescription: '대란 10구 팩 기준 (30구 판란 환산 가능)',
    basePrice: 3900,
    popular: true
  },
  {
    id: 3,
    name: '우유',
    category: 'grains_staple',
    categoryLabel: '유제품',
    unit: '1L',
    unitDescription: '일반 흰우유 1팩 (900mL~1L)',
    basePrice: 2950,
    popular: true
  },
  {
    id: 4,
    name: '라면',
    category: 'processed_pantry',
    categoryLabel: '가공식품',
    unit: '1봉',
    unitDescription: '기본 유탕면 1봉 (번들 5입 개당 단가 환산)',
    basePrice: 950,
    popular: true
  },
  {
    id: 5,
    name: '식용유',
    category: 'processed_pantry',
    categoryLabel: '조미·식용유지',
    unit: '900mL',
    unitDescription: '콩기름/카놀라유 900mL 1병',
    basePrice: 4800
  },
  {
    id: 6,
    name: '밀가루',
    category: 'processed_pantry',
    categoryLabel: '곡물 가공',
    unit: '1kg',
    unitDescription: '중력 다목적용 1kg',
    basePrice: 2200
  },
  {
    id: 7,
    name: '설탕',
    category: 'processed_pantry',
    categoryLabel: '조미·당류',
    unit: '1kg',
    unitDescription: '백설탕 1kg 봉지',
    basePrice: 2500
  },
  {
    id: 8,
    name: '두부',
    category: 'grains_staple',
    categoryLabel: '신선 가공',
    unit: '300g',
    unitDescription: '찌개·부침 겸용 포장두부 1모',
    basePrice: 1800,
    popular: true
  },
  {
    id: 9,
    name: '배추김치',
    category: 'grains_staple',
    categoryLabel: '절임·반찬류',
    unit: '1kg',
    unitDescription: '맛김치/포기김치 파우치 1kg',
    basePrice: 9500,
    popular: true
  },
  {
    id: 10,
    name: '생수 (2L)',
    category: 'processed_pantry',
    categoryLabel: '음료·생수',
    unit: '2L 1병',
    unitDescription: '가정용 먹는샘물 2L PET',
    basePrice: 1100,
    popular: true
  },
  {
    id: 11,
    name: '사과',
    category: 'vegetables_fruit',
    categoryLabel: '신선 과일',
    unit: '1kg',
    unitDescription: '부사/홍로 중과 약 3~4개',
    basePrice: 7800,
    popular: true
  },
  {
    id: 12,
    name: '바나나',
    category: 'vegetables_fruit',
    categoryLabel: '수입 과일',
    unit: '1송이',
    unitDescription: '중소형 바나나 1클러스터 (약 1~1.2kg)',
    basePrice: 4200
  },
  {
    id: 13,
    name: '감자',
    category: 'vegetables_fruit',
    categoryLabel: '신선 채소',
    unit: '1kg',
    unitDescription: '수미감자 중과 기준',
    basePrice: 3900
  },
  {
    id: 14,
    name: '양파',
    category: 'vegetables_fruit',
    categoryLabel: '신선 채소',
    unit: '1kg',
    unitDescription: '깐양파/망양파 중과 약 4~5개',
    basePrice: 3200,
    popular: true
  },
  {
    id: 15,
    name: '대파',
    category: 'vegetables_fruit',
    categoryLabel: '신선 채소',
    unit: '1단',
    unitDescription: '뿌리 대파 1묶음 (약 700g)',
    basePrice: 2800,
    popular: true
  },
  {
    id: 16,
    name: '당근',
    category: 'vegetables_fruit',
    categoryLabel: '신선 채소',
    unit: '1kg',
    unitDescription: '세척당근 약 3~4개',
    basePrice: 3600
  },
  {
    id: 17,
    name: '무',
    category: 'vegetables_fruit',
    categoryLabel: '신선 채소',
    unit: '1개',
    unitDescription: '국내산 다발무/가을무 1개 (약 1.5kg)',
    basePrice: 2400
  },
  {
    id: 18,
    name: '오이',
    category: 'vegetables_fruit',
    categoryLabel: '신선 채소',
    unit: '1개',
    unitDescription: '다다기오이/취청오이 1개',
    basePrice: 1200
  },
  {
    id: 19,
    name: '상추',
    category: 'vegetables_fruit',
    categoryLabel: '신선 채소',
    unit: '100g',
    unitDescription: '꽃상추/적상추 소포장 1봉',
    basePrice: 1500,
    popular: true
  },
  {
    id: 20,
    name: '토마토',
    category: 'vegetables_fruit',
    categoryLabel: '과채류',
    unit: '1kg',
    unitDescription: '완숙토마토 중과 약 4~5개',
    basePrice: 6800
  },
  {
    id: 21,
    name: '돼지고기 앞다리살',
    category: 'meat_seafood',
    categoryLabel: '신선 정육',
    unit: '100g',
    unitDescription: '수육/찌개용 냉장 앞다리살',
    basePrice: 1450,
    popular: true
  },
  {
    id: 22,
    name: '삼겹살',
    category: 'meat_seafood',
    categoryLabel: '신선 정육',
    unit: '100g',
    unitDescription: '국내산 구이용 삼겹살',
    basePrice: 2750,
    popular: true
  },
  {
    id: 23,
    name: '닭고기',
    category: 'meat_seafood',
    categoryLabel: '신선 정육',
    unit: '1kg',
    unitDescription: '볶음탕/백숙용 냉장 생닭 (10호~11호)',
    basePrice: 7200
  },
  {
    id: 24,
    name: '고등어',
    category: 'meat_seafood',
    categoryLabel: '수산물',
    unit: '1마리',
    unitDescription: '국산 자반/생물 고등어 중형 1손 반',
    basePrice: 3800
  },
  {
    id: 25,
    name: '참치캔',
    category: 'meat_seafood',
    categoryLabel: '수산 가공식품',
    unit: '150g 1캔',
    unitDescription: '살코기 참치 원터치캔',
    basePrice: 2600
  },
  {
    id: 26,
    name: '김',
    category: 'grains_staple',
    categoryLabel: '수산 반찬류',
    unit: '10봉 1묶음',
    unitDescription: '조미 도시락김 10봉 번들',
    basePrice: 4500
  },
  {
    id: 27,
    name: '생수 소용량',
    category: 'processed_pantry',
    categoryLabel: '음료·생수',
    unit: '500mL 1병',
    unitDescription: '휴대용 500mL PET',
    basePrice: 650
  },
  {
    id: 28,
    name: '커피믹스',
    category: 'processed_pantry',
    categoryLabel: '기호식품',
    unit: '20개 1상자',
    unitDescription: '인스턴트 스틱 커피 20T 소포장',
    basePrice: 5400
  },
  {
    id: 29,
    name: '화장지',
    category: 'household',
    categoryLabel: '생활위생용품',
    unit: '12롤 1팩',
    unitDescription: '3겹 롤화장지 12입 팩 (시중 30롤 소형 환산)',
    basePrice: 8900,
    popular: true
  },
  {
    id: 30,
    name: '세탁세제',
    category: 'household',
    categoryLabel: '생활세탁용품',
    unit: '1L',
    unitDescription: '일반/드럼 겸용 액체 세탁세제 리필',
    basePrice: 5900,
    popular: true
  }
];

// 빠른 추천 장바구니 꾸러미
export interface BasketPreset {
  id: string;
  title: string;
  description: string;
  badge: string;
  items: { itemId: number; quantity: number }[];
}

export const BASKET_PRESETS: BasketPreset[] = [
  {
    id: 'samgyeopsal_party',
    title: '삼겹살 & 김치찌개 저녁 세트',
    description: '삼겹살(300g), 김치, 두부, 대파, 양파, 쌈채소, 라면',
    badge: '추천 테마',
    items: [
      { itemId: 22, quantity: 3 }, // 삼겹살 300g
      { itemId: 9, quantity: 1 },  // 김치 1kg
      { itemId: 8, quantity: 2 },  // 두부 2모
      { itemId: 15, quantity: 1 }, // 대파 1단
      { itemId: 14, quantity: 1 }, // 양파 1kg
      { itemId: 19, quantity: 2 }, // 상추 200g
      { itemId: 4, quantity: 2 },  // 라면 2봉
      { itemId: 10, quantity: 1 }  // 생수 2L 1병
    ]
  },
  {
    id: 'single_household',
    title: '1인 가구 1주일 알뜰 장보기',
    description: '쌀, 계란, 우유, 라면, 김, 사과, 화장지, 생수',
    badge: '1인 가구',
    items: [
      { itemId: 1, quantity: 2 },  // 쌀 2kg
      { itemId: 2, quantity: 1 },  // 계란 10구
      { itemId: 3, quantity: 1 },  // 우유 1L
      { itemId: 4, quantity: 5 },  // 라면 5봉
      { itemId: 26, quantity: 1 }, // 김 10봉
      { itemId: 11, quantity: 1 }, // 사과 1kg
      { itemId: 10, quantity: 2 }, // 생수 2L 2병
      { itemId: 29, quantity: 1 }  // 화장지 1팩
    ]
  },
  {
    id: 'fresh_produce',
    title: '신선 채소·과일 비타민 장바구니',
    description: '사과, 바나나, 토마토, 감자, 양파, 오이, 당근',
    badge: '신선 농산물',
    items: [
      { itemId: 11, quantity: 1 },
      { itemId: 12, quantity: 1 },
      { itemId: 20, quantity: 1 },
      { itemId: 13, quantity: 1 },
      { itemId: 14, quantity: 1 },
      { itemId: 18, quantity: 3 },
      { itemId: 16, quantity: 1 }
    ]
  },
  {
    id: 'pantry_refill',
    title: '생필품 & 양념 대량 보충',
    description: '식용유, 설탕, 밀가루, 참치캔, 커피믹스, 세제, 화장지',
    badge: '공산품 보충',
    items: [
      { itemId: 5, quantity: 1 },
      { itemId: 7, quantity: 1 },
      { itemId: 6, quantity: 1 },
      { itemId: 25, quantity: 3 },
      { itemId: 28, quantity: 1 },
      { itemId: 30, quantity: 1 },
      { itemId: 29, quantity: 1 }
    ]
  }
];
