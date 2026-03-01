// ============================================
// 네비게이션 바
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { detectLocale, t } from '@/i18n';
import type { Locale } from '@/i18n';
import CreditBadge from './CreditBadge';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLocale(detectLocale());
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const navLinks = user
    ? [
        { href: '/generate', label: t('nav.generate', locale), icon: '✨' },
        { href: '/gallery', label: t('nav.gallery', locale), icon: '🖼️' },
        { href: '/profile', label: t('nav.profile', locale), icon: '👤' },
      ]
    : [];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* 상단 네비바 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* 로고 */}
          <button onClick={() => router.push('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-lg font-bold text-white">Pixdap</span>
          </button>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary-600/20 text-primary-300'
                    : 'text-dark-200 hover:text-white hover:bg-dark-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* 우측 영역 */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <CreditBadge />
                <button
                  onClick={handleLogout}
                  className="hidden md:block text-sm text-dark-200 hover:text-white transition-colors"
                >
                  {t('nav.logout', locale)}
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/auth/login')}
                className="btn-primary text-sm px-4 py-2"
              >
                {t('nav.login', locale)}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 모바일 하단 탭바 */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-dark-800/95 backdrop-blur-xl border-t border-dark-600 safe-bottom">
          <div className="flex items-center justify-around h-14">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`flex flex-col items-center gap-0.5 px-4 py-1 ${
                  isActive(link.href) ? 'text-primary-400' : 'text-dark-300'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-[10px] font-medium">{link.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
