import React from 'react';
import { SlidersHorizontal, ShoppingBasket, Sparkles, Map, RotateCcw } from 'lucide-react';
import { AppTab } from '../types';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  cartCount: number;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onReset
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold text-lg shadow-xs">
            알
          </div>
          <button 
            onClick={() => setActiveTab('cart')}
            className="text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors whitespace-nowrap">
                알고쇼핑
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 whitespace-nowrap">
                AlgoShopping
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 font-normal leading-none mt-0.5">
              김천고등학교 기준 합리적 소비 알고리즘
            </p>
          </button>
        </div>

        {/* Zone 2: Navigation Links (matching bottom nav tabs) */}
        <nav className="hidden sm:flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
          {/* Tab 1: 설정/예산 */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>설정/예산</span>
          </button>

          {/* Tab 2: 장바구니 */}
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'cart'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShoppingBasket className="w-4 h-4" />
            <span>장바구니</span>
            {cartCount > 0 && (
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                activeTab === 'cart' ? 'bg-white text-emerald-900' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Tab 3: 추천 결과 */}
          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'results'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>추천 결과</span>
          </button>

          {/* Tab 4: 마트 지도 */}
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'map'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>마트 지도</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReset}
            title="장바구니 및 설정 초기화"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>
        </div>

      </div>
    </header>
  );
};
