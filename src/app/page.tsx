// ============================================
// 랜딩 페이지 /
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { detectLocale, t } from '@/i18n';
import type { Locale } from '@/i18n';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setLocale(detectLocale());
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleCTA = () => {
    if (user) {
      router.push('/generate');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {/* 히어로 섹션 */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-600/10 border border-primary-600/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-primary-300 text-sm font-medium">
              {locale === 'ko' ? 'AI 이미지 생성기' : 'AI Image Generator'}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="text-gradient">{t('landing.hero_title', locale)}</span>
          </h1>

          {/* 부제 */}
          <p className="text-lg md:text-xl text-dark-100 mb-8 max-w-2xl mx-auto">
            {t('landing.hero_subtitle', locale)}
          </p>

          {/* CTA 버튼 */}
          <button onClick={handleCTA} className="btn-primary text-lg px-8 py-4 glow">
            {t('landing.cta_button', locale)}
          </button>

          {/* 무료 안내 */}
          <p className="mt-4 text-dark-300 text-sm">
            {locale === 'ko' ? '✨ 가입 시 5크레딧 무료 · 신용카드 불필요' : '✨ 5 free credits on signup · No credit card needed'}
          </p>
        </div>
      </section>

      {/* 예시 이미지 프리뷰 (플레이스홀더) */}
      <section className="pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { style: 'Ghibli', color: 'from-green-500/20 to-blue-500/20' },
              { style: 'Realistic', color: 'from-orange-500/20 to-red-500/20' },
              { style: 'Anime', color: 'from-pink-500/20 to-purple-500/20' },
              { style: 'Cyberpunk', color: 'from-cyan-500/20 to-blue-500/20' },
            ].map((item, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${item.color} border border-dark-500 flex items-center justify-center`}
              >
                <span className="text-dark-200 text-sm font-medium">{item.style}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="py-16 px-4 border-t border-dark-700">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* 기능 1 */}
            <div className="card text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-lg font-bold mb-2">{t('landing.feature1_title', locale)}</h3>
              <p className="text-dark-200 text-sm">{t('landing.feature1_desc', locale)}</p>
            </div>

            {/* 기능 2 */}
            <div className="card text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-bold mb-2">{t('landing.feature2_title', locale)}</h3>
              <p className="text-dark-200 text-sm">{t('landing.feature2_desc', locale)}</p>
            </div>

            {/* 기능 3 */}
            <div className="card text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-lg font-bold mb-2">{t('landing.feature3_title', locale)}</h3>
              <p className="text-dark-200 text-sm">{t('landing.feature3_desc', locale)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="py-16 px-4 border-t border-dark-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {locale === 'ko' ? '지금 바로 시작하세요' : 'Start Creating Now'}
          </h2>
          <p className="text-dark-200 mb-6">
            {locale === 'ko'
              ? '회원가입만 하면 바로 AI 이미지를 만들 수 있어요'
              : 'Sign up and start generating AI images instantly'}
          </p>
          <button onClick={handleCTA} className="btn-primary text-lg px-8 py-4">
            {t('landing.cta_button', locale)}
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 px-4 border-t border-dark-700">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-dark-400 text-sm">
            &copy; 2026 Pixdap. {locale === 'ko' ? '모든 권리 보유.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
