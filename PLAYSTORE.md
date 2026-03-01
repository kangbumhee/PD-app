# Pixdap Google Play Store 출시 가이드

PWA를 Android 앱으로 변환하여 Google Play에 출시하는 전체 과정입니다.

---

## 1단계: PWA 요구사항 확인

Play Store에 올리려면 다음이 필요합니다:

- [x] `manifest.json` — 앱 이름, 아이콘, 테마
- [x] Service Worker (`sw.js`) — 오프라인 지원
- [x] HTTPS — Vercel은 자동 적용
- [x] 반응형 디자인 — 모바일 퍼스트

확인 도구: https://www.pwabuilder.com 에서 URL 입력 후 점수 확인

---

## 2단계: 앱 아이콘 준비

### 필요한 아이콘

| 파일명 | 크기 | 용도 |
|--------|------|------|
| `icon-192x192.png` | 192×192 | PWA 기본 |
| `icon-512x512.png` | 512×512 | PWA + Play Store |
| `icon-1024x1024.png` | 1024×1024 | Play Store 메인 |

### 아이콘 만드는 법 (무료)

1. https://www.canva.com 접속
2. "앱 아이콘" 템플릿 선택 (1024×1024)
3. 디자인:
   - 배경: #4c6ef5 (Pixdap 브랜드 컬러)
   - 텍스트: "P" (흰색, 볼드)
   - 또는 원하는 로고 디자인
4. PNG로 다운로드
5. https://www.pwabuilder.com/imageGenerator 에서 여러 크기로 변환

아이콘을 `public/icons/` 폴더에 저장

---

## 3단계: PWABuilder로 Android 패키지 생성 (가장 쉬운 방법)

### 3-1. 패키지 생성

1. https://www.pwabuilder.com 접속
2. 배포된 URL 입력 (예: `https://pixdap.vercel.app`)
3. **"Start"** 클릭 → PWA 점수 확인
4. **"Package for stores"** 클릭
5. **"Android"** 선택
6. 설정:
   - **Package ID**: `com.pixdap.app` (고유 ID, 나중에 변경 불가)
   - **App name**: `Pixdap`
   - **App version**: `1.0.0`
   - **App version code**: `1`
   - **Display mode**: `Standalone`
   - **Status bar color**: `#101113`
   - **Navigation bar color**: `#101113`
   - **Splash screen color**: `#101113`
   - **Icon**: 512×512 아이콘 업로드
   - **Signing key**: **"Let PWABuilder generate a new signing key"** 선택
7. **"Generate"** 클릭
8. ZIP 파일 다운로드

### 3-2. 다운로드한 ZIP 내용

```
pixdap-android/
├── app-release-signed.aab    ← Play Store에 올릴 파일
├── signing-key-info.txt      ← 서명 키 정보 (매우 중요! 백업 필수!)
├── signing.keystore          ← 서명 키스토어 (매우 중요! 백업 필수!)
└── assetlinks.json           ← Digital Asset Links 파일
```

⚠️ **`signing.keystore`와 `signing-key-info.txt`는 반드시 안전한 곳에 백업하세요.**
이걸 잃어버리면 앱 업데이트를 할 수 없습니다!

### 3-3. Digital Asset Links 설정

`assetlinks.json`을 웹사이트에 올려서 앱과 웹사이트의 소유권을 검증합니다.

1. 다운로드한 `assetlinks.json` 내용을 확인
2. 프로젝트의 `public/.well-known/assetlinks.json` 경로에 복사
3. 커밋 & 푸시

```bash
mkdir -p public/.well-known
cp /다운로드경로/assetlinks.json public/.well-known/assetlinks.json
git add .
git commit -m "Add Digital Asset Links for Play Store"
git push origin main
```

4. Vercel에 재배포 후 확인:
   `https://pixdap.vercel.app/.well-known/assetlinks.json`

---

## 4단계: Google Play Console 등록

### 4-1. 개발자 계정 생성

1. https://play.google.com/console 접속
2. Google 계정으로 로그인
3. **개발자 등록비 $25** 결제 (1회성)
4. 개발자 정보 입력

### 4-2. 새 앱 만들기

