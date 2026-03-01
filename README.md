# 🎨 Pixdap - AI Image Generator

> AI로 놀라운 이미지를 몇 초 만에 만들어보세요

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kangbumhee/PD-app)

---

## 소개

Pixdap은 텍스트 프롬프트를 입력하면 AI가 이미지를 생성해주는 웹앱입니다.
8가지 이상의 아트 스타일(지브리, 애니메이션, 사실적, 픽셀아트 등)을 지원하며,
광고 시청으로 무료 크레딧을 받아 이용할 수 있습니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Auth & DB | Supabase (PostgreSQL + Google OAuth) |
| AI | Google Gemini API (Nano Banana) |
| 광고 | Google AdMob (Rewarded Video) |
| 배포 | Vercel → PWABuilder → Google Play |
| 다국어 | 영어 / 한국어 |

## 수익 모델

| 구분 | 내용 |
|------|------|
| 무료 | 가입 시 5크레딧, 광고 1회 시청 = 1크레딧, 추천 = 3크레딧 |
| 프리미엄 | $4.99/월, 광고 없음, 월 200크레딧, 우선 생성 |

## 빠른 시작

```bash
# 1. 클론
git clone https://github.com/kangbumhee/PD-app.git pixdap
cd pixdap

# 2. 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 키 입력

# 3. 패키지 설치
npm install

# 4. Supabase DB 설정
# Supabase SQL Editor에서 schema.sql 실행

# 5. 실행
npm run dev
```

## 문서

| 문서 | 내용 |
|------|------|
| [SETUP.md](./SETUP.md) | 초기 설정 (Supabase, Gemini API, Google OAuth) |
| [DEPLOY.md](./DEPLOY.md) | Vercel 배포 |
| [PLAYSTORE.md](./PLAYSTORE.md) | Google Play Store 출시 |

## 폴더 구조

```
src/
├── app/
│   ├── page.tsx              # 랜딩 페이지
│   ├── layout.tsx            # 루트 레이아웃 (PWA)
│   ├── generate/page.tsx     # 이미지 생성
│   ├── gallery/page.tsx      # 내 갤러리
│   ├── profile/page.tsx      # 프로필 & 크레딧
│   ├── auth/
│   │   ├── login/page.tsx    # Google 로그인
│   │   └── callback/route.ts # OAuth 콜백
│   ├── privacy/page.tsx      # 개인정보처리방침
│   ├── terms/page.tsx        # 이용약관
│   └── api/
│       ├── generate/route.ts # 이미지 생성 API
│       ├── credits/route.ts  # 크레딧 조회
│       ├── credits/ad-reward/route.ts # 광고 보상
│       ├── profile/route.ts  # 프로필 조회/수정
│       └── gallery/route.ts  # 갤러리 조회/삭제
├── components/
│   ├── Navbar.tsx            # 네비바 + 모바일 탭바
│   ├── CreditBadge.tsx       # 크레딧 잔액
│   ├── GenerateForm.tsx      # 프롬프트 + 스타일 선택
│   ├── ImageResult.tsx       # 결과 이미지 + 다운로드/공유
│   ├── LoadingWithAd.tsx     # 생성 중 로딩 + 광고 공간
│   ├── AdReward.tsx          # 광고 시청 → 크레딧
│   └── GalleryGrid.tsx       # 이미지 그리드 + 모달
├── lib/
│   ├── supabase-server.ts    # 서버 Supabase 클라이언트
│   ├── supabase-browser.ts   # 브라우저 Supabase 클라이언트
│   ├── gemini.ts             # Gemini API 래퍼
│   ├── credits.ts            # 크레딧 시스템
│   └── types.ts              # 타입 정의
└── i18n/
    ├── index.ts              # i18n 시스템
    ├── en.json               # 영어
    └── ko.json               # 한국어
```

## 라이선스

MIT

## 만든 사람

Pixdap Team
