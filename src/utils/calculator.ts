/**
 * 알고쇼핑(AlgoShopping) - 핵심 최적화 및 경제 분석 계산 모듈
 * 
 * 1) 장바구니 상품 가격 계산 (단가 x 수량)
 * 2) 왕복 이동 비용 계산 (편도 거리 x 2 x km당 단가)
 * 3) 다목적 정규화 가중합 점수화 (가격 가중치 vs 거리 가중치)
 * 4) 예산 대비 과부족 분석
 * 5) 한계 편익 vs 한계 비용 손익분기점 산출
 */

import { CartItem, GroceryItem, MartAnalysisResult, MartLocation, AlgoSettings } from '../types';

/**
 * 특정 마트의 품목별 판매 가격 계산 (10원 단위 반올림, 기준가의 80%~120% 범위 보장)
 */
export function getMartItemPrice(mart: MartLocation, item: GroceryItem): number {
  const categoryMult = mart.priceMultiplierByCategory[item.category] ?? 1.0;
  const specificMult = mart.itemSpecificMultipliers?.[item.id];
  const finalMult = specificMult !== undefined ? specificMult : categoryMult;

  // 0.80 ~ 1.20 범위 강제 클램프 (요구사항 6번 준수)
  const clampedMult = Math.min(1.20, Math.max(0.80, finalMult));
  const rawPrice = item.basePrice * clampedMult;

  // 대한민국 원화 소매 기준 10원 단위 반올림
  return Math.round(rawPrice / 10) * 10;
}

/**
 * 장바구니에 담긴 품목들의 마트별 총합 및 상세 내역 계산
 */
export function analyzeAllMarts(
  marts: MartLocation[],
  cart: CartItem[],
  settings: AlgoSettings
): MartAnalysisResult[] {
  // 장바구니가 비어있는 경우 기본 0 처리
  const hasItems = cart.length > 0;

  // 1차 기초 지표 계산
  const preliminary = marts.map((mart) => {
    let basketTotal = 0;
    const itemPrices = cart.map((ci) => {
      const unitPrice = getMartItemPrice(mart, ci.item);
      const lineTotal = unitPrice * ci.quantity;
      basketTotal += lineTotal;
      return {
        itemId: ci.item.id,
        itemName: ci.item.name,
        unitPrice,
        quantity: ci.quantity,
        lineTotal,
        diffFromBase: unitPrice - ci.item.basePrice
      };
    });

    const roundTripDistanceKm = parseFloat((mart.approxDistanceKm * 2).toFixed(1));
    const travelCost = Math.round(roundTripDistanceKm * settings.costPerKm);
    const totalCost = basketTotal + travelCost;
    const budgetDelta = settings.budget - totalCost;
    const isWithinBudget = totalCost <= settings.budget;

    return {
      mart,
      basketTotal,
      roundTripDistanceKm,
      travelCost,
      totalCost,
      budgetDelta,
      isWithinBudget,
      itemPrices,
      normPrice: 0,
      normDistance: 0,
      compositeScore: 0,
      rank: 1,
      isLowestPrice: false,
      isLowestTotalCost: false,
      isClosest: false
    };
  });

  // 최소/최대값 탐색 for 정규화
  const basketTotals = preliminary.map((p) => p.basketTotal);
  const distances = preliminary.map((p) => p.mart.approxDistanceKm);
  const totalCosts = preliminary.map((p) => p.totalCost);

  const minBasket = Math.min(...basketTotals);
  const maxBasket = Math.max(...basketTotals);
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);
  const minTotalCost = Math.min(...totalCosts);

  // 2차 정규화 및 가중치 반영 점수 계산
  const basketRange = maxBasket - minBasket;
  const distanceRange = maxDistance - minDistance;

  const scored = preliminary.map((item) => {
    // 0~1 정규화 (최솟값이 0, 최댓값이 1)
    const normPrice = hasItems && basketRange > 0
      ? (item.basketTotal - minBasket) / basketRange
      : 0;

    const normDistance = distanceRange > 0
      ? (item.mart.approxDistanceKm - minDistance) / distanceRange
      : 0;

    // 종합 추천 점수 = (가격정규화 * 가격가중치) + (거리정규화 * 거리가중치)
    // 점수는 낮을수록(비용이 적고 거리가 가까울수록) 우수
    const compositeScore = (normPrice * settings.priceWeight) + (normDistance * settings.distanceWeight);

    return {
      ...item,
      normPrice: parseFloat(normPrice.toFixed(4)),
      normDistance: parseFloat(normDistance.toFixed(4)),
      compositeScore: parseFloat(compositeScore.toFixed(4)),
      isLowestPrice: hasItems && item.basketTotal === minBasket,
      isLowestTotalCost: item.totalCost === minTotalCost,
      isClosest: item.mart.approxDistanceKm === minDistance
    };
  });

  // 추천 점수 오름차순 정렬 (동점 시 총비용 우선)
  scored.sort((a, b) => {
    if (Math.abs(a.compositeScore - b.compositeScore) > 0.0001) {
      return a.compositeScore - b.compositeScore;
    }
    return a.totalCost - b.totalCost;
  });

  // 랭킹 부여 (1~N위)
  return scored.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

/**
 * 경제성 분석: 손익분기점 및 한계 비용 분석
 */
export interface EconomicInsightSummary {
  closestMartName: string;
  closestMartDistance: number;
  cheapestBasketMartName: string;
  cheapestBasketSavings: number; // 근접 마트 대비 장바구니 절약액
  extraTravelCost: number;       // 근접 마트 대비 추가 이동비용
  netEconomicBenefit: number;    // 순 경제적 효용 (절약액 - 추가이동비)
  isTripEconomicallyRational: boolean; // 원거리 이동이 경제적으로 합리적인가?
  marginalBenefitPerKm: number;  // 1km 추가 이동당 절약 편익
}

export function generateEconomicInsight(
  results: MartAnalysisResult[]
): EconomicInsightSummary | null {
  if (results.length === 0) return null;

  const closest = results.find((r) => r.isClosest) || results[0];
  const cheapestBasket = [...results].sort((a, b) => a.basketTotal - b.basketTotal)[0];

  if (!cheapestBasket || !closest) return null;

  const basketSavings = closest.basketTotal - cheapestBasket.basketTotal;
  const extraTravelCost = cheapestBasket.travelCost - closest.travelCost;
  const netBenefit = basketSavings - extraTravelCost;
  const distanceDelta = cheapestBasket.mart.approxDistanceKm - closest.mart.approxDistanceKm;

  const marginalBenefitPerKm = distanceDelta > 0
    ? Math.round(basketSavings / distanceDelta)
    : 0;

  return {
    closestMartName: closest.mart.codeName,
    closestMartDistance: closest.mart.approxDistanceKm,
    cheapestBasketMartName: cheapestBasket.mart.codeName,
    cheapestBasketSavings: basketSavings,
    extraTravelCost: extraTravelCost,
    netEconomicBenefit: netBenefit,
    isTripEconomicallyRational: netBenefit > 0,
    marginalBenefitPerKm
  };
}

/**
 * 원화 포맷 헬퍼 함수
 */
export function formatKRW(val: number): string {
  return val.toLocaleString('ko-KR') + '원';
}
