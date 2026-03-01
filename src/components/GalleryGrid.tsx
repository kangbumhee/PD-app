// ============================================
// 갤러리 이미지 그리드
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { detectLocale, t } from '@/i18n';
import type { Locale } from '@/i18n';
import type { Generation } from '@/lib/types';

interface GalleryGridProps {
  generations: Generation[];
  onDelete: (id: string) => void;
}

export default function GalleryGrid({ generations, onDelete }: GalleryGridProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const [selectedImage, setSelectedImage] = useState<Generation | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    onDelete(id);
    setDeleting(null);
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `pixdap-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (generations.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🖼️</div>
        <p className="text-dark-300 mb-4">{t('gallery.empty', locale)}</p>
        <button
          onClick={() => (window.location.href = '/generate')}
          className="btn-primary"
        >
          {t('generate.generate_button', locale)}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 이미지 그리드 */}
      <div className="gallery-grid">
        {generations.map((gen) => (
          <div
            key={gen.id}
            className="relative group cursor-pointer rounded-xl overflow-hidden border border-dark-500 bg-dark-800"
            onClick={() => setSelectedImage(gen)}
          >
            <div className="aspect-square">
              <img
                src={gen.image_url || ''}
                alt={gen.prompt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* 호버 오버레이 */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <p className="text-xs text-white line-clamp-2">{gen.prompt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 이미지 상세 모달 */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-dark-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-dark-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 이미지 */}
            <div className="relative">
              <img
                src={selectedImage.image_url || ''}
                alt={selectedImage.prompt}
                className="w-full h-auto rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* 정보 */}
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-dark-400 mb-1">Prompt</p>
                <p className="text-sm text-dark-100">{selectedImage.prompt}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-dark-400">
                <span>{selectedImage.style}</span>
                <span>{formatDate(selectedImage.created_at)}</span>
              </div>

              {/* 액션 */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleDownload(selectedImage.image_url || '')}
                  className="btn-secondary text-sm py-2 flex items-center justify-center gap-1"
                >
                  📥 {t('generate.download', locale)}
                </button>
                <button
                  onClick={() => handleDelete(selectedImage.id)}
                  disabled={deleting === selectedImage.id}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm transition-colors flex items-center justify-center gap-1"
                >
                  🗑️ {t('gallery.delete', locale)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
