import React, { useState } from 'react';
import { Info, X, ChevronRight } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 text-amber-950 px-4 py-2.5 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-snug">
            <span className="font-semibold text-amber-900">가상 데이터 안내:</span>{' '}
            본 서비스는 마트별 가격과 거리를 종합 분석하는 장보기 최적화 시뮬레이션입니다. 마트명(A~E)과 가격은 가상 데이터(기준가 대비 ±20% 범위)이며, 거리는 김천고등학교 기준 도로 환산 근사치입니다.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setDismissed(true)}
            aria-label="닫기"
            className="text-amber-700 hover:text-amber-950 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
