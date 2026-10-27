import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { BASE_LOCATION } from '../data/marts';
import { MartAnalysisResult } from '../types';
import { formatKRW } from '../utils/calculator';
import { MapPin, Navigation, Receipt, Compass, Layers, School } from 'lucide-react';

interface LeafletMapProps {
  analysisResults: MartAnalysisResult[];
  selectedMartId: string | null;
  onSelectMart: (martId: string) => void;
  onOpenReceipt: (result: MartAnalysisResult) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  analysisResults,
  selectedMartId,
  onSelectMart,
  onOpenReceipt
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Active mart data
  const activeResult = analysisResults.find((r) => r.mart.id === selectedMartId) || analysisResults[0];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [BASE_LOCATION.lat, BASE_LOCATION.lng],
      zoom: 13,
      zoomControl: false
    });

    // Add standard OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;
    setMapLoaded(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Polylines whenever analysisResults or selectedMartId change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    // 1. Add School Marker (기준점: 김천고등학교)
    const schoolIcon = L.divIcon({
      className: 'custom-school-marker',
      html: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -100%);
          cursor: pointer;
        ">
          <div style="
            background: #0f172a;
            color: #38bdf8;
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            border: 1px solid #38bdf8;
            margin-bottom: 4px;
          ">
            🏫 김천고등학교 (기준점)
          </div>
          <div style="
            width: 22px;
            height: 22px;
            background: #0284c7;
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 0 3px #0284c7, 0 4px 8px rgba(0,0,0,0.3);
          "></div>
        </div>
      `,
      iconSize: [0, 0]
    });

    const schoolMarker = L.marker([BASE_LOCATION.lat, BASE_LOCATION.lng], { icon: schoolIcon }).addTo(map);
    schoolMarker.bindPopup(`
      <div style="padding: 6px; font-family: sans-serif;">
        <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #0f172a;">김천고등학교</h4>
        <p style="margin: 0; font-size: 12px; color: #475569;">알고쇼핑 왕복 이동거리 및 운임 산정의 기준점입니다.</p>
        <div style="margin-top: 6px; font-size: 11px; color: #0284c7; font-weight: 600;">경북 김천시 송설로 90</div>
      </div>
    `);

    // 2. Add Mart Markers (A~E)
    analysisResults.forEach((result) => {
      const isSelected = selectedMartId === result.mart.id;
      const isRank1 = result.rank === 1;

      const bgColor = isRank1 ? '#059669' : isSelected ? '#0284c7' : '#1e293b';
      const borderColor = isRank1 ? '#34d399' : isSelected ? '#38bdf8' : '#ffffff';

      const martIcon = L.divIcon({
        className: 'custom-mart-marker',
        html: `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -100%);
            cursor: pointer;
          ">
            <div style="
              background: ${bgColor};
              color: #ffffff;
              padding: 3px 7px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              border: 1px solid ${borderColor};
              margin-bottom: 3px;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span>${result.mart.codeName}</span>
              <span style="
                background: rgba(255,255,255,0.25);
                font-size: 10px;
                padding: 1px 4px;
                border-radius: 4px;
              ">#${result.rank}위</span>
            </div>
            <div style="
              width: ${isSelected ? '26px' : '22px'};
              height: ${isSelected ? '26px' : '22px'};
              background: ${bgColor};
              border: 3px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 0 2px ${borderColor}, 0 4px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 10px;
              font-weight: bold;
              transition: all 0.2s ease;
            ">
              ${result.mart.codeName.replace('마트', '')}
            </div>
          </div>
        `,
        iconSize: [0, 0]
      });

      const marker = L.marker([result.mart.lat, result.mart.lng], { icon: martIcon }).addTo(map);

      marker.on('click', () => {
        onSelectMart(result.mart.id);
      });

      marker.bindPopup(`
        <div style="padding: 4px; font-family: sans-serif; min-width: 180px;">
          <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 4px;">
            <strong style="font-size: 14px; color: #0f172a;">${result.mart.codeName}</strong>
            <span style="font-size: 11px; font-weight: bold; color: ${isRank1 ? '#059669' : '#0284c7'};">
              추천 ${result.rank}위
            </span>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${result.mart.subTitle}</div>
          <div style="font-size: 12px; margin-bottom: 2px;">
            편도 거리: <strong>${result.mart.approxDistanceKm} km</strong>
          </div>
          <div style="font-size: 12px; margin-bottom: 2px;">
            장바구니: <strong>${formatKRW(result.basketTotal)}</strong>
          </div>
          <div style="font-size: 12px; margin-bottom: 6px;">
            예상 총비용: <strong style="color: #0f172a;">${formatKRW(result.totalCost)}</strong>
          </div>
        </div>
      `);

      markersRef.current[result.mart.id] = marker;
    });

    // 3. Draw Connecting Polyline to Selected Mart
    if (activeResult) {
      const latlngs: [number, number][] = [
        [BASE_LOCATION.lat, BASE_LOCATION.lng],
        [activeResult.mart.lat, activeResult.mart.lng]
      ];

      polylineRef.current = L.polyline(latlngs, {
        color: '#059669',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 8'
      }).addTo(map);
    }

  }, [analysisResults, selectedMartId, mapLoaded, onSelectMart]);

  const handleCenterSchool = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([BASE_LOCATION.lat, BASE_LOCATION.lng], 13, { animate: true });
    }
  };

  const handleFitAllMarts = () => {
    if (mapInstanceRef.current && analysisResults.length > 0) {
      const bounds = L.latLngBounds([
        [BASE_LOCATION.lat, BASE_LOCATION.lng],
        ...analysisResults.map((r) => [r.mart.lat, r.mart.lng] as [number, number])
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide mb-1">
            <span>지도 앱 · 김천 공간 지도</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">OpenStreetMap 타일 기반</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            김천고등학교 기준 마트 분포도 및 이동 경로
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            지도의 마커를 클릭하면 해당 마트까지의 직선·도로 환산 거리와 상세 장바구니 합계를 비교할 수 있습니다.
          </p>
        </div>

        {/* Map Control Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCenterSchool}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <School className="w-3.5 h-3.5 text-blue-600" />
            <span>김천고 중심</span>
          </button>
          <button
            onClick={handleFitAllMarts}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>전체 한눈에 보기</span>
          </button>
        </div>
      </div>

      {/* 2. Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Map Canvas (2 Columns on Desktop) */}
        <div className="lg:col-span-2 relative bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm min-h-[460px] md:min-h-[540px]">
          <div ref={mapContainerRef} className="w-full h-full min-h-[460px] md:min-h-[540px] z-10" />

          {/* Map Overlay Badge */}
          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-xs pointer-events-none">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>선택 중: {activeResult.mart.codeName} ({activeResult.mart.approxDistanceKm}km)</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              녹색 점선: 김천고와의 연결선
            </div>
          </div>
        </div>

        {/* Right Inspection Drawer for the Selected Mart */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold text-white ${
                  activeResult.rank === 1 ? 'bg-emerald-600' : 'bg-slate-800'
                }`}>
                  #{activeResult.rank}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">
                  {activeResult.mart.codeName}
                </h3>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {activeResult.mart.subTitle}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {activeResult.mart.description}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-0.5">김천고 편도 거리</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {activeResult.mart.approxDistanceKm} km
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  왕복 {activeResult.roundTripDistanceKm} km
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-0.5">왕복 이동 비용</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {formatKRW(activeResult.travelCost)}
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  단가 적용 추정치
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-0.5">장바구니 상품가</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {formatKRW(activeResult.basketTotal)}
                </span>
              </div>

              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                <span className="text-[11px] text-emerald-800 block mb-0.5 font-medium">예상 총비용</span>
                <span className="text-base font-extrabold text-emerald-950 font-mono">
                  {formatKRW(activeResult.totalCost)}
                </span>
              </div>
            </div>

            {/* Mart Strengths */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                이 마트의 주요 특성
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {activeResult.mart.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onOpenReceipt(activeResult)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>{activeResult.mart.codeName} 품목별 상세 영수증 확인</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
