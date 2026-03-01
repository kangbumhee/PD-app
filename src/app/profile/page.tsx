// ============================================
// 프로필 페이지 /profile
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import Navbar from '@/components/Navbar';
import AdReward from '@/components/AdReward';
import { detectLocale, t } from '@/i18n';
import type { Locale } from '@/i18n';
import type { Profile } from '@/lib/types';

export default function ProfilePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLocale(detectLocale());
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
      }
    } catch {
      // 에러 처리
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferral = async () => {
    if (!profile?.referral_code) return;

    const shareText = locale === 'ko'
      ? `Pixdap에서 AI 이미지를 무료로 만들어보세요! 내 추천 코드: ${profile.referral_code}`
      : `Create AI images for free with Pixdap! My referral code: ${profile.referral_code}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <main className="pt-16 pb-24 px-4">
          <div className="max-w-xl mx-auto py-6 space-y-4">
            <div className="h-8 w-48 shimmer rounded-lg" />
            <div className="card space-y-3">
              <div className="h-6 w-full shimmer rounded" />
              <div className="h-6 w-3/4 shimmer rounded" />
              <div className="h-6 w-1/2 shimmer rounded" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <main className="pt-16 pb-24 px-4 text-center py-20">
          <p className="text-dark-300">{t('errors.generic', locale)}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <main className="pt-16 pb-24 md:pb-8 px-4">
        <div className="max-w-xl mx-auto">
          {/* 헤더 */}
          <div className="py-6">
            <h1 className="text-2xl font-bold text-white">
              {t('profile.title', locale)}
            </h1>
          </div>

          <div className="space-y-4">
            {/* 유저 정보 카드 */}
            <div className="card">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {(profile.display_name || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {profile.display_name || 'User'}
                  </h2>
                  <p className="text-sm text-dark-300">{profile.email}</p>
                </div>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-dark-600 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-primary-400">
                    💎 {profile.credits}
                  </p>
                  <p className="text-xs text-dark-300 mt-1">
                    {t('profile.credits', locale)}
                  </p>
                </div>
                <div className="bg-dark-600 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">
                    {profile.total_generated}
                  </p>
                  <p className="text-xs text-dark-300 mt-1">
                    {t('profile.total_generated', locale)}
                  </p>
                </div>
                <div className="bg-dark-600 rounded-xl p-3 text-center">
                  <p className="text-sm font-bold text-white">
                    {formatDate(profile.created_at)}
                  </p>
                  <p className="text-xs text-dark-300 mt-1">
                    {t('profile.member_since', locale)}
                  </p>
                </div>
              </div>
            </div>

            {/* 추천 코드 */}
            <div className="card">
              <h3 className="font-bold text-white mb-1">
                {t('profile.referral_code', locale)}
              </h3>
              <p className="text-xs text-dark-300 mb-3">
                {t('profile.referral_desc', locale)}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-2.5 bg-dark-800 rounded-xl font-mono text-primary-300 text-center tracking-wider">
                  {profile.referral_code || '--------'}
                </div>
                <button
                  onClick={handleCopyReferral}
                  className="btn-secondary px-4 py-2.5 text-sm"
                >
                  {copied ? t('profile.copied', locale) : t('profile.copy_code', locale)}
                </button>
              </div>
            </div>

            {/* 광고로 크레딧 받기 */}
            <AdReward onCreditEarned={fetchProfile} />

            {/* 프리미엄 업그레이드 */}
            {!profile.is_premium && (
              <div className="card border-primary-600/30 bg-gradient-to-br from-primary-600/10 to-dark-700">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">👑</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">
                      {t('profile.premium_title', locale)}
                    </h3>
                    <p className="text-xs text-dark-200 mb-3">
                      {t('profile.premium_desc', locale)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-300">
                        {t('profile.premium_price', locale)}
                      </span>
                      <button className="btn-primary text-sm px-4 py-2">
                        {t('profile.premium_button', locale)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 로그아웃 */}
            <button
              onClick={handleLogout}
              className="w-full py-3 text-center text-dark-300 hover:text-red-400 transition-colors text-sm"
            >
              {t('nav.logout', locale)}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
