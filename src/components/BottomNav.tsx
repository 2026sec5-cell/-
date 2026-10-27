import React from 'react';
import { SlidersHorizontal, ShoppingBasket, Sparkles, Map } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg">
      <div className="max-w-md md:max-w-lg mx-auto grid grid-cols-4 py-2 px-2">
        
        {/* 1. 설정/예산 */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <SlidersHorizontal className={`w-5 h-5 mb-1 ${activeTab === 'settings' ? 'text-emerald-700' : 'text-slate-500'}`} />
          <span className="text-[11px] leading-tight">설정/예산</span>
          {activeTab === 'settings' && (
            <span className="w-4 h-0.5 bg-emerald-700 rounded-full mt-0.5"></span>
          )}
        </button>

        {/* 2. 장바구니 */}
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex flex-col items-center justify-center py-1 relative transition-colors cursor-pointer ${
            activeTab === 'cart'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingBasket className={`w-5 h-5 mb-1 ${activeTab === 'cart' ? 'text-emerald-700' : 'text-slate-500'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-emerald-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] leading-tight">장바구니</span>
          {activeTab === 'cart' && (
            <span className="w-4 h-0.5 bg-emerald-700 rounded-full mt-0.5"></span>
          )}
        </button>

        {/* 3. 추천 결과 */}
        <button
          onClick={() => setActiveTab('results')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'results'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Sparkles className={`w-5 h-5 mb-1 ${activeTab === 'results' ? 'text-emerald-700' : 'text-slate-500'}`} />
          <span className="text-[11px] leading-tight">추천 결과</span>
          {activeTab === 'results' && (
            <span className="w-4 h-0.5 bg-emerald-700 rounded-full mt-0.5"></span>
          )}
        </button>

        {/* 4. 마트 지도 */}
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'map'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Map className={`w-5 h-5 mb-1 ${activeTab === 'map' ? 'text-emerald-700' : 'text-slate-500'}`} />
          <span className="text-[11px] leading-tight">마트 지도</span>
          {activeTab === 'map' && (
            <span className="w-4 h-0.5 bg-emerald-700 rounded-full mt-0.5"></span>
          )}
        </button>

      </div>
    </nav>
  );
};
