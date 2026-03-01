// ============================================
// 다국어(i18n) 시스템
// ============================================

import en from './en.json';
import ko from './ko.json';

export type Locale = 'en' | 'ko';

const messages: Record<Locale, typeof en> = {
  en,
  ko,
};

// 브라우저 언어 감지
export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';

  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('ko')) return 'ko';

  return 'en';
}

// 번역 함수
export function getTranslations(locale: Locale = 'en') {
  return messages[locale] || messages.en;
}

// 중첩 키 접근 (예: t('generate.title'))
export function t(key: string, locale: Locale = 'en', params?: Record<string, string | number>): string {
  const translations = getTranslations(locale);
  const keys = key.split('.');

  let result: any = translations;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key; // 키를 못 찾으면 키 자체를 반환
    }
  }

  if (typeof result !== 'string') return key;

  // 파라미터 치환 (예: {count} → 5)
  if (params) {
    return Object.entries(params).reduce(
      (str, [paramKey, paramValue]) => str.replace(`{${paramKey}}`, String(paramValue)),
      result
    );
  }

  return result;
}

export default messages;
