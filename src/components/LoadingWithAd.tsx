// ============================================
// 이미지 생성 중 로딩 + 광고 공간
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { detectLocale, t } from '@/i18n';
import type { Locale } from '@/i18n';

interface LoadingWithAdProps {
  startTime: number;
}

export default function LoadingWithAd({ startTime }: LoadingWithAdProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const [elapsed, setElapsed] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  // 경과 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // 팁 로테이션
  const tips = locale === 'ko'
    ? [
        '💡 구체적인 프롬프트가 더 좋은 결과를 만들어요',
        '🎨 다양한 스타일을 시도해보세요',
        '📱 친구에게 공유하면 크레딧을 받을 수 있어요',
        '⚡ 프리미엄이면 광고 없이 빠르게 생성해요',
        '🌟 매일 광고를 보면 무료로 이미지를 만들 수 있어요',
      ]
    : [
        '💡 Specific prompts create better results',
        '🎨 Try different art styles for variety',
        '📱 Share with friends to earn free credits',
        '⚡ Premium users get ad-free fast generation',
        '🌟 Watch daily ads to generate images for free',
      ];

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(tipTimer);
  }, [tips.length]);

  // 프로그레스 바 (최대 30초로 가정)
  const progress = Math.min((elapsed / 20) * 100, 95);

  return (
    <div className="space-y-6">
      {/* 로딩 애니메이션 */}
      <div className="card text-center py-8">
        {/* 스피너 */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-dark-500 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {t('ad.loading_title', locale)}
        </h3>
        <p className="text-sm text-dark-300 mb-4">
          {t('ad.loading_subtitle', locale)}
        </p>

        {/* 프로그레스 바 */}
        <div className="w-full max-w-xs mx-auto bg-dark-600 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-dark-400 mt-2">{elapsed}s</p>
      </div>

      {/* 광고 공간 (실제 AdMob 연동 전 플레이스홀더) */}
      <div className="rounded-2xl border-2 border-dashed border-dark-500 bg-dark-800/50 p-6 text-center">
        <p className="text-dark-400 text-sm mb-2">
          {locale === 'ko' ? '📺 여기에 광고가 표시됩니다' : '📺 Ad placement area'}
        </p>
        <div className="w-full h-40 bg-dark-700 rounded-xl flex items-center justify-center">
          <span className="text-dark-500 text-xs">AdMob Rewarded Video</span>
        </div>
      </div>

      {/* 팁 */}
      <div className="text-center">
        <p className="text-sm text-dark-200 transition-opacity duration-500">
          {tips[tipIndex]}
        </p>
      </div>
    </div>
  );
}
