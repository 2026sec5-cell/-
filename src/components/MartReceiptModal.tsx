import React from 'react';
import { X, Receipt, CheckCircle2, AlertCircle, ShoppingBag, Car, Tag } from 'lucide-react';
import { MartAnalysisResult } from '../types';
import { formatKRW } from '../utils/calculator';

interface MartReceiptModalProps {
  result: MartAnalysisResult | null;
  onClose: () => void;
}

export const MartReceiptModal: React.FC<MartReceiptModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{result.mart.codeName} 가상 영수증</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  추천 #{result.rank}위
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {result.mart.subTitle} · 김천고 편도 {result.mart.approxDistanceKm}km (왕복 {result.roundTripDistanceKm}km)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Item Table */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          <div className="text-xs text-slate-500 mb-3 flex items-center justify-between">
            <span>선택 구매 품목 ({result.itemPrices.length}종)</span>
            <span className="text-[11px] text-slate-400">* 기준가 대비 할인/할증 반영 단가</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold pb-2">
                <th className="py-2">품목명</th>
                <th className="py-2 text-right">수량</th>
                <th className="py-2 text-right">단가 (원)</th>
                <th className="py-2 text-right">소계 (원)</th>
                <th className="py-2 text-right">기준가 대비</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.itemPrices.map((item) => {
                const isDiscounted = item.diffFromBase < 0;
                const isOver = item.diffFromBase > 0;

                return (
                  <tr key={item.itemId} className="hover:bg-slate-50/60">
                    <td className="py-2.5 font-medium text-slate-900">{item.itemName}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-600">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-800">{formatKRW(item.unitPrice)}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums font-semibold text-slate-900">{formatKRW(item.lineTotal)}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">
                      {isDiscounted ? (
                        <span className="text-emerald-600 font-semibold">
                          {formatKRW(item.diffFromBase)}
                        </span>
                      ) : isOver ? (
                        <span className="text-rose-600 font-medium">
                          +{formatKRW(item.diffFromBase)}
                        </span>
                      ) : (
                        <span className="text-slate-400">동일</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-5 md:p-6 bg-slate-50 border-t border-slate-200 space-y-3">
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-600">
                <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                장바구니 상품 금액 합계:
              </span>
              <span className="font-mono font-semibold text-slate-900 text-sm">
                {formatKRW(result.basketTotal)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Car className="w-3.5 h-3.5 text-slate-400" />
                김천고 왕복 이동 비용 ({result.roundTripDistanceKm}km):
              </span>
              <span className="font-mono text-slate-800">
                +{formatKRW(result.travelCost)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-900 text-sm">
                최종 예상 지출 총액 (상품 + 이동):
              </span>
              <span className="font-mono font-extrabold text-emerald-700 text-lg">
                {formatKRW(result.totalCost)}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              {result.isWithinBudget ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  예산 충족 (잔여: {formatKRW(result.budgetDelta)})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  예산 초과 (+{formatKRW(Math.abs(result.budgetDelta))})
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
