import type { Dictionary } from './type';

const ko: Dictionary = {
  subtitle: '개발자를 위한 AI 네이밍 도우미',
  form: {
    contextLabel: '어떤 역할을 하나요?',
    contextPlaceholder: '예: 서버에서 사용자 프로필 데이터를 가져와요',
    roleLabel: '어디에 쓸 이름인가요?',
    caseLabel: '표기법',
    generate: '이름 생성하기 ✨',
    generating: '생성 중...',
  },
  roles: {
    variable: '변수',
    function: '함수',
    component: '컴포넌트 (React/Vue 등)',
    class: '클래스',
    hook: 'React 훅',
    file: '파일 이름',
    directory: '폴더 이름',
  },
  results: {
    count: (count) => `결과 ${count}개`,
    clearAll: '전체 지우기',
    clearConfirm: '생성한 이름을 모두 지울까요?',
    loading: '딱 맞는 이름을 짓는 중...',
    empty: '생성한 이름이 여기에 쌓여요.',
  },
  card: {
    reuse: '↺ 다시 쓰기',
    reuseTitle: '이 입력값으로 폼을 채워요',
    close: '닫기',
    copy: '복사',
    copied: '복사됨 ✓',
    copyLabel: (name) => `${name} 복사`,
    removeLabel: (name) => `${name} 삭제`,
    removeTitle: '이 이름 삭제',
  },
  errors: {
    quotaExceeded: '지금은 무료 사용량을 모두 썼어요. 잠시 후 다시 시도해 주세요.',
    busy: 'AI 서비스가 붐비고 있어요. 잠시 후 다시 시도해 주세요.',
    unknown: '이름을 만드는 중에 문제가 생겼어요. 다시 시도해 주세요.',
  },
  settings: {
    open: '설정',
    theme: '테마',
    light: '라이트',
    dark: '다크',
    system: '시스템',
    language: '언어',
    browserLanguage: '브라우저',
  },
};

export default ko;
