/**
 * 알고쇼핑(AlgoShopping) - 타입 정의
 * 김천고등학교 기준 스마트 장보기 최적화
 */

export type AppTab = 'settings' | 'cart' | 'results' | 'map';

export type ItemCategory =
  | 'all'
  | 'grains_staple'   // 곡물/주식
  | 'vegetables_fruit' // 채소/과일
  | 'meat_seafood'     // 정육/수산
  | 'processed_pantry' // 가공식품/양념/음료
  | 'household';       // 일상/생활용품

export interface GroceryItem {
  id: number;
  name: string;
  category: ItemCategory;
  categoryLabel: string;
  unit: string;
  unitDescription?: string; // 실제 포장 규격 안내
  basePrice: number;        // 기준가격 (원)
  popular?: boolean;
}

export interface CartItem {
  item: GroceryItem;
  quantity: number;
}

export interface MartLocation {
  id: string;
  codeName: string;         // 'A마트', 'B마트' 등
  subTitle: string;         // '신음동 대형할인마트형'
  description: string;
  lat: number;
  lng: number;
  approxDistanceKm: number; // 김천고등학교로부터의 편도 근사 거리 (km)
  isHighwayApproximation?: boolean;
  strengths: string[];      // 강점 (예: 가공식품 대량할인, 신선채소 직송 등)
  priceMultiplierByCategory: Record<ItemCategory, number>;
  itemSpecificMultipliers?: Record<number, number>;
}

export interface MartAnalysisResult {
  mart: MartLocation;
  basketTotal: number;          // 장바구니 상품 합계 (원)
  roundTripDistanceKm: number;  // 왕복 거리 (km)
  travelCost: number;           // 왕복 예상 이동 비용 (원)
  totalCost: number;            // 장바구니 + 이동 비용 총합 (원)
  normPrice: number;            // 0 ~ 1 정규화된 가격 지수
  normDistance: number;         // 0 ~ 1 정규화된 거리 지수
  compositeScore: number;       // 사용자 가중치 반영 추천 점수 (낮을수록 우수)
  rank: number;                 // 최종 추천 순위 (1~5위)
  isLowestPrice: boolean;       // 순수 장바구니 최저가 여부
  isLowestTotalCost: boolean;   // 총비용(이동비 포함) 최저가 여부
  isClosest: boolean;           // 최단 거리 여부
  budgetDelta: number;          // 예산 - 총비용 (양수: 절약/충족, 음수: 초과)
  isWithinBudget: boolean;      // 예산 이내 여부
  itemPrices: {
    itemId: number;
    itemName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    diffFromBase: number;
  }[];
}

export interface AlgoSettings {
  priceWeight: number;      // 0 ~ 1 (기본 0.7)
  distanceWeight: number;   // 1 - priceWeight
  budget: number;           // 사용자 장보기 예산 (원)
  costPerKm: number;        // km당 이동 비용 (기본 350원/km, 연료비+감가상각 추정)
}
