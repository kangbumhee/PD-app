// ============================================
// 이미지 생성 페이지 /generate
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GenerateForm from '@/components/GenerateForm';
import ImageResult from '@/components/ImageResult';
import LoadingWithAd from '@/components/LoadingWithAd';
import AdReward from '@/components/AdReward';
import { detectLocale, t } from '@/i18n';
import type { Locale } from '@/i18n';
import type { StyleId } from '@/lib/types';

type PageState = 'form' | 'loading' | 'result' | 'error';

export default function GeneratePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [pageState, setPageState] = useState<PageState>('form');
  const [credits, setCredits] = useState(0);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingStartTime, setLoadingStartTime] = useState(0);

  useEffect(() => {
    setLocale(detectLocale());
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/credits');
      const data = await res.json();
      if (data.success) {
        setCredits(data.credits);
      }
    } catch {}
  };

  const handleGenerate = async (prompt: string, style: StyleId) => {
    setPageState('loading');
    setLoadingStartTime(Date.now());
    setCurrentPrompt(prompt);
    setErrorMessage('');
    setImageBase64(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await res.json();

      if (data.success && data.imageBase64) {
        setImageBase64(data.imageBase64);
        setCredits(data.creditsRemaining ?? credits - 1);
        setPageState('result');
        window.dispatchEvent(new Event('credits-updated'));
      } else {
        setErrorMessage(data.error || t('errors.generation_failed', locale));
        if (data.creditsRemaining !== undefined) {
          setCredits(data.creditsRemaining);
        }
        setPageState('error');
      }
    } catch {
      setErrorMessage(t('errors.generic', locale));
      setPageState('error');
    }
  };

  const handleReset = () => {
    setPageState('form');
    setImageBase64(null);
    setErrorMessage('');
    fetchCredits();
  };

  const handleCreditEarned = () => {
    fetchCredits();
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <main className="pt-16 pb-24 md:pb-8 px-4">
        <div className="max-w-xl mx-auto">
          {/* 헤더 */}
          <div className="py-6">
            <h1 className="text-2xl font-bold text-white">
              {t('generate.title', locale)}
            </h1>
            <p className="text-sm text-dark-300 mt-1">
              {t('generate.credits_remaining', locale, { count: credits })}
            </p>
          </div>

          {/* 상태별 UI */}
          {pageState === 'form' && (
            <div className="space-y-6">
              <GenerateForm
                onGenerate={handleGenerate}
                isGenerating={false}
                credits={credits}
              />

              {/* 크레딧 부족 시 광고 버튼 */}
              {credits <= 2 && (
                <AdReward onCreditEarned={handleCreditEarned} />
              )}
            </div>
          )}

          {pageState === 'loading' && (
            <LoadingWithAd startTime={loadingStartTime} />
          )}

          {pageState === 'result' && imageBase64 && (
            <ImageResult
              imageBase64={imageBase64}
              prompt={currentPrompt}
              onReset={handleReset}
            />
          )}

          {pageState === 'error' && (
            <div className="space-y-4">
              {/* 에러 카드 */}
              <div className="card text-center py-8">
                <div className="text-4xl mb-3">😔</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {locale === 'ko' ? '이미지 생성 실패' : 'Generation Failed'}
                </h3>
                <p className="text-sm text-dark-300 mb-4">{errorMessage}</p>
                <button onClick={handleReset} className="btn-primary">
                  {t('generate.try_again', locale)}
                </button>
              </div>

              {/* 크레딧 부족이면 광고 버튼 */}
              {credits <= 0 && (
                <AdReward onCreditEarned={handleCreditEarned} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
