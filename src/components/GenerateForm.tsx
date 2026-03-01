// ============================================
// 이미지 생성 폼
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { IMAGE_STYLES } from '@/lib/types';
import { detectLocale, t } from '@/i18n';
import type { Locale } from '@/i18n';
import type { StyleId } from '@/lib/types';

interface GenerateFormProps {
  onGenerate: (prompt: string, style: StyleId) => void;
  isGenerating: boolean;
  credits: number;
}

export default function GenerateForm({ onGenerate, isGenerating, credits }: GenerateFormProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StyleId>('realistic');
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating || credits <= 0) return;
    onGenerate(prompt.trim(), selectedStyle);
  };

  const examplePrompts = locale === 'ko'
    ? [
        '벚꽃이 흩날리는 일본 사찰',
        '우주를 떠다니는 고양이 우주비행사',
        '네온 불빛이 빛나는 비 오는 도쿄 골목',
        '해질녘 바다 위의 등대',
      ]
    : [
        'A Japanese temple with cherry blossoms falling',
        'Cat astronaut floating in space',
        'Rainy Tokyo alley with neon lights',
        'Lighthouse on the ocean at sunset',
      ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 프롬프트 입력 */}
      <div>
        <label className="block text-sm font-medium text-dark-100 mb-2">
          {t('generate.prompt_label', locale)}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('generate.prompt_placeholder', locale)}
          rows={3}
          maxLength={1000}
          className="input-field resize-none"
          disabled={isGenerating}
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-dark-400">
            {t('generate.prompt_tips', locale)}
          </p>
          <span className="text-xs text-dark-400">{prompt.length}/1000</span>
        </div>
      </div>

      {/* 예시 프롬프트 */}
      <div className="flex flex-wrap gap-2">
        {examplePrompts.map((example, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPrompt(example)}
            className="px-3 py-1.5 text-xs bg-dark-600 hover:bg-dark-500 text-dark-200 hover:text-white rounded-full transition-colors"
            disabled={isGenerating}
          >
            {example.length > 25 ? example.slice(0, 25) + '...' : example}
          </button>
        ))}
      </div>

      {/* 스타일 선택 */}
      <div>
        <label className="block text-sm font-medium text-dark-100 mb-2">
          {t('generate.style_label', locale)}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {IMAGE_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setSelectedStyle(style.id)}
              disabled={isGenerating}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                selectedStyle === style.id
                  ? 'bg-primary-600 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-700'
                  : 'bg-dark-600 text-dark-200 hover:bg-dark-500 hover:text-white'
              }`}
            >
              {locale === 'ko' ? style.labelKo : style.label}
            </button>
          ))}
        </div>
      </div>

      {/* 생성 버튼 */}
      <button
        type="submit"
        disabled={!prompt.trim() || isGenerating || credits <= 0}
        className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{t('generate.generating', locale)}</span>
          </>
        ) : credits <= 0 ? (
          <span>{t('generate.no_credits', locale)}</span>
        ) : (
          <>
            <span>✨</span>
            <span>{t('generate.generate_button', locale)}</span>
            <span className="text-primary-200 text-sm">(-1 💎)</span>
          </>
        )}
      </button>
    </form>
  );
}
