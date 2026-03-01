// ============================================
// 생성된 이미지 표시
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { detectLocale, t } from '@/i18n';
import type { Locale } from '@/i18n';

interface ImageResultProps {
  imageBase64: string;
  prompt: string;
  onReset: () => void;
}

export default function ImageResult({ imageBase64, prompt, onReset }: ImageResultProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  // 이미지 다운로드
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageBase64;
    link.download = `pixdap-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 이미지 공유
  const handleShare = async () => {
    try {
      // base64를 Blob으로 변환
      const res = await fetch(imageBase64);
      const blob = await res.blob();
      const file = new File([blob], 'pixdap-image.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Made with Pixdap',
          text: prompt,
          files: [file],
        });
      } else {
        // 공유 API 미지원 시 클립보드에 URL 복사
        await navigator.clipboard.writeText(`Check out what I made with Pixdap! 🎨`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // 사용자가 공유 취소한 경우
    }
  };

  return (
    <div className="space-y-4">
      {/* 생성된 이미지 */}
      <div className="relative rounded-2xl overflow-hidden border border-dark-500 bg-dark-800">
        <img
          src={imageBase64}
          alt={prompt}
          className="w-full h-auto"
          loading="eager"
        />

        {/* 워터마크 (무료 사용자용) */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white/60">
          Made with Pixdap
        </div>
      </div>

      {/* 프롬프트 표시 */}
      <div className="px-3 py-2 bg-dark-800 rounded-xl">
        <p className="text-xs text-dark-300 mb-1">Prompt</p>
        <p className="text-sm text-dark-100">{prompt}</p>
      </div>

      {/* 액션 버튼들 */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={handleDownload} className="btn-secondary text-sm py-2.5 flex items-center justify-center gap-1.5">
          <span>📥</span>
          <span>{t('generate.download', locale)}</span>
        </button>

        <button onClick={handleShare} className="btn-secondary text-sm py-2.5 flex items-center justify-center gap-1.5">
          <span>📤</span>
          <span>{shared ? '✓' : t('generate.share', locale)}</span>
        </button>

        <button onClick={onReset} className="btn-primary text-sm py-2.5 flex items-center justify-center gap-1.5">
          <span>✨</span>
          <span>{t('generate.try_again', locale)}</span>
        </button>
      </div>
    </div>
  );
}
