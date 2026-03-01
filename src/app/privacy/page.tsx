// ============================================
// 개인정보처리방침 (Play Store 필수)
// /privacy
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { detectLocale } from '@/i18n';
import type { Locale } from '@/i18n';

export default function PrivacyPage() {
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
          {isKo ? '개인정보처리방침' : 'Privacy Policy'}
        </h1>

        <div className="prose prose-invert max-w-none space-y-6 text-dark-100 text-sm leading-relaxed">
          <p>{isKo ? '최종 업데이트: 2026년 3월' : 'Last updated: March 2026'}</p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '1. 수집하는 정보' : '1. Information We Collect'}
          </h2>
          <p>
            {isKo
              ? 'Pixdap은 서비스 제공을 위해 다음 정보를 수집합니다: Google 계정 이메일 주소, 표시 이름, 프로필 사진 URL. 사용자가 입력한 이미지 생성 프롬프트. AI가 생성한 이미지 데이터. 크레딧 사용 및 거래 내역. 기기 유형, 브라우저 정보, IP 주소 등 기본적인 분석 데이터.'
              : 'Pixdap collects the following information to provide our service: Google account email address, display name, and profile picture URL. Image generation prompts entered by users. AI-generated image data. Credit usage and transaction history. Basic analytics data such as device type, browser information, and IP address.'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '2. 정보 사용 방법' : '2. How We Use Your Information'}
          </h2>
          <p>
            {isKo
              ? '수집된 정보는 다음 목적으로 사용됩니다: 계정 인증 및 관리. AI 이미지 생성 서비스 제공. 크레딧 시스템 운영. 서비스 개선 및 분석. 고객 지원.'
              : 'We use collected information for: Account authentication and management. Providing AI image generation services. Operating the credit system. Service improvement and analytics. Customer support.'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '3. 데이터 저장 및 보안' : '3. Data Storage and Security'}
          </h2>
          <p>
            {isKo
              ? '사용자 데이터는 Supabase (AWS 인프라)에 안전하게 저장됩니다. 모든 데이터 전송은 HTTPS로 암호화됩니다. Row Level Security (RLS)를 통해 사용자는 자신의 데이터에만 접근할 수 있습니다.'
              : 'User data is securely stored on Supabase (AWS infrastructure). All data transfers are encrypted via HTTPS. Row Level Security (RLS) ensures users can only access their own data.'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '4. 제3자 공유' : '4. Third-Party Sharing'}
          </h2>
          <p>
            {isKo
              ? '다음 제3자 서비스와 데이터가 공유됩니다: Google (인증 및 Gemini AI API). Supabase (데이터 저장). Vercel (웹 호스팅). Google AdMob (광고, 비개인 데이터). 법적 요구가 있는 경우를 제외하고, 개인 데이터를 제3자에게 판매하지 않습니다.'
              : 'Data is shared with the following third-party services: Google (authentication and Gemini AI API). Supabase (data storage). Vercel (web hosting). Google AdMob (advertising, non-personal data). We do not sell personal data to third parties except as required by law.'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '5. 아동 개인정보' : "5. Children's Privacy"}
          </h2>
          <p>
            {isKo
              ? 'Pixdap은 13세 미만 아동을 대상으로 하지 않습니다. 13세 미만 사용자의 데이터를 의도적으로 수집하지 않습니다.'
              : 'Pixdap is not directed at children under 13. We do not knowingly collect data from children under 13.'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '6. 사용자의 권리' : '6. Your Rights'}
          </h2>
          <p>
            {isKo
              ? '사용자는 다음 권리를 가집니다: 자신의 데이터 열람 요청. 데이터 수정 요청. 계정 및 데이터 삭제 요청. 이러한 요청은 앱 내 프로필 페이지 또는 이메일을 통해 할 수 있습니다.'
              : 'You have the right to: Request access to your data. Request correction of your data. Request deletion of your account and data. These requests can be made through the in-app profile page or via email.'}
          </p>

          <h2 className="text-xl font-bold text-white mt-8">
            {isKo ? '7. 문의' : '7. Contact'}
          </h2>
          <p>
            {isKo
              ? '개인정보 관련 문의사항이 있으시면 아래로 연락해 주세요.'
              : 'For privacy-related inquiries, please contact us at the email below.'}
          </p>
          <p className="text-primary-400">pixdap.app@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
