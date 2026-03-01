// ============================================
// 이용약관 (Play Store 권장)
// /terms
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { detectLocale } from '@/i18n';
import type { Locale } from '@/i18n';

export default function TermsPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const router = useRouter();

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const isKo = locale === 'ko';

  return (
    <div className="min-h-screen bg-dark-900 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="text-primary-400 text-sm mb-6 hover:underline">
          ← {isKo ? '뒤로가기' : 'Go back'}
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">
          {isKo ? '이용약관' : 'Terms of Service'}
        </h1>

        <div className="prose prose-invert max-w-none space-y-6 text-dark-100 text-sm leading-relaxed">
          <p>{isKo ? '최종 업데이트: 2026년 3월' : 'Last updated: March 2026'}</p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '1. 서비스 소개' : '1. About the Service'}
          </h2>
          <p>
            {isKo
              ? 'Pixdap은 AI 기술을 활용한 이미지 생성 서비스입니다. 사용자가 입력한 텍스트 프롬프트를 기반으로 AI가 이미지를 생성합니다.'
              : 'Pixdap is an AI-powered image generation service. AI generates images based on text prompts entered by users.'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '2. 계정' : '2. Accounts'}
          </h2>
          <p>
            {isKo
              ? '서비스 이용을 위해 Google 계정으로 로그인이 필요합니다. 사용자는 자신의 계정 활동에 대해 책임을 집니다.'
              : 'A Google account login is required to use the service. Users are responsible for their account activity.'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '3. 크레딧 시스템' : '3. Credit System'}
          </h2>
          <p>
            {isKo
              ? '가입 시 5 무료 크레딧이 제공됩니다. 광고 시청으로 추가 크레딧을 받을 수 있습니다. 크레딧은 환불되지 않습니다. 크레딧 가격 및 정책은 사전 통지 없이 변경될 수 있습니다.'
              : 'Five free credits are provided upon signup. Additional credits can be earned by watching ads. Credits are non-refundable. Credit pricing and policies may change without prior notice.'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '4. 생성된 콘텐츠' : '4. Generated Content'}
          </h2>
          <p>
            {isKo
              ? 'AI가 생성한 이미지의 사용 권리는 사용자에게 있습니다. 다만, 불법적이거나 유해한 콘텐츠 생성은 금지됩니다. 서비스는 부적절한 콘텐츠를 필터링할 권리가 있습니다.'
              : 'Users retain usage rights to AI-generated images. However, generating illegal or harmful content is prohibited. The service reserves the right to filter inappropriate content.'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '5. 금지 행위' : '5. Prohibited Activities'}
          </h2>
          <p>
            {isKo
              ? '다음 행위는 금지됩니다: 불법 콘텐츠 생성. 타인의 권리를 침해하는 이미지 생성. 서비스를 악용하거나 크레딧 시스템을 조작하는 행위. 자동화된 봇을 이용한 대량 생성.'
              : 'The following activities are prohibited: Generating illegal content. Creating images that infringe on others rights. Abusing the service or manipulating the credit system. Mass generation using automated bots.'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '6. 면책 조항' : '6. Disclaimer'}
          </h2>
          <p>
            {isKo
              ? 'AI 생성 결과의 품질이나 정확성을 보장하지 않습니다. 서비스 중단이나 오류에 대한 책임을 지지 않습니다. 서비스는 "있는 그대로" 제공됩니다.'
              : 'We do not guarantee the quality or accuracy of AI-generated results. We are not liable for service interruptions or errors. The service is provided "as is."'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '7. 문의' : '7. Contact'}
          </h2>
          <p className="text-primary-400">pixdap.app@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
