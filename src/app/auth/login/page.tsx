// ============================================
// 로그인 페이지
// /auth/login
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { detectLocale, t } from '@/i18n';
import type { Locale } from '@/i18n';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLocale(detectLocale());

    // URL에서 에러 파라미터 확인
    const authError = searchParams.get('error');
    if (authError === 'auth_failed') {
      setError(t('errors.generic', locale));
    }
  }, [searchParams, locale]);

  // 이미 로그인된 유저는 생성 페이지로 이동
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/generate');
      }
    };
    checkUser();
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/generate`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
      }
      // 리다이렉트되므로 loading은 해제하지 않음
    } catch (err) {
      setError(t('errors.generic', locale));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 로고 & 제목 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-2xl font-bold text-white">P</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('auth.login_title', locale)}
          </h1>
          <p className="text-dark-200">
            {t('auth.login_subtitle', locale)}
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-dark-700 rounded-2xl p-6 shadow-xl border border-dark-500">
          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Google 로그인 버튼 */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span>{t('auth.google_login', locale)}</span>
          </button>

          {/* 무료 크레딧 안내 */}
          <div className="mt-4 p-3 bg-primary-600/10 border border-primary-600/30 rounded-lg">
            <p className="text-primary-300 text-sm text-center">
              🎁 {locale === 'ko' ? '가입하면 5크레딧 무료!' : 'Get 5 free credits on signup!'}
            </p>
          </div>

          {/* 약관 동의 */}
          <p className="mt-4 text-xs text-dark-200 text-center">
            {t('auth.terms', locale)}
          </p>
        </div>

        {/* 하단 데코 */}
        <div className="mt-6 text-center">
          <p className="text-dark-300 text-sm">
            {locale === 'ko'
              ? '코딩 없이 AI 이미지를 만들어보세요'
              : 'Create AI images without coding'}
          </p>
        </div>
      </div>
    </div>
  );
}
