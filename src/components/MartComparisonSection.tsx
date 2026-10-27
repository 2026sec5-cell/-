import React from 'react';
import { 
  Trophy, 
  MapPin, 
  Receipt, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Compass, 
  ChevronDown
} from 'lucide-react';
import { MartAnalysisResult, AlgoSettings } from '../types';
import { formatKRW } from '../utils/calculator';

interface MartComparisonSectionProps {
  analysisResults: MartAnalysisResult[];
  settings: AlgoSettings;
  onSelectMartReceipt: (result: MartAnalysisResult) => void;
  onViewOnMap: (martId: string) => void;
  onNavigateToSettings: () => void;
}

export const MartComparisonSection: React.FC<MartComparisonSectionProps> = ({
  analysisResults,
  settings,
  onSelectMartReceipt,
  onViewOnMap,
  onNavigateToSettings
}) => {
  const topRecommended = analysisResults[0];

  if (!topRecommended) return null;

  return (
    <div className="space-y-6 pt-6 border-t border-slate-200" id="comparison-results-section">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide mb-1">
            <span>실시간 알고리즘 분석</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">
              가중치: 가격 {Math.round(settings.priceWeight * 100)}% / 거리 {Math.round(settings.distanceWeight * 100)}%
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            마트 5곳 추천 순위 및 종합 비용 비교
          </h2>
        </div>

        <button
          onClick={onNavigateToSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-600" />
          <span>추천 알고리즘 설정 변경</span>
        </button>
      </div>

      {/* #1 Best Mart Spotlight Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>알고쇼핑 1순위 최적 추천 마트</span>
            </div>

            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>{topRecommended.mart.codeName}</span>
                <span className="text-xs md:text-sm font-normal text-emerald-300 bg-emerald-900/50 px-2.5 py-0.5 rounded-lg border border-emerald-700/50">
                  {topRecommended.mart.subTitle}
                </span>
              </h3>
              <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
                {topRecommended.mart.description}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">선정 강점:</span>
              {topRecommended.isLowestTotalCost && (
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                  총비용(상품+이동비) 최저가
                </span>
              )}
              {topRecommended.isLowestPrice && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  장바구니 상품가 최저
                </span>
              )}
              {topRecommended.isClosest && (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                  김천고 최단거리 (접근성 1위)
                </span>
              )}
              <span className="text-slate-300">
                추천 점수: <strong className="font-mono text-emerald-400">{topRecommended.compositeScore.toFixed(3)}</strong>
              </span>
            </div>
          </div>

          {/* Financial Totals Block */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700/80 min-w-[280px] space-y-4 shrink-0">
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">예상 총 지출 비용 (장바구니 + 왕복 이동비)</span>
              <span className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
                {formatKRW(topRecommended.totalCost)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">장바구니 상품 합계:</span>
                <span className="font-mono font-semibold text-white">{formatKRW(topRecommended.basketTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">왕복 이동비용 ({topRecommended.roundTripDistanceKm}km):</span>
                <span className="font-mono text-slate-300">{formatKRW(topRecommended.travelCost)}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/60">
                <span className="text-slate-400">예산 대비:</span>
                {topRecommended.isWithinBudget ? (
                  <span className="text-emerald-400 font-semibold font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {formatKRW(topRecommended.budgetDelta)} 절약
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold font-mono flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    +{formatKRW(Math.abs(topRecommended.budgetDelta))} 초과
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onSelectMartReceipt(topRecommended)}
                className="flex-1 py-2 px-3 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-colors text-center cursor-pointer"
              >
                품목별 영수증
              </button>
              <button
                onClick={() => onViewOnMap(topRecommended.mart.id)}
                className="flex-1 py-2 px-3 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors text-center cursor-pointer"
              >
                지도 앱에서 보기
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Full 5-Mart Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              전체 마트 5곳 종합 비교 순위표
            </h3>
            <p className="text-xs text-slate-500">
              가중합 추천 점수 순위이며, 각 마트별 거리와 이동 비용이 반영되어 있습니다.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4 w-14 text-center">순위</th>
                <th className="py-3 px-4">마트 정보</th>
                <th className="py-3 px-4 text-right">편도 거리</th>
                <th className="py-3 px-4 text-right">장바구니 합계</th>
                <th className="py-3 px-4 text-right">왕복 이동비용</th>
                <th className="py-3 px-4 text-right">예상 총비용</th>
                <th className="py-3 px-4 text-center">예산 판정</th>
                <th className="py-3 px-4 text-center">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analysisResults.map((result) => {
                const isFirst = result.rank === 1;

                return (
                  <tr
                    key={result.mart.id}
                    className={`transition-colors ${
                      isFirst ? 'bg-emerald-50/30 font-medium' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs font-bold font-mono ${
                        result.rank === 1
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : result.rank === 2
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {result.rank}
                      </span>
                    </td>

                    {/* Mart Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-slate-900 text-base">{result.mart.codeName}</span>
                        <span className="text-xs text-slate-500">{result.mart.subTitle}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {result.isLowestPrice && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            장바구니 최저가
                          </span>
                        )}
                        {result.isLowestTotalCost && (
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            총비용 최저가
                          </span>
                        )}
                        {result.isClosest && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            최단거리
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Distance */}
                    <td className="py-4 px-4 text-right font-mono tabular-nums">
                      <span className="text-slate-900 font-semibold">{result.mart.approxDistanceKm} km</span>
                      <span className="block text-[11px] text-slate-400">왕복 {result.roundTripDistanceKm}km</span>
                    </td>

                    {/* Basket Sum */}
                    <td className="py-4 px-4 text-right font-mono tabular-nums">
                      <span className="text-slate-900 font-semibold">{formatKRW(result.basketTotal)}</span>
                    </td>

                    {/* Travel Cost */}
                    <td className="py-4 px-4 text-right font-mono tabular-nums text-slate-600">
                      <span>{formatKRW(result.travelCost)}</span>
                    </td>

                    {/* Total Cost */}
                    <td className="py-4 px-4 text-right font-mono tabular-nums">
                      <span className="text-base font-bold text-slate-900">
                        {formatKRW(result.totalCost)}
                      </span>
                    </td>

                    {/* Budget Delta */}
                    <td className="py-4 px-4 text-center">
                      {result.isWithinBudget ? (
                        <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>충족 (-{formatKRW(result.budgetDelta)})</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>초과 (+{formatKRW(Math.abs(result.budgetDelta))})</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectMartReceipt(result)}
                          title="품목별 영수증 확인"
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onViewOnMap(result.mart.id)}
                          title="지도 앱에서 위치 보기"
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
