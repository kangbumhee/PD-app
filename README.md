# Pixdap - AI Image Generator

AI로 놀라운 이미지를 만들어보세요. 무료 크레딧으로 시작하고, 광고를 보며 추가 크레딧을 받으세요.

## 기술 스택

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Auth & DB**: Supabase (PostgreSQL + Auth)
- **AI**: Google Gemini API (Nano Banana)
- **Ads**: Google AdMob (Rewarded Video)
- **Deploy**: Vercel → PWABuilder → Google Play

## 시작하기

### 1. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 아래 값들을 입력:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `GEMINI_API_KEY` — Google AI Studio에서 발급

### 2. Supabase DB 설정

Supabase 대시보드 → SQL Editor에서 `schema.sql` 실행

### 3. 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000 접속

### 4. Vercel 배포

```bash
npm i -g vercel
vercel login
vercel --prod
```

### 5. Google Play 출시

1. https://www.pwabuilder.com 접속
2. 배포된 URL 입력
3. Android 패키지 다운로드
4. Google Play Console에 업로드 ($25)

## 수익 모델

- **무료**: 가입 시 5크레딧, 광고 1회 시청 = 1크레딧
- **프리미엄**: $4.99/월, 광고 없음, 월 200크레딧

## 폴더 구조

```
src/
├── app/          # Next.js 페이지 & API
├── components/   # 재사용 UI 컴포넌트
└── lib/          # Supabase, Gemini, 크레딧 로직
└── i18n/         # 다국어 (한국어/영어)
```

## 라이선스

MIT
