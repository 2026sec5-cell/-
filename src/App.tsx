/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 알고쇼핑(AlgoShopping) - 스마트 장보기 최적화 알고리즘
 * 김천고등학교 기준 스마트 장보기 최적화 서비스
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { ItemList } from './components/ItemList';
import { SettingsDeck } from './components/SettingsDeck';
import { MartComparisonSection } from './components/MartComparisonSection';
import { LeafletMap } from './components/LeafletMap';
import { MartReceiptModal } from './components/MartReceiptModal';
import { GROCERY_ITEMS, BASKET_PRESETS, BasketPreset } from './data/items';
import { VIRTUAL_MARTS } from './data/marts';
import { CartItem, GroceryItem, AlgoSettings, MartAnalysisResult, AppTab } from './types';
import { analyzeAllMarts } from './utils/calculator';
import { School, ArrowRight } from 'lucide-react';

export default function App() {
  // 4개 탭: 'settings'(설정/예산), 'cart'(장바구니), 'results'(추천 결과), 'map'(마트 지도)
  // 사용자의 이전 요청대로 'cart'가 기본 탭으로 열림
  const [activeTab, setActiveTab] = useState<AppTab>('cart');
  
  // Default Settings: Price Weight 60%, Distance Weight 40% (as shown in reference screenshot), Budget 50,000 KRW, Cost per km 350 KRW
  const [settings, setSettings] = useState<AlgoSettings>({
    priceWeight: 0.6,
    distanceWeight: 0.4,
    budget: 50000,
    costPerKm: 350
  });

  // Initial cart: pre-load the 삼겹살 & 김치찌개 저녁 세트 so first-time users immediately see calculations
  const [cart, setCart] = useState<CartItem[]>(() => {
    const defaultPreset = BASKET_PRESETS[0];
    const initialItems: CartItem[] = [];
    defaultPreset.items.forEach(({ itemId, quantity }) => {
      const found = GROCERY_ITEMS.find((g) => g.id === itemId);
      if (found) {
        initialItems.push({ item: found, quantity });
      }
    });
    return initialItems;
  });

  // Selected Mart for map inspection & receipt
  const [selectedMartId, setSelectedMartId] = useState<string>('mart_a');
  const [receiptModalResult, setReceiptModalResult] = useState<MartAnalysisResult | null>(null);

  // Real-time analysis calculations across all 5 virtual marts
  const analysisResults = useMemo(() => {
    return analyzeAllMarts(VIRTUAL_MARTS, cart, settings);
  }, [cart, settings]);

  // Update item quantity in cart
  const handleUpdateQuantity = (item: GroceryItem, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((c) => c.item.id !== item.id);
      }
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) => (c.item.id === item.id ? { ...c, quantity } : c));
      }
      return [...prev, { item, quantity }];
    });
  };

  // Clear entire cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Select all 30 items (1 each)
  const handleSelectAll = () => {
    setCart(GROCERY_ITEMS.map((item) => ({ item, quantity: 1 })));
  };

  // Apply a theme preset
  const handleApplyPreset = (preset: BasketPreset) => {
    const newCart: CartItem[] = [];
    preset.items.forEach(({ itemId, quantity }) => {
      const found = GROCERY_ITEMS.find((g) => g.id === itemId);
      if (found) {
        newCart.push({ item: found, quantity });
      }
    });
    setCart(newCart);
  };

  // Reset all settings and reload default preset
  const handleReset = () => {
    setSettings({
      priceWeight: 0.6,
      distanceWeight: 0.4,
      budget: 50000,
      costPerKm: 350
    });
    const defaultPreset = BASKET_PRESETS[0];
    const resetCart: CartItem[] = [];
    defaultPreset.items.forEach(({ itemId, quantity }) => {
      const found = GROCERY_ITEMS.find((g) => g.id === itemId);
      if (found) {
        resetCart.push({ item: found, quantity });
      }
    });
    setCart(resetCart);
    setSelectedMartId('mart_a');
  };

  // Switch to map and focus on mart
  const handleViewOnMap = (martId: string) => {
    setSelectedMartId(martId);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col text-slate-800 pb-16">
      
      {/* Top Bar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.length}
        onReset={handleReset}
      />

      {/* Transparency & Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: 설정/예산 (Matches screenshot) */}
        {activeTab === 'settings' && (
          <SettingsDeck
            settings={settings}
            onUpdateSettings={setSettings}
            analysisResults={analysisResults}
            cartCount={cart.length}
            onNavigateToCart={() => setActiveTab('cart')}
            onNavigateToResults={() => setActiveTab('results')}
            onNavigateToMap={() => setActiveTab('map')}
          />
        )}

        {/* Tab 2: 장바구니 (기본 탭) */}
        {activeTab === 'cart' && (
          <ItemList
            items={GROCERY_ITEMS}
            cart={cart}
            analysisResults={analysisResults}
            settings={settings}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={handleClearCart}
            onSelectAll={handleSelectAll}
            onApplyPreset={handleApplyPreset}
            onSelectMartReceipt={(res) => setReceiptModalResult(res)}
            onViewOnMap={handleViewOnMap}
            onNavigateToSettings={() => setActiveTab('settings')}
            onNavigateToResults={() => setActiveTab('results')}
            onNavigateToMap={() => setActiveTab('map')}
          />
        )}

        {/* Tab 3: 추천 결과 */}
        {activeTab === 'results' && (
          <div className="space-y-6 max-w-4xl mx-auto pb-16">
            <MartComparisonSection
              analysisResults={analysisResults}
              settings={settings}
              onSelectMartReceipt={(res) => setReceiptModalResult(res)}
              onViewOnMap={handleViewOnMap}
              onNavigateToSettings={() => setActiveTab('settings')}
            />
          </div>
        )}

        {/* Tab 4: 마트 지도 */}
        {activeTab === 'map' && (
          <div className="pb-16">
            <LeafletMap
              analysisResults={analysisResults}
              selectedMartId={selectedMartId}
              onSelectMart={setSelectedMartId}
              onOpenReceipt={(res) => setReceiptModalResult(res)}
            />
          </div>
        )}
      </main>

      {/* Itemized Receipt Modal */}
      <MartReceiptModal
        result={receiptModalResult}
        onClose={() => setReceiptModalResult(null)}
      />

      {/* Bottom Navigation Bar (Matching user screenshot) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.length}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/90 bg-white py-6 text-xs text-slate-500 mb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">알고쇼핑 (AlgoShopping)</span>
            <span aria-hidden="true">·</span>
            <span>김천고등학교 기준 스마트 장보기 최적화 서비스</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>기준 위치: 경상북도 김천시 송설로 90</span>
            <span aria-hidden="true">·</span>
            <span>OpenStreetMap 기반</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
