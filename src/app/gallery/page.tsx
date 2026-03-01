// ============================================
// 갤러리 페이지 /gallery
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GalleryGrid from '@/components/GalleryGrid';
import { detectLocale, t } from '@/i18n';
import type { Locale } from '@/i18n';
import type { Generation } from '@/lib/types';

export default function GalleryPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const fetchGallery = async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?page=${pageNum}&limit=20`);
      const data = await res.json();

      if (data.success) {
        setGenerations(data.generations);
        setTotalPages(data.pagination.totalPages);
        setPage(pageNum);
      }
    } catch {
      // 에러 처리
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(1);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationId: id }),
      });

      const data = await res.json();
      if (data.success) {
        setGenerations((prev) => prev.filter((g) => g.id !== id));
      }
    } catch {
      // 에러 처리
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <main className="pt-16 pb-24 md:pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* 헤더 */}
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t('gallery.title', locale)}
              </h1>
              <p className="text-sm text-dark-300 mt-1">
                {generations.length} {locale === 'ko' ? '개 이미지' : 'images'}
              </p>
            </div>
          </div>

          {/* 로딩 */}
          {loading ? (
            <div className="gallery-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl shimmer"
                />
              ))}
            </div>
          ) : (
            <GalleryGrid generations={generations} onDelete={handleDelete} />
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => fetchGallery(page - 1)}
                disabled={page <= 1}
                className="btn-ghost text-sm disabled:opacity-30"
              >
                ← {locale === 'ko' ? '이전' : 'Prev'}
              </button>

              <span className="text-sm text-dark-300">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => fetchGallery(page + 1)}
                disabled={page >= totalPages}
                className="btn-ghost text-sm disabled:opacity-30"
              >
                {locale === 'ko' ? '다음' : 'Next'} →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
