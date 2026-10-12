# Name Tailor

개발자를 위한 AI 네이밍 도우미예요. 변수, 함수, 컴포넌트가 하는 일을 적으면 원하는 표기법에 맞는 이름 3개와 각 이름을 추천하는 이유를 알려 줘요.

🔗 https://name-tailor.vercel.app

## 주요 기능

- **이름 추천**: 설명, 용도(변수·함수·컴포넌트·훅 등), 표기법(camelCase·PascalCase·snake_case 등)을 고르면 이름 3개를 추천해요.
- **결과 카드**: 생성할 때마다 결과가 카드로 맨 위에 쌓여요. 새로고침해도 남아 있어요.
  - 이름 복사
  - 카드의 입력값으로 폼 다시 채우기(다시 쓰기)
  - 이름 하나씩 삭제, 카드 닫기, 전체 지우기
- **한 화면 레이아웃**: 데스크톱에서는 페이지 스크롤 없이 왼쪽에 입력 폼, 오른쪽에 결과가 있어요. 결과 영역만 스크롤돼요. 모바일에서는 세로로 쌓여요.
- **설정 메뉴(⚙️)**
  - 테마: 라이트 / 다크 / 시스템
  - 언어: 한국어 / English / 브라우저 언어
  - 이름 설명은 처음부터 한국어와 영어로 함께 받아 두기 때문에 언어를 바꾸면 바로 바뀌어요.

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| 스타일 | SCSS Modules |
| 상태 관리 | Zustand (입력값, 결과 카드 · localStorage 저장) |
| 서버 요청 | TanStack Query |
| AI | Google Gemini API (`@google/genai`) |
| 배포 | Vercel |

## 시작하기

### 1. 준비물

- Node.js 20.9 이상
- Gemini API 키: [Google AI Studio](https://aistudio.google.com/apikey)에서 무료로 발급받을 수 있어요. 결제(billing)를 연결하지 않으면 무료 한도를 넘어도 요금이 나가지 않아요.

### 2. 설치와 실행

```bash
npm install
cp .env.example .env.local   # GEMINI_API_KEY에 발급받은 키를 넣어 주세요
npm run dev
```

http://localhost:3000 에서 확인할 수 있어요.

### 3. 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 운영용 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint 검사 |

### 환경 변수

| 이름 | 설명 |
| --- | --- |
| `GEMINI_API_KEY` | Gemini API 키 (필수). Vercel에서는 Settings → Environment Variables의 **Production** 환경에 등록해야 해요. |

## 폴더 구조

역할 기준으로 폴더를 나누고, 컴포넌트는 폴더 하나에 `index.tsx`, `style.module.scss`, `type.ts`, `constant.ts`를 함께 둬요.

```
src/
├── app/                  # Next.js 라우팅 전용 (page.tsx는 views/Home을 내보내기만 해요)
│   ├── layout.tsx        # 쿠키에서 테마·언어를 읽어 첫 화면부터 적용
│   ├── page.tsx
│   └── api/generate/     # 이름 생성 API (요청 검사와 오류 응답)
├── views/Home/           # 메인 화면 레이아웃
├── components/
│   ├── NameForm/         # 입력 폼
│   ├── ResultPanel/      # 결과 카드 목록 (스크롤 영역)
│   ├── ResultCard/       # 결과 카드 한 장
│   └── SettingsMenu/     # 테마·언어 설정 메뉴
├── services/gemini/      # Gemini 호출 (재시도, 대체 모델, 제한 시간)
├── hooks/                # useGenerateNames, useTranslation
├── store/useNameStore/   # Zustand 스토어
├── providers/            # TanStack Query, 테마·언어 설정
├── locales/              # 한국어·영어 화면 문구
├── constants/            # 용도·표기법 선택지
├── types/                # 공용 타입
└── styles/               # 전역 스타일, SCSS 믹스인
```

## Gemini 호출 방식

무료 한도와 일시적인 서버 혼잡에 대비해 이렇게 동작해요. 설정 값은 `src/services/gemini/constant.ts`에 있어요.

1. 기본 모델은 `gemini-3.5-flash-lite`이고, 실패하면 `gemini-3.8-flash`로 넘어가요. 무료 한도는 모델마다 따로 있어요.
2. 모델이 붐비면(503) 2초, 4초 간격으로 최대 2번 다시 시도해요.
3. 요청 하나당 제한 시간은 15초예요. 시간을 넘기거나 한도를 넘기면(429) 같은 모델로 다시 시도하지 않고 바로 다음 모델로 넘어가요.
4. 응답은 JSON 형식으로 받도록 지정해서 항상 이름 3개와 한국어·영어 설명이 함께 와요.

모든 모델이 실패하면 화면에 원인에 맞는 안내(한도 초과, 서비스 혼잡, 기타 오류)를 보여줘요. 무료 한도는 매일 한국 시간 오후 4~5시쯤(미국 태평양 시간 자정) 리셋돼요.
