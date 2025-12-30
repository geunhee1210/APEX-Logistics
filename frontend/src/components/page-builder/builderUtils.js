// 고유 ID 생성
export const generateId = () => {
  return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 기본 컴포넌트 정의
export const defaultComponents = {
  hero: {
    name: '히어로 섹션',
    icon: '🎯',
    category: '섹션',
    defaultProps: {
      title: '환영합니다!',
      subtitle: '여기에 멋진 소개 문구를 입력하세요',
      buttonText: '시작하기',
      buttonLink: '#',
      backgroundType: 'gradient',
      backgroundColor: '#1a1a2e',
      backgroundGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      backgroundImage: '',
      textColor: '#ffffff',
      alignment: 'center',
      height: 'large'
    }
  },
  text: {
    name: '텍스트 블록',
    icon: '📝',
    category: '기본',
    defaultProps: {
      content: '<p>여기에 텍스트를 입력하세요. 이 블록은 자유롭게 편집할 수 있습니다.</p>',
      fontSize: 'medium',
      textAlign: 'left',
      textColor: '#ffffff',
      backgroundColor: 'transparent',
      padding: 'medium'
    }
  },
  heading: {
    name: '제목',
    icon: '📌',
    category: '기본',
    defaultProps: {
      text: '제목을 입력하세요',
      level: 'h2',
      textAlign: 'left',
      textColor: '#ffffff',
      fontSize: 'xlarge'
    }
  },
  image: {
    name: '이미지',
    icon: '🖼️',
    category: '미디어',
    defaultProps: {
      src: 'https://via.placeholder.com/800x400',
      alt: '이미지 설명',
      width: '100%',
      height: 'auto',
      borderRadius: '8px',
      objectFit: 'cover',
      caption: ''
    }
  },
  button: {
    name: '버튼',
    icon: '🔘',
    category: '기본',
    defaultProps: {
      text: '버튼',
      link: '#',
      variant: 'primary',
      size: 'medium',
      alignment: 'left',
      fullWidth: false
    }
  },
  spacer: {
    name: '여백',
    icon: '↕️',
    category: '레이아웃',
    defaultProps: {
      height: '40px'
    }
  },
  divider: {
    name: '구분선',
    icon: '➖',
    category: '레이아웃',
    defaultProps: {
      color: '#333',
      thickness: '1px',
      style: 'solid',
      width: '100%'
    }
  },
  cards: {
    name: '카드 그리드',
    icon: '🃏',
    category: '섹션',
    defaultProps: {
      title: '서비스 소개',
      columns: 3,
      gap: '24px',
      cards: [
        { title: '기능 1', description: '첫 번째 기능에 대한 설명입니다.', icon: '⭐' },
        { title: '기능 2', description: '두 번째 기능에 대한 설명입니다.', icon: '🚀' },
        { title: '기능 3', description: '세 번째 기능에 대한 설명입니다.', icon: '💡' }
      ]
    }
  },
  features: {
    name: '기능 목록',
    icon: '✨',
    category: '섹션',
    defaultProps: {
      title: '주요 기능',
      subtitle: '우리 서비스의 핵심 기능들을 소개합니다',
      layout: 'grid',
      features: [
        { icon: '🎯', title: '정확한 매칭', description: '최적의 파트너를 찾아드립니다' },
        { icon: '🔒', title: '안전한 거래', description: '안전한 결제 시스템을 제공합니다' },
        { icon: '💬', title: '24시간 지원', description: '언제든 도움을 받으실 수 있습니다' },
        { icon: '📊', title: '실시간 현황', description: '모든 정보를 실시간으로 확인하세요' }
      ]
    }
  },
  pricing: {
    name: '요금제 표',
    icon: '💰',
    category: '섹션',
    defaultProps: {
      title: '요금제',
      subtitle: '나에게 맞는 플랜을 선택하세요',
      plans: [
        { 
          name: 'Basic', 
          price: '9,900', 
          period: '월', 
          features: ['기능 1', '기능 2', '기능 3'],
          highlighted: false,
          buttonText: '시작하기'
        },
        { 
          name: 'Standard', 
          price: '19,900', 
          period: '월', 
          features: ['기능 1', '기능 2', '기능 3', '기능 4', '기능 5'],
          highlighted: true,
          buttonText: '시작하기'
        },
        { 
          name: 'Premium', 
          price: '39,900', 
          period: '월', 
          features: ['모든 기능', '우선 지원', 'VIP 혜택'],
          highlighted: false,
          buttonText: '시작하기'
        }
      ]
    }
  },
  testimonials: {
    name: '후기/리뷰',
    icon: '💬',
    category: '섹션',
    defaultProps: {
      title: '고객 후기',
      reviews: [
        { name: '김철수', role: '개발자', content: '정말 좋은 서비스입니다!', avatar: '', rating: 5 },
        { name: '이영희', role: '디자이너', content: '사용하기 편리해요.', avatar: '', rating: 5 },
        { name: '박지민', role: '마케터', content: '추천합니다!', avatar: '', rating: 4 }
      ]
    }
  },
  faq: {
    name: 'FAQ',
    icon: '❓',
    category: '섹션',
    defaultProps: {
      title: '자주 묻는 질문',
      items: [
        { question: '질문 1입니다.', answer: '답변 1입니다.' },
        { question: '질문 2입니다.', answer: '답변 2입니다.' },
        { question: '질문 3입니다.', answer: '답변 3입니다.' }
      ]
    }
  },
  cta: {
    name: 'CTA 섹션',
    icon: '📢',
    category: '섹션',
    defaultProps: {
      title: '지금 시작하세요!',
      subtitle: '무료로 시작하고, 언제든 업그레이드하세요.',
      buttonText: '무료 시작',
      buttonLink: '/register',
      backgroundColor: '#E50914',
      textColor: '#ffffff'
    }
  },
  video: {
    name: '비디오',
    icon: '🎬',
    category: '미디어',
    defaultProps: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: '소개 영상',
      aspectRatio: '16:9',
      autoplay: false
    }
  },
  gallery: {
    name: '갤러리',
    icon: '🖼️',
    category: '미디어',
    defaultProps: {
      images: [
        { src: 'https://via.placeholder.com/400x300', alt: '이미지 1' },
        { src: 'https://via.placeholder.com/400x300', alt: '이미지 2' },
        { src: 'https://via.placeholder.com/400x300', alt: '이미지 3' },
        { src: 'https://via.placeholder.com/400x300', alt: '이미지 4' }
      ],
      columns: 2,
      gap: '16px'
    }
  },
  contact: {
    name: '연락처/문의',
    icon: '📧',
    category: '폼',
    defaultProps: {
      title: '문의하기',
      subtitle: '궁금한 점이 있으시면 언제든 문의해주세요.',
      fields: ['name', 'email', 'message'],
      buttonText: '보내기'
    }
  },
  newsletter: {
    name: '뉴스레터',
    icon: '📬',
    category: '폼',
    defaultProps: {
      title: '뉴스레터 구독',
      subtitle: '최신 소식을 받아보세요',
      buttonText: '구독하기',
      placeholder: '이메일 주소 입력'
    }
  },
  social: {
    name: '소셜 링크',
    icon: '🔗',
    category: '기본',
    defaultProps: {
      links: [
        { platform: 'instagram', url: '#' },
        { platform: 'youtube', url: '#' },
        { platform: 'twitter', url: '#' }
      ],
      alignment: 'center',
      size: 'medium'
    }
  },
  html: {
    name: 'HTML 코드',
    icon: '💻',
    category: '고급',
    defaultProps: {
      code: '<div style="padding: 20px; background: #333; border-radius: 8px;"><p>커스텀 HTML 코드</p></div>'
    }
  }
};

// 컴포넌트 카테고리
export const componentCategories = [
  { id: 'section', name: '섹션', icon: '📦' },
  { id: 'basic', name: '기본', icon: '📝' },
  { id: 'media', name: '미디어', icon: '🖼️' },
  { id: 'layout', name: '레이아웃', icon: '📐' },
  { id: 'form', name: '폼', icon: '📋' },
  { id: 'advanced', name: '고급', icon: '⚙️' }
];

// 컴포넌트를 카테고리별로 그룹화
export const getComponentsByCategory = () => {
  const grouped = {};
  
  Object.entries(defaultComponents).forEach(([key, comp]) => {
    const category = comp.category.toLowerCase();
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push({ key, ...comp });
  });
  
  return grouped;
};

