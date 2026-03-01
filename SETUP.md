# Pixdap 초기 설정 가이드

이 문서는 Pixdap을 처음 설정하는 전체 과정을 다룹니다.

---

## 1단계: Supabase 설정

### 1-1. 프로젝트 생성

1. https://supabase.com 접속 → 로그인
2. "New Project" 클릭
3. 설정:
   - **Name**: `pixdap`
   - **Database Password**: 강력한 비밀번호 입력 (따로 메모)
   - **Region**: Northeast Asia (Tokyo) — 한국 사용자 대상이면 Tokyo 선택
4. "Create new project" 클릭 → 2-3분 대기

### 1-2. API 키 확인

1. 왼쪽 사이드바 → **Settings** → **API**
2. 아래 3개를 복사해서 `.env.local`에 입력:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

⚠️ `SERVICE_ROLE_KEY`는 절대 프론트엔드에 노출하면 안 됩니다.

### 1-3. DB 테이블 생성

1. 왼쪽 사이드바 → **SQL Editor**
2. "New Query" 클릭
3. 프로젝트 루트의 `schema.sql` 내용을 전체 복사/붙여넣기
4. **Run** 클릭
5. 성공 메시지가 뜨면 완료

### 1-4. Google OAuth 설정

1. https://console.cloud.google.com 접속
2. 프로젝트 선택 (없으면 새로 생성)
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
4. **Application type**: Web application
5. **Authorized redirect URIs**에 추가:
   ```
   https://xxxxxx.supabase.co/auth/v1/callback
   ```
   (xxxxxx는 본인 Supabase 프로젝트 ID)
6. **Client ID**와 **Client Secret** 복사

7. Supabase 대시보드 → **Authentication** → **Providers** → **Google**
8. **Enable** 켜기
9. **Client ID**와 **Client Secret** 붙여넣기
10. **Save**

---

## 2단계: Google Gemini API 키 발급

1. https://aistudio.google.com 접속 → Google 계정 로그인
2. 왼쪽 메뉴 → **Get API key** 클릭
3. **Create API key** 클릭
4. 생성된 키를 `.env.local`에 입력:

```
GEMINI_API_KEY=AIzaSy...
```

5. 무료 티어 한도 확인: https://ai.google.dev/gemini-api/docs/rate-limits

---

## 3단계: 로컬 실행

```bash
# 환경 변수 파일 생성
cp .env.local.example .env.local
# ↑ 위에서 받은 키들을 .env.local에 입력

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

http://localhost:3000 접속하여 확인

### 체크리스트

- [ ] 랜딩 페이지가 정상적으로 보이는가
- [ ] Google 로그인이 작동하는가
- [ ] 로그인 후 크레딧이 5로 표시되는가
- [ ] 이미지 생성이 작동하는가
- [ ] 갤러리에 생성된 이미지가 보이는가
- [ ] 프로필 페이지에 정보가 표시되는가

---

## 4단계: 환경 변수 요약

| 변수명 | 어디서 발급 | 설명 |
|--------|-----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 같은 곳 | 프론트엔드용 공개 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | 같은 곳 | 서버 전용 비밀 키 |
| `GEMINI_API_KEY` | Google AI Studio | Gemini API 키 |
| `NEXT_PUBLIC_APP_URL` | 본인이 설정 | 배포 후 URL |

---

## 문제 해결

### "Auth error" 로그인 안 됨
→ Supabase Google Provider의 Redirect URI가 정확한지 확인

### "No image generated"
→ Gemini API 키가 올바른지, 무료 할당량이 남아있는지 확인

### "Profile not found"
→ Supabase SQL Editor에서 `schema.sql`의 트리거가 정상 생성되었는지 확인:
```sql
SELECT * FROM public.profiles;
```

### 크레딧이 차감되지 않음
→ Supabase의 RLS(Row Level Security)가 정상 설정되었는지 확인
```
```
