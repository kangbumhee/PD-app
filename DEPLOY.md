# Pixdap Vercel 배포 가이드

---

## 1단계: GitHub 연동

코드가 이미 GitHub에 올라가 있으므로 Vercel에서 바로 연동합니다.

## 2단계: Vercel 배포

### 방법 A: Vercel 웹사이트 (추천)

1. https://vercel.com 접속 → GitHub 계정으로 로그인
2. **"Add New..."** → **"Project"**
3. GitHub 저장소 목록에서 `kangbumhee/PD-app` 선택
4. **Framework Preset**: Next.js (자동 감지)
5. **Environment Variables** 추가 (중요!):

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` |
| `GEMINI_API_KEY` | `AIzaSy...` |
| `NEXT_PUBLIC_APP_URL` | `https://pixdap.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `Pixdap` |

6. **Deploy** 클릭
7. 2-3분 후 배포 완료 → URL 확인 (예: `https://pixdap.vercel.app`)

### 방법 B: CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포 (프로젝트 루트에서)
vercel --prod
```

환경 변수는 Vercel 대시보드에서 설정하거나:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

## 3단계: 배포 후 설정

### Supabase Redirect URI 업데이트

배포된 URL을 Supabase에 추가해야 합니다:

1. Supabase 대시보드 → **Authentication** → **URL Configuration**
2. **Site URL**: `https://pixdap.vercel.app` (배포된 URL)
3. **Redirect URLs**에 추가:
   ```
   https://pixdap.vercel.app/auth/callback
   ```
4. **Save**

### Google OAuth Redirect URI 업데이트

1. Google Cloud Console → **APIs & Services** → **Credentials**
2. OAuth 2.0 Client → **Authorized redirect URIs**에 추가:
   ```
   https://xxxxxx.supabase.co/auth/v1/callback
   ```
   (이미 추가했다면 그대로)

## 4단계: 커스텀 도메인 (선택)

1. Vercel 대시보드 → 프로젝트 → **Settings** → **Domains**
2. 커스텀 도메인 입력 (예: `pixdap.com`)
3. DNS 설정 안내에 따라 도메인 레지스트라에서 설정

## 5단계: 배포 체크리스트

- [ ] 배포 URL 접속 가능
- [ ] Google 로그인 작동
- [ ] 이미지 생성 작동
- [ ] 크레딧 시스템 작동
- [ ] 모바일에서 정상 표시
- [ ] PWA 설치 가능 (브라우저 주소창에 설치 아이콘)
