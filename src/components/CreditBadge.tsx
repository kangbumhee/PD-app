// ============================================
// 크레딧 잔액 배지
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function CreditBadge() {
  const [credits, setCredits] = useState<number | null>(null);

  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/credits');
      const data = await res.json();
      if (data.success) {
        setCredits(data.credits);
      }
    } catch {
      // 에러 무시
    }
  };

  useEffect(() => {
    fetchCredits();

    // 30초마다 크레딧 갱신
    const interval = setInterval(fetchCredits, 30000);
    return () => clearInterval(interval);
  }, []);

  // 커스텀 이벤트로 즉시 갱신
  useEffect(() => {
    const handler = () => fetchCredits();
    window.addEventListener('credits-updated', handler);
    return () => window.removeEventListener('credits-updated', handler);
  }, []);

  if (credits === null) {
    return (
      <div className="px-3 py-1 bg-dark-600 rounded-full animate-pulse">
        <span className="text-xs text-dark-300">···</span>
      </div>
    );
  }

  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
        credits > 0
          ? 'bg-primary-600/20 text-primary-300 border border-primary-600/30'
          : 'bg-red-500/20 text-red-300 border border-red-500/30'
      }`}
    >
      <span>💎</span>
      <span>{credits}</span>
    </div>
  );
}
