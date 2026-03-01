// ============================================
// 광고 시청 → 크레딧 받기 버튼
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { detectLocale, t } from '@/i18n';
import type { Locale } from '@/i18n';

interface AdRewardProps {
  onCreditEarned: () => void;
}

export default function AdReward({ onCreditEarned }: AdRewardProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  // 쿨다운 타이머
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleWatchAd = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // TODO: 실제 AdMob 광고 표시 로직
      // 현재는 시뮬레이션 (3초 대기)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 서버에 보상 요청
      const res = await fetch('/api/credits/ad-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adType: 'rewarded_video' }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(locale === 'ko' ? '✅ 1크레딧을 받았어요!' : '✅ You earned 1 credit!');
        setCooldown(30); // 30초 쿨다운

        // 크레딧 배지 갱신
        window.dispatchEvent(new Event('credits-updated'));
        onCreditEarned();
      } else {
        setMessage(data.error || (locale === 'ko' ? '❌ 실패했습니다' : '❌ Failed'));
        if (res.status === 429) {
          setCooldown(30);
        }
      }
    } catch {
      setMessage(locale === 'ko' ? '❌ 오류가 발생했습니다' : '❌ An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card text-center">
      <div className="text-3xl mb-2">🎬</div>
      <h3 className="font-bold text-white mb-1">{t('ad.reward_title', locale)}</h3>
      <p className="text-sm text-dark-300 mb-4">{t('ad.reward_subtitle', locale)}</p>

      {message && (
        <p className="text-sm mb-3 text-primary-300">{message}</p>
      )}

      <button
        onClick={handleWatchAd}
        disabled={loading || cooldown > 0}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{locale === 'ko' ? '광고 재생 중...' : 'Playing ad...'}</span>
          </>
        ) : cooldown > 0 ? (
          <span>{locale === 'ko' ? `${cooldown}초 후 다시 가능` : `Wait ${cooldown}s`}</span>
        ) : (
          <span>{t('ad.reward_button', locale)}</span>
        )}
      </button>
    </div>
  );
}