1. **"앱 만들기"** 클릭
2. 설정:
   - **앱 이름**: `Pixdap - AI Image Generator`
   - **기본 언어**: 영어 (미국) — 또는 한국어
   - **앱 또는 게임**: 앱
   - **무료 또는 유료**: 무료
3. 선언사항 체크 후 **"앱 만들기"**

### 4-3. 앱 정보 입력

**스토어 등록정보:**
- **간단한 설명** (80자):
  ```
  Create stunning AI images in seconds. Free to start! 🎨
  ```
- **자세한 설명** (4000자):
  ```
  Pixdap is the easiest way to create beautiful AI-generated images.

  ✨ KEY FEATURES
  • 8+ art styles: Ghibli, Anime, Realistic, Pixel Art, Cyberpunk & more
  • Lightning fast: Generate images in 5-15 seconds
  • Free credits: Get 5 free credits on signup
  • Watch ads for more: Earn credits by watching short videos
  • Download & share: Save images or share directly to social media
  • Multi-language: English & Korean support

  🎁 HOW IT WORKS
  1. Sign in with Google
  2. Type what you want to see
  3. Pick an art style
  4. Watch AI create your image!

  💎 CREDITS SYSTEM
  • 5 free credits on signup
  • Watch a short ad = 1 credit
  • Invite friends = 3 bonus credits each
  • Premium: $4.99/month for 200 credits + no ads

  Powered by Google Gemini AI.
  ```

**그래픽:**
- **앱 아이콘**: 512×512 PNG (32비트, 알파 채널 포함)
- **기능 그래픽**: 1024×500 PNG (Canva에서 제작)
- **스크린샷**: 최소 2장 (폰 스크린샷 도구로 캡처)
  - 권장: 16:9 비율, 1920×1080 또는 1080×1920
  - 화면: 랜딩, 생성 중, 결과, 갤러리

스크린샷 도구:
- https://screenshots.pro (무료)
- 또는 Chrome DevTools → Device Mode → 스크린샷

### 4-4. 콘텐츠 등급

1. **앱 콘텐츠** → **콘텐츠 등급** → **설문 시작**
2. 카테고리: **유틸리티/생산성**
3. 대부분 "아니오" 선택 (폭력, 성적 콘텐츠 없음)
4. 등급 확인 → **적용**

### 4-5. 타겟 잠재고객

1. **타겟 연령**: 13세 이상 (광고 포함이므로)
2. **어린이용 앱 아님**: "아니요" 선택
3. **광고 포함**: "예" 선택

### 4-6. 개인정보처리방침

Play Store에는 개인정보처리방침 URL이 필수입니다.

URL: `https://pixdap.vercel.app/privacy`

(아래 파일 5에서 페이지를 만들 예정)

### 4-7. AAB 업로드

1. **프로덕션** → **새 버전 만들기**
2. **App Bundle** → PWABuilder에서 다운로드한 `app-release-signed.aab` 업로드
3. **출시 이름**: `1.0.0`
4. **출시 노트**:
   ```
   Initial release of Pixdap - AI Image Generator
   • Generate AI images with 8+ art styles
   • Free credits on signup
   • Watch ads for more credits
   ```
5. **검토 제출**

### 4-8. 심사

- 보통 **1~7일** 소요
- 거부 시 이유를 확인하고 수정 후 재제출
- 흔한 거부 사유:
  - 개인정보처리방침 누락 → `/privacy` 페이지 확인
  - 스크린샷 부족 → 최소 2장
  - 앱 설명 부족 → 상세하게 작성

---

## 5단계: 출시 후 체크리스트

- [ ] Play Store에서 앱 검색 가능
- [ ] 앱 설치 및 실행 정상
- [ ] Google 로그인 작동
- [ ] 이미지 생성 작동
- [ ] 광고 → 크레딧 지급 정상
- [ ] 공유 기능 작동

---

## 업데이트 방법

앱을 업데이트하려면:

1. 코드 수정 → GitHub 푸시 → Vercel 자동 배포
2. PWA 웹앱은 자동으로 업데이트됨
3. Play Store AAB는 큰 변경(아이콘, 권한 등)이 있을 때만 재업로드

PWA의 장점: **웹 코드만 수정하면 앱도 자동 업데이트!**
