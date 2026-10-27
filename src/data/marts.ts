/**
 * 알고쇼핑(AlgoShopping) - 기준 위치 및 가상 마트 데이터
 * 
 * 기준 위치: 김천고등학교 (경상북도 김천시 송설로 90)
 * 가상 마트: A마트, B마트, C마트, D마트, E마트 (김천 실제 도심 상권 분포 모티브)
 * 
 * *주의*: 시제품용 가상 마트 데이터이며, 실제 매장 가격이나 정밀 측위 좌표가 아닌
 * 경제적 의사결정 시뮬레이션을 위한 데이터입니다.
 */

import { MartLocation } from '../types';

export const BASE_LOCATION = {
  name: '김천고등학교',
  subName: '기준점 (출발지 및 도착지)',
  address: '경상북도 김천시 송설로 90 (송설학원)',
  lat: 36.1265,
  lng: 128.0965,
  description: '알고쇼핑 거리 및 왕복 이동비용 계산의 출발점입니다.'
};

export const VIRTUAL_MARTS: MartLocation[] = [
  {
    id: 'mart_a',
    codeName: 'A마트',
    subTitle: '신음동 대형할인마트형',
    description: '신음동 상업지구 대형마트형 매장. 대량 매입 유통망으로 가공식품과 공산품 단가가 저렴하지만 거리가 4.3km로 다소 멉니다.',
    lat: 36.1412,
    lng: 128.1325,
    approxDistanceKm: 4.3,
    isHighwayApproximation: true,
    strengths: ['가공식품·양념 14% 저렴', '생활용품 대량할인', '다양한 PB상품'],
    priceMultiplierByCategory: {
      all: 1.0,
      grains_staple: 0.95,
      vegetables_fruit: 1.02,
      meat_seafood: 0.96,
      processed_pantry: 0.86,
      household: 0.85
    },
    // 특정 품목별 고유 할인/할증률 미세 조정 (80% ~ 120% 범위 유지)
    itemSpecificMultipliers: {
      4: 0.82,  // 라면 대량번들 특가 (18% 할인)
      10: 0.80, // 생수 2L PB 초저가 (20% 할인)
      28: 0.83, // 커피믹스 대량할인
      29: 0.82, // 화장지 특가
      30: 0.84  // 세탁세제 특가
    }
  },
  {
    id: 'mart_b',
    codeName: 'B마트',
    subTitle: '평화동 식자재할인마트형',
    description: '평화동 원도심 인근 대형 식자재 마트. 농수산물 산지 직송과 대량 유통으로 신선 채소 및 육류 가격이 매우 저렴합니다.',
    lat: 36.1218,
    lng: 128.1172,
    approxDistanceKm: 2.5,
    isHighwayApproximation: true,
    strengths: ['신선 채소·과일 18% 저렴', '정육·수산물 특가', '원도심 식자재 상권'],
    priceMultiplierByCategory: {
      all: 1.0,
      grains_staple: 0.94,
      vegetables_fruit: 0.82,
      meat_seafood: 0.88,
      processed_pantry: 1.04,
      household: 1.02
    },
    itemSpecificMultipliers: {
      11: 0.82, // 사과 산지직송
      14: 0.80, // 양파 1kg 특가
      15: 0.78, // 대파 1단 초특가
      21: 0.85, // 돼지 앞다리살
      22: 0.87  // 삼겹살 100g
    }
  },
  {
    id: 'mart_c',
    codeName: 'C마트',
    subTitle: '교동·부곡동 근린슈퍼마켓형',
    description: '김천고등학교 바로 인근 주거지에 위치한 중소형 동네 마트. 도보나 자전거로도 닿을 수 있을 정도로 가장 가깝지만(0.8km), 단가는 상대적으로 높습니다.',
    lat: 36.1298,
    lng: 128.1035,
    approxDistanceKm: 0.8,
    isHighwayApproximation: false,
    strengths: ['학교에서 가장 가까움(0.8km)', '이동비용 최저(왕복 560원)', '소량 장보기 최고 효율'],
    priceMultiplierByCategory: {
      all: 1.0,
      grains_staple: 1.06,
      vegetables_fruit: 1.08,
      meat_seafood: 1.10,
      processed_pantry: 1.08,
      household: 1.09
    },
    itemSpecificMultipliers: {
      3: 1.04,  // 우유
      4: 1.06,  // 라면
      18: 1.05  // 오이
    }
  },
  {
    id: 'mart_d',
    codeName: 'D마트',
    subTitle: '율곡동 혁신도시 창고형마트',
    description: 'KTX 김천구미역 인근 신도시 대형 창고형 복합마트. 생필품 번들과 수입 공산품 단가가 매우 우수하지만, 편도 거리가 7.9km로 가장 멉니다.',
    lat: 36.1120,
    lng: 128.1740,
    approxDistanceKm: 7.9,
    isHighwayApproximation: true,
    strengths: ['대용량 생필품·세제 최저가', '규격 통일 상품', '대형 주차 시설'],
    priceMultiplierByCategory: {
      all: 1.0,
      grains_staple: 0.88,
      vegetables_fruit: 0.94,
      meat_seafood: 0.91,
      processed_pantry: 0.87,
      household: 0.82
    },
    itemSpecificMultipliers: {
      1: 0.85,  // 쌀 1kg 대량환산가
      23: 0.86, // 닭고기 1kg
      29: 0.80, // 화장지 1팩 (20% 할인)
      30: 0.81  // 세탁세제 1L (19% 할인)
    }
  },
  {
    id: 'mart_e',
    codeName: 'E마트',
    subTitle: '김천역 상권 로컬푸드마트',
    description: '김천역 상권 중심의 지역 밀착형 로컬푸드 마트. 거리 1.9km로 적절한 접근성을 가지며, 지역 쌀·두부·계란 등 로컬 식자재 가격 경쟁력이 뛰어납니다.',
    lat: 36.1248,
    lng: 128.1105,
    approxDistanceKm: 1.9,
    isHighwayApproximation: true,
    strengths: ['지역 쌀·두부·계란 로컬가', '거리와 가격의 균형점', '역세권 상권 위치'],
    priceMultiplierByCategory: {
      all: 1.0,
      grains_staple: 0.88,
      vegetables_fruit: 0.95,
      meat_seafood: 1.01,
      processed_pantry: 0.97,
      household: 0.98
    },
    itemSpecificMultipliers: {
      1: 0.86,  // 쌀
      2: 0.88,  // 계란
      8: 0.84,  // 두부 로컬직송
      9: 0.88,  // 배추김치
      26: 0.90  // 김
    }
  }
];
