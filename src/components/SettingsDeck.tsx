import React from 'react';
import { 
  ArrowLeftRight, 
  PiggyBank, 
  Footprints, 
  RotateCcw, 
  Wallet, 
  Car, 
  Sigma, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AlgoSettings, MartAnalysisResult } from '../types';
import { formatKRW } from '../utils/calculator';

interface SettingsDeckProps {
  settings: AlgoSettings;
  onUpdateSettings: (settings: AlgoSettings) => void;
  analysisResults: MartAnalysisResult[];
  cartCount: number;
  onNavigateToCart: () => void;
  onNavigateToResults: () => void;
  onNavigateToMap: () => void;
}

export const SettingsDeck: React.FC<SettingsDeckProps> = ({
  settings,
  onUpdateSettings,
  analysisResults,
  cartCount,
  onNavigateToCart,
  onNavigateToResults,
  onNavigateToMap
}) => {
  const topRecommended = analysisResults[0];

  const pricePct = Math.round(settings.priceWeight * 100);
  const distancePct = Math.round(settings.distanceWeight * 100);

  const handlePriceWeightChange = (newPriceWeightPercent: number) => {
    const priceWeight = newPriceWeightPercent / 100;
    const distanceWeight = parseFloat((1 - priceWeight).toFixed(2));
    onUpdateSettings({
      ...settings,
      priceWeight,
      distanceWeight
    });
  };

  const handleSwapWeights = () => {
    onUpdateSettings({
      ...settings,
      priceWeight: settings.distanceWeight,
      distanceWeight: settings.priceWeight
    });
  };

  const handleBudgetChange = (newBudget: number) => {
    onUpdateSettings({
      ...settings,
      budget: Math.max(0, newBudget)
    });
  };

  const handleCostPerKmChange = (newCost: number) => {
    onUpdateSettings({
      ...settings,
      costPerKm: Math.max(0, newCost)
    });
  };

  const handleResetBudget = () => {
    onUpdateSettings({
      ...settings,
      budget: 50000
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      
      {/* CARD 1: 추천 가중치 설정 (Dual Distance vs Price Card) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Top Header: Distance (Left) ⇄ Price (Right) */}
        <div className="flex items-center justify-between">
          {/* Left: Distance (이동 소요시간) */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Footprints className="w-5 h-5 text-slate-700" />
              <span>거리 (이동 소요시간)</span>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
              {distancePct}%
            </div>
          </div>

          {/* Center: Swap Button */}
          <button
            onClick={handleSwapWeights}
            title="거리와 가격 가중치 맞바꾸기"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* Right: Price (비용 극대화) */}
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-2 text-emerald-800 font-bold text-sm">
              <PiggyBank className="w-5 h-5 text-emerald-700" />
              <span>가격 (비용 극대화)</span>
            </div>
            <div className="text-4xl font-extrabold text-emerald-700 font-mono tracking-tight">
              {pricePct}%
            </div>
          </div>
        </div>

        {/* Dual Split Progress Bar */}
        <div className="space-y-2 pt-1">
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 shadow-inner">
            <div 
              style={{ width: `${distancePct}%` }}
              className="h-full bg-[#a5b4fc] transition-all duration-200"
            />
            <div 
              style={{ width: `${pricePct}%` }}
              className="h-full bg-emerald-700 transition-all duration-200"
            />
          </div>

          {/* Interactive Range Input */}
          <input
            id="price-weight-slider-input"
            aria-label="가격과 거리 가중치 조절 슬라이더"
            type="range"
            min="0"
            max="100"
            step="5"
            value={pricePct}
            onChange={(e) => handlePriceWeightChange(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          {/* Tick Labels */}
          <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
            <span>가까운 거리 위주 (9:1)</span>
            <span>균형 (5:5)</span>
            <span>최저가 위주 (1:9)</span>
          </div>
        </div>

        {/* Preset Buttons Grid (3 buttons strictly matching image) */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <button
            onClick={() => handlePriceWeightChange(70)}
            className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center ${
              pricePct === 70
                ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-600 font-bold shadow-xs'
                : 'bg-[#eef4ff] text-slate-800 hover:bg-[#e0ecff] border border-transparent'
            }`}
          >
            가성비 우선 (3:7)
          </button>

          <button
            onClick={() => handlePriceWeightChange(50)}
            className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center ${
              pricePct === 50
                ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-600 font-bold shadow-xs'
                : 'bg-[#eef4ff] text-slate-800 hover:bg-[#e0ecff] border border-transparent'
            }`}
          >
            균형 추천 (5:5)
          </button>

          <button
            onClick={() => handlePriceWeightChange(30)}
            className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center ${
              pricePct === 30
                ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-600 font-bold shadow-xs'
                : 'bg-[#eef4ff] text-slate-800 hover:bg-[#e0ecff] border border-transparent'
            }`}
          >
            가까운 거리 (7:3)
          </button>
        </div>

        {/* Formula Callout Box (Strictly matching image) */}
        <div className="bg-[#f0f6ff]/80 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0 mt-0.5">
            ∑
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">
              비용 목적 함수 수식 안내
            </h4>
            <div className="font-mono text-xs text-slate-700 tracking-tight">
              Score = (w_p × 총절약금액) - (w_d × 거리페널티 × 이동소비환산액)
            </div>
          </div>
        </div>

      </div>

      {/* CARD 2: 사전 예산 지출 한도 (Strictly matching screenshot) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              사전 예산 지출 한도
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            실시간 최적화
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">
              목표 쇼핑 예산
            </span>
            <button
              onClick={handleResetBudget}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-extrabold text-slate-900 font-mono tracking-tight">
              {settings.budget.toLocaleString('ko-KR')}
            </span>
            <span className="text-2xl font-bold text-slate-800">원</span>
          </div>

          {/* Quick budget chip buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400 mr-1">빠른 설정:</span>
            {[30000, 50000, 70000, 100000].map((val) => (
              <button
                key={val}
                onClick={() => handleBudgetChange(val)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  settings.budget === val
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {(val / 10000)}만원
              </button>
            ))}
          </div>

          <div className="pt-1">
            <input
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={settings.budget}
              onChange={(e) => handleBudgetChange(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* CARD 3: 이동 수단 및 유류비 환산 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              이동 수단 및 유류비 환산
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            김천고 기준 왕복
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-slate-500">
              km당 이동 비용 단가
            </span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {settings.costPerKm} <span className="text-base font-normal text-slate-600">원/km</span>
            </span>
          </div>

          {/* Quick Vehicle selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleCostPerKmChange(0)}
              className={`py-2 px-2 text-xs rounded-xl border text-center transition-colors cursor-pointer ${
                settings.costPerKm === 0
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-500 font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              도보·자전거 (0원)
            </button>
            <button
              onClick={() => handleCostPerKmChange(120)}
              className={`py-2 px-2 text-xs rounded-xl border text-center transition-colors cursor-pointer ${
                settings.costPerKm === 120
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-500 font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              대중교통 (120원)
            </button>
            <button
              onClick={() => handleCostPerKmChange(350)}
              className={`py-2 px-2 text-xs rounded-xl border text-center transition-colors cursor-pointer ${
                settings.costPerKm === 350
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-500 font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              승용차 유류비 (350원)
            </button>
          </div>
        </div>
      </div>

      {/* CARD 4: Live Status & Fast Action */}
      {topRecommended && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>현재 설정 기준 최우선 추천</span>
            </div>
            <div className="text-lg font-bold">
              {topRecommended.mart.codeName} ({topRecommended.mart.subTitle})
            </div>
            <p className="text-xs text-slate-400">
              예상 총비용 {formatKRW(topRecommended.totalCost)} (거리 {topRecommended.mart.approxDistanceKm}km)
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNavigateToResults}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              추천 결과 보기
            </button>
            <button
              onClick={onNavigateToCart}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl transition-colors cursor-pointer"
            >
              장바구니
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
