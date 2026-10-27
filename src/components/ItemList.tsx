import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Trash2, 
  CheckSquare, 
  Sliders, 
  MapPin, 
  ChevronDown 
} from 'lucide-react';
import { CartItem, GroceryItem, ItemCategory, MartAnalysisResult, AlgoSettings } from '../types';
import { CATEGORY_LABELS, BASKET_PRESETS, BasketPreset } from '../data/items';
import { formatKRW } from '../utils/calculator';
import { MartComparisonSection } from './MartComparisonSection';

interface ItemListProps {
  items: GroceryItem[];
  cart: CartItem[];
  analysisResults: MartAnalysisResult[];
  settings: AlgoSettings;
  onUpdateQuantity: (item: GroceryItem, quantity: number) => void;
  onClearCart: () => void;
  onSelectAll: () => void;
  onApplyPreset: (preset: BasketPreset) => void;
  onSelectMartReceipt: (result: MartAnalysisResult) => void;
  onViewOnMap: (martId: string) => void;
  onNavigateToSettings: () => void;
  onNavigateToResults: () => void;
  onNavigateToMap: () => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  cart,
  analysisResults,
  settings,
  onUpdateQuantity,
  onClearCart,
  onSelectAll,
  onApplyPreset,
  onSelectMartReceipt,
  onViewOnMap,
  onNavigateToSettings,
  onNavigateToResults,
  onNavigateToMap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart quantity lookup map
  const cartQuantityMap = useMemo(() => {
    const map = new Map<number, number>();
    cart.forEach((c) => map.set(c.item.id, c.quantity));
    return map;
  }, [cart]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                            item.categoryLabel.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Total base price sum of selected items
  const totalBasePrice = useMemo(() => {
    return cart.reduce((sum, c) => sum + (c.item.basePrice * c.quantity), 0);
  }, [cart]);

  const totalQuantity = useMemo(() => {
    return cart.reduce((sum, c) => sum + c.quantity, 0);
  }, [cart]);

  const topRecommended = analysisResults[0];

  const categories: ItemCategory[] = [
    'all',
    'grains_staple',
    'vegetables_fruit',
    'meat_seafood',
    'processed_pantry',
    'household'
  ];

  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. Header Banner & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide mb-1">
              <span>장바구니 담기</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">표준 30개 생활소매품목</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              구매하려는 상품과 수량을 담아보세요
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              선택한 전체 구매 목록을 기준으로 김천고등학교와의 <span className="font-semibold text-slate-900">거리와 마트별 단가</span>를 종합 분석합니다.
            </p>
          </div>

          {/* Preset Buttons for Quick Demo */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              추천 세트:
            </span>
            {BASKET_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset)}
                className="px-2.5 py-1.5 text-xs font-medium bg-[#eef4ff] hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                title={preset.description}
              >
                {preset.title.split(' ')[0]} 세트
              </button>
            ))}
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="품목명 검색 (예: 삼겹살, 계란, 라면, 화장지...)"
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                지우기
              </button>
            )}
          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSelectAll}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>전체 1개씩 담기</span>
            </button>
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50/60 border border-rose-200 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>비우기</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredItems.map((item) => {
          const qty = cartQuantityMap.get(item.id) || 0;
          const isSelected = qty > 0;

          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-500/30 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-medium text-slate-400 block mb-0.5 truncate">
                      {item.categoryLabel}
                    </span>
                    <h3 className="font-semibold text-slate-900 text-base leading-tight truncate">
                      {item.name}
                    </h3>
                  </div>

                  <span className="text-xs font-semibold text-slate-700 bg-slate-100/90 px-2 py-0.5 rounded-md shrink-0 tabular-nums">
                    {item.unit}
                  </span>
                </div>

                {item.unitDescription && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {item.unitDescription}
                  </p>
                )}
              </div>

              {/* Base price & Quantity stepper */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">기준단가</span>
                  <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                    {formatKRW(item.basePrice)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {qty > 0 ? (
                    <div className="flex items-center gap-1 bg-white border border-emerald-400 rounded-xl p-0.5 shadow-xs">
                      <button
                        onClick={() => onUpdateQuantity(item, qty - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 active:scale-95 transition-transform cursor-pointer"
                        aria-label={`${item.name} 수량 감소`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={qty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          onUpdateQuantity(item, isNaN(val) ? 0 : Math.max(0, Math.min(99, val)));
                        }}
                        className="w-8 text-center text-xs font-bold text-slate-900 font-mono tabular-nums focus:outline-none"
                      />
                      <button
                        onClick={() => onUpdateQuantity(item, qty + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-100 text-emerald-800 active:scale-95 transition-transform cursor-pointer"
                        aria-label={`${item.name} 수량 증가`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onUpdateQuantity(item, 1)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-700 hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>담기</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 text-sm">검색어와 일치하는 품목이 없습니다.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-3 text-xs font-semibold text-emerald-800 underline cursor-pointer"
          >
            검색 필터 초기화
          </button>
        </div>
      )}

      {/* 3. Live Recommendation Results Section */}
      {cart.length > 0 && (
        <MartComparisonSection
          analysisResults={analysisResults}
          settings={settings}
          onSelectMartReceipt={onSelectMartReceipt}
          onViewOnMap={onViewOnMap}
          onNavigateToSettings={onNavigateToSettings}
        />
      )}

      {/* 4. Sticky Bottom Action Bar */}
      <div className="sticky bottom-16 z-30 bg-slate-950/90 backdrop-blur-md text-white rounded-2xl p-4 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>선택: <strong className="text-white font-mono">{cart.length}개</strong></span>
                <span aria-hidden="true">·</span>
                <span>수량: <strong className="text-white font-mono">{totalQuantity}개</strong></span>
                {topRecommended && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-semibold">1위: {topRecommended.mart.codeName}</span>
                  </>
                )}
              </div>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight flex items-baseline gap-2">
                <span>장바구니 합계:</span>
                <span className="text-emerald-400 font-mono tabular-nums">{formatKRW(totalBasePrice)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToResults}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              <span>추천 결과 전체 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
