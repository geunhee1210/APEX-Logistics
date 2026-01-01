const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// uuid 대신 Node.js 내장 함수 사용
const uuidv4 = () => crypto.randomUUID();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'apex-logistics-secret-key-2024';

// ============== 미들웨어 ==============
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// ============== 인메모리 데이터베이스 ==============
const db = {
  // 홈페이지 설정 (편집 가능)
  homepageSettings: {
    heroSlides: [
      {
        id: 'slide-1',
        title: 'Beyond Logistics, Business Partner',
        subtitle: '단순한 물류를 넘어, 비즈니스의 성장을 함께하는 파트너',
        gradient: 'linear-gradient(135deg, #0A192F 0%, #172A45 100%)',
        ctaText: '서비스 둘러보기',
        ctaLink: '/services'
      },
      {
        id: 'slide-2',
        title: '대기업 전문 통합 물류 솔루션',
        subtitle: '이커머스 풀필먼트, B2B 물류, 글로벌 물류까지',
        gradient: 'linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)',
        ctaText: '견적 문의',
        ctaLink: '/pricing'
      },
      {
        id: 'slide-3',
        title: '28개국 글로벌 네트워크',
        subtitle: '세계 어디든 안전하고 빠른 물류 서비스',
        gradient: 'linear-gradient(135deg, #172A45 0%, #213B5C 100%)',
        ctaText: '자세히 보기',
        ctaLink: '/services/global'
      }
    ],
    features: [
      { id: 'feat-1', icon: 'Shield', title: '안전한 물류', desc: '철저한 품질 관리와 안전한 보관 시스템' },
      { id: 'feat-2', icon: 'Zap', title: '당일 출고', desc: '오후 3시 마감, 당일 출고 보장' },
      { id: 'feat-3', icon: 'Globe', title: '글로벌 네트워크', desc: '28개국 해외 배송 네트워크' },
      { id: 'feat-4', icon: 'BarChart', title: '실시간 관리', desc: 'WMS/TMS를 통한 실시간 물류 현황 파악' }
    ],
    pricingPreview: {
      title: '맞춤형 물류 견적',
      subtitle: '비즈니스에 최적화된 물류 솔루션을 제안합니다',
      benefits: ['초기 비용 없음', '유연한 계약 조건', '전담 매니저 배정'],
      cards: [
        { id: 'price-1', service: '이커머스 풀필먼트', original: '', sale: '건당 ₩1,500~', discount: '' },
        { id: 'price-2', service: 'B2B 물류', original: '', sale: '맞춤 견적', discount: '', featured: true },
        { id: 'price-3', service: '글로벌 물류', original: '', sale: 'CBM 기준', discount: '' }
      ]
    },
    cta: {
      title: '물류 혁신, 지금 시작하세요',
      subtitle: '전문 컨설턴트가 최적의 솔루션을 제안해드립니다',
      buttonText: '무료 상담 신청',
      buttonLink: '/pricing'
    },
    sectionTitles: {
      servicesSection: '통합 물류 서비스',
      featuresSection: '왜 APEX Logistics인가요?',
      featuresSubtitle: '20년 물류 노하우로 비즈니스 성장을 지원합니다'
    },
    // 고객 후기 섹션
    testimonials: {
      title: '고객사의 생생한 후기',
      subtitle: 'APEX Logistics와 함께 성장하는 파트너사',
      totalReviews: 500,
      averageRating: 5,
      reviews: [
        {
          id: 'review-1',
          name: '김대표',
          rating: 5,
          content: '이커머스 물류를 맡긴 후 출고 정확도가 99.9%로 올랐습니다. 고객 클레임이 확 줄었어요.',
          avatar: '👨‍💼',
          company: 'A패션몰',
          date: '2025-01-10'
        },
        {
          id: 'review-2',
          name: '이물류팀장',
          rating: 5,
          content: 'B2B 물류 아웃소싱 후 물류 비용을 30% 절감했습니다. 전담 매니저 대응도 빠르고 좋습니다.',
          avatar: '👩‍💼',
          company: 'B전자',
          date: '2025-01-05'
        },
        {
          id: 'review-3',
          name: '박사업부장',
          rating: 5,
          content: '글로벌 물류 서비스 덕분에 해외 시장 진출이 수월해졌습니다. 통관 대행까지 원스톱으로 해결!',
          avatar: '🧑‍💼',
          company: 'C화장품',
          date: '2024-12-28'
        },
        {
          id: 'review-4',
          name: '최운영이사',
          rating: 5,
          content: 'WMS 시스템 연동이 빠르고 실시간 재고 파악이 가능해서 운영 효율이 크게 개선됐습니다.',
          avatar: '👨‍💻',
          company: 'D유통',
          date: '2024-12-20'
        }
      ]
    }
  },

  // 페이지 빌더 데이터
  pages: [
    {
      id: 'home',
      name: '홈페이지',
      slug: '/',
      components: [],
      isPublished: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'about',
      name: '소개 페이지',
      slug: '/about',
      components: [],
      isPublished: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],

  // 사용자 테이블
  users: [
    {
      id: 'admin-001',
      email: 'admin@apexlogistics.kr',
      password: '$2b$10$2Iiq23b4Dan6RuF50vsOMuUh/PLTB0tzaX48dQOPUtQ7CkpAnAmJW', // password
      name: '관리자',
      role: 'admin',
      phone: '010-1234-5678',
      status: 'active',
      subscription: null,
      createdAt: '2024-01-01T00:00:00.000Z',
      lastLoginAt: null
    }
  ],
  
  // 물류 서비스 테이블
  logisticsServices: [
    { id: 'ecommerce', name: '이커머스 풀필먼트', logo: '📦', category: '풀필먼트', color: '#2563eb', description: '입고부터 출고까지 원스톱 이커머스 물류 서비스' },
    { id: 'b2b', name: 'B2B 물류', logo: '🏢', category: 'B2B', color: '#0891b2', description: '대기업 맞춤형 공급망 물류 솔루션' },
    { id: 'global', name: '글로벌 물류', logo: '🌍', category: '글로벌', color: '#7c3aed', description: '28개국 글로벌 네트워크 크로스보더 물류' },
    { id: 'coldchain', name: '콜드체인', logo: '❄️', category: '특수물류', color: '#0d9488', description: '신선식품 및 의약품 온도 관리 물류' },
    { id: 'transport', name: '화물 운송', logo: '🚛', category: '운송', color: '#ea580c', description: '전국 네트워크 통합 화물 운송' },
    { id: 'it-solution', name: '물류 IT 솔루션', logo: '💻', category: 'IT', color: '#4f46e5', description: 'WMS/TMS/OMS 통합 물류 시스템' }
  ],
  // ottServices 호환성 유지 (기존 API 호출 지원)
  ottServices: [],
  
  // 물류 서비스 플랜 (견적 기반)
  plans: [
    { id: 'starter', name: 'Starter', price: 0, features: ['월 500건 이하', '기본 WMS 제공', '이메일 지원', '표준 포장'], maxVolume: 500 },
    { id: 'growth', name: 'Growth', price: 0, features: ['월 5,000건 이하', '고급 WMS 제공', '전담 매니저', '맞춤 포장', 'API 연동'], maxVolume: 5000, popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 0, features: ['무제한 물량', '프리미엄 WMS', '24/7 전담 지원', '맞춤 솔루션', '글로벌 배송'], maxVolume: 999999 }
  ],
  
  // 게시판
  posts: [
    {
      id: 'post-001',
      title: '[공지] APEX Logistics 홈페이지 오픈 안내',
      content: '안녕하세요, APEX Logistics입니다.\n\n대기업 전문 통합 물류 솔루션 파트너, APEX Logistics의 새로운 홈페이지가 오픈되었습니다.\n\n저희는 이커머스 풀필먼트, B2B 물류, 글로벌 물류, 콜드체인 등 다양한 물류 서비스를 제공하고 있습니다.\n\n물류에 관한 문의사항은 언제든지 연락 주시기 바랍니다.\n\n감사합니다.',
      category: 'notice',
      authorId: 'admin-001',
      authorName: '관리자',
      views: 342,
      createdAt: '2025-01-02T09:00:00.000Z',
      updatedAt: '2025-01-02T09:00:00.000Z'
    },
    {
      id: 'post-002',
      title: '[공지] 2025년 설 연휴 배송 일정 안내',
      content: '안녕하세요, APEX Logistics입니다.\n\n2025년 설 연휴 기간 배송 일정을 안내드립니다.\n\n■ 연휴 기간: 1월 28일(화) ~ 1월 30일(목)\n■ 정상 운영: 1월 31일(금)부터\n\n연휴 기간 중 입고된 물량은 1월 31일부터 순차적으로 출고 처리됩니다.\n\n원활한 배송을 위해 1월 27일(월) 오후 2시까지 출고 요청 부탁드립니다.\n\n감사합니다.',
      category: 'notice',
      authorId: 'admin-001',
      authorName: '관리자',
      views: 567,
      createdAt: '2025-01-15T10:00:00.000Z',
      updatedAt: '2025-01-15T10:00:00.000Z'
    },
    {
      id: 'post-003',
      title: '[업데이트] WMS 시스템 업데이트 안내 (v3.2.1)',
      content: '안녕하세요, APEX Logistics입니다.\n\n물류관리시스템(WMS) 업데이트를 안내드립니다.\n\n■ 업데이트 일시: 2025년 1월 20일(월) 02:00~06:00\n■ 주요 변경사항:\n  - 실시간 재고 조회 속도 개선\n  - 배송 추적 UI 개선\n  - 반품 처리 프로세스 자동화\n  - API 연동 안정성 향상\n\n업데이트 시간 동안 일시적으로 시스템 접속이 제한될 수 있습니다.\n\n양해 부탁드립니다.',
      category: 'notice',
      authorId: 'admin-001',
      authorName: '관리자',
      views: 234,
      createdAt: '2025-01-20T14:00:00.000Z',
      updatedAt: '2025-01-20T14:00:00.000Z'
    },
    {
      id: 'post-004',
      title: '[안내] 김포 물류센터 확장 이전 안내',
      content: '안녕하세요, APEX Logistics입니다.\n\n김포 물류센터가 더 넓은 공간으로 확장 이전합니다.\n\n■ 이전 일시: 2025년 2월 1일(토)\n■ 신규 주소: 경기도 김포시 대곶면 물류로 123\n■ 확장 규모: 기존 대비 2배 (약 50,000평)\n\n확장 이전으로 더욱 빠르고 정확한 물류 서비스를 제공하겠습니다.\n\n감사합니다.',
      category: 'notice',
      authorId: 'admin-001',
      authorName: '관리자',
      views: 445,
      createdAt: '2025-01-25T09:00:00.000Z',
      updatedAt: '2025-01-25T09:00:00.000Z'
    }
  ],
  
  // 댓글
  comments: [
    {
      id: 'comment-001',
      postId: 'post-002',
      content: '설 연휴 배송 일정 안내 감사합니다. 미리 준비하겠습니다.',
      authorId: 'admin-001',
      authorName: '고객사A',
      createdAt: '2025-01-16T10:00:00.000Z',
      updatedAt: '2025-01-16T10:00:00.000Z'
    },
    {
      id: 'comment-002',
      postId: 'post-003',
      content: 'WMS 업데이트 후 재고 조회가 훨씬 빨라졌네요. 감사합니다!',
      authorId: 'admin-001',
      authorName: '고객사B',
      createdAt: '2025-01-21T09:30:00.000Z',
      updatedAt: '2025-01-21T09:30:00.000Z'
    }
  ],
  
  // 파티 (공유 그룹)
  parties: [],
  
  // 활동 로그
  activityLogs: [],
  
  // 비주얼 에디터 데이터 (페이지별)
  visualEditorData: {
    home: {
      elements: [],
      settings: {
        canvasWidth: '100%',
        canvasHeight: 800
      },
      lastUpdated: null,
      updatedBy: null
    }
  }
};

// ============== 유틸리티 함수 ==============
const logActivity = (userId, action, details) => {
  db.activityLogs.push({
    id: uuidv4(),
    userId,
    action,
    details,
    timestamp: new Date().toISOString()
  });
};

// ============== JWT 미들웨어 ==============
// 개발 환경용 토큰
const DEV_ADMIN_TOKEN = 'dev-admin-token-for-local-development';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: '인증이 필요합니다.' });
  }
  
  // 개발 환경용 토큰 처리
  if (token === DEV_ADMIN_TOKEN) {
    req.user = {
      id: 'dev-admin-001',
      email: 'admin@apexlogistics.kr',
      role: 'admin',
      name: '관리자'
    };
    return next();
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: '토큰이 만료되었거나 유효하지 않습니다.' });
    }
    req.user = user;
    next();
  });
};

// 선택적 인증 (로그인 안해도 되지만, 로그인하면 사용자 정보 제공)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) req.user = user;
    });
  }
  next();
};

// 관리자 권한 확인
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: '관리자 권한이 필요합니다.' });
  }
  next();
};

// ============== 인증 API ==============
// 회원가입
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: '필수 정보를 입력해주세요.' });
  }
  
  // 이메일 중복 확인
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: '이미 사용 중인 이메일입니다.' });
  }
  
  // 비밀번호 해시화
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    name,
      role: 'user',
    phone: phone || '',
    status: 'active',
      subscription: null,
    createdAt: new Date().toISOString(),
      lastLoginAt: null
  };
  
  db.users.push(newUser);
  logActivity(newUser.id, 'REGISTER', { email });
  
  // JWT 토큰 생성
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    success: true,
    message: '회원가입이 완료되었습니다.',
    token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
  });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 로그인
app.post('/api/auth/login', async (req, res) => {
  try {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: '이메일과 비밀번호를 입력해주세요.' });
  }
  
  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }
  
  if (user.status === 'inactive') {
    return res.status(403).json({ success: false, message: '비활성화된 계정입니다. 관리자에게 문의하세요.' });
  }
  
  // 마지막 로그인 시간 업데이트
  user.lastLoginAt = new Date().toISOString();
  logActivity(user.id, 'LOGIN', { email });
  
  const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    success: true,
    message: '로그인 성공',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
        phone: user.phone,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 현재 사용자 정보
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
  }
  
  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      subscription: user.subscription,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    }
  });
});

// 프로필 수정
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
  const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }
    
    const { name, phone, currentPassword, newPassword } = req.body;
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    // 비밀번호 변경
    if (currentPassword && newPassword) {
  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (!validPassword) {
    return res.status(400).json({ success: false, message: '현재 비밀번호가 올바르지 않습니다.' });
  }
  user.password = await bcrypt.hash(newPassword, 10);
    }
    
    logActivity(user.id, 'PROFILE_UPDATE', {});
    
    res.json({
      success: true,
      message: '프로필이 수정되었습니다.',
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone }
    });
  } catch (error) {
    console.error('프로필 수정 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// ============== OTT 서비스 API ==============
// OTT 서비스 목록
app.get('/api/ott', (req, res) => {
  const { category, search } = req.query;
  let services = [...db.ottServices];
  
  if (category && category !== 'all') {
    services = services.filter(s => s.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    services = services.filter(s => 
      s.name.toLowerCase().includes(searchLower) ||
      s.description.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({ success: true, services });
});

// OTT 서비스 상세
app.get('/api/ott/:id', (req, res) => {
  const service = db.ottServices.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'OTT 서비스를 찾을 수 없습니다.' });
  }
  res.json({ success: true, service });
});

// ============== 구독 플랜 API ==============
app.get('/api/plans', (req, res) => {
  res.json({ success: true, plans: db.plans });
});

// 구독 신청
app.post('/api/subscription', authenticateToken, (req, res) => {
  const { planId } = req.body;
  const user = db.users.find(u => u.id === req.user.id);
  const plan = db.plans.find(p => p.id === planId);
  
  if (!plan) {
    return res.status(404).json({ success: false, message: '요금제를 찾을 수 없습니다.' });
  }
  
  user.subscription = {
    planId,
    planName: plan.name,
    price: plan.price,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  logActivity(user.id, 'SUBSCRIPTION', { planId });
  
  res.json({
    success: true,
    message: `${plan.name} 플랜 구독이 완료되었습니다.`,
    subscription: user.subscription
  });
});

// ============== 결제 API ==============
// 결제 승인 요청 (토스페이먼츠)
app.post('/api/payment/confirm', authenticateToken, async (req, res) => {
  try {
    const { paymentKey, orderId, amount } = req.body;
    const user = db.users.find(u => u.id === req.user.id);
    
    if (!paymentKey || !orderId || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: '결제 정보가 올바르지 않습니다.' 
      });
    }

    // 토스페이먼츠 시크릿 키
    const tossSecretKey = process.env.TOSS_SECRET_KEY || 'test_sk_AQ92ymxN34Y7NI7nkaavVajRKXvd';
    
    // 토스페이먼츠 결제 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(tossSecretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount
      })
    });

    const paymentData = await response.json();
    
    if (!response.ok) {
      console.error('토스페이먼츠 결제 실패:', paymentData);
      return res.status(400).json({
        success: false,
        message: paymentData.message || '결제 승인에 실패했습니다.'
      });
    }

    console.log('토스페이먼츠 결제 성공:', paymentData);
    
    // 결제 성공 처리
    const planId = orderId.split('_')[0]; // orderId에서 planId 추출
    const plan = db.plans.find(p => p.id === planId);
    
    if (!plan) {
      return res.status(404).json({ 
        success: false, 
        message: '요금제를 찾을 수 없습니다.' 
      });
    }

    // 구독 정보 업데이트
    user.subscription = {
      planId,
      planName: plan.name,
      price: plan.price,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentKey,
      orderId,
      paymentDate: new Date().toISOString()
    };
    
    logActivity(user.id, 'PAYMENT_SUCCESS', { planId, orderId, amount });
    
    res.json({
      success: true,
      message: '결제가 완료되었습니다.',
      payment: {
        orderId,
        amount,
        status: 'DONE'
      },
      subscription: user.subscription
    });
  } catch (error) {
    console.error('결제 승인 오류:', error);
    res.status(500).json({
      success: false,
      message: '결제 처리 중 오류가 발생했습니다.'
    });
  }
});

// 결제 취소 요청
app.post('/api/payment/cancel', authenticateToken, async (req, res) => {
  try {
    const { paymentKey, cancelReason } = req.body;
    const user = db.users.find(u => u.id === req.user.id);
    
    if (!user.subscription || !user.subscription.paymentKey) {
      return res.status(400).json({
        success: false,
        message: '취소할 결제 정보가 없습니다.'
      });
    }

    // 실제 연동 시 토스페이먼츠 취소 API 호출
    // 테스트 모드에서는 구독 정보만 제거
    user.subscription = null;
    
    logActivity(user.id, 'PAYMENT_CANCEL', { paymentKey, cancelReason });
    
    res.json({
      success: true,
      message: '결제가 취소되었습니다.'
    });
  } catch (error) {
    console.error('결제 취소 오류:', error);
    res.status(500).json({
      success: false,
      message: '결제 취소 중 오류가 발생했습니다.'
    });
  }
});

// ============== 게시판 API ==============
// 게시물 목록
app.get('/api/posts', optionalAuth, (req, res) => {
  const { category, page = 1, limit = 10, search } = req.query;
  let posts = [...db.posts];
  
  // 카테고리 필터링
  if (category && category !== 'all') {
    posts = posts.filter(p => p.category === category);
  }
  
  // 검색
  if (search) {
    const searchLower = search.toLowerCase();
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.content.toLowerCase().includes(searchLower)
    );
  }
  
  // 최신순 정렬
  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // 페이지네이션
  const total = posts.length;
  const startIndex = (page - 1) * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + parseInt(limit));
  
  // 댓글 수 추가
  const postsWithCommentCount = paginatedPosts.map(post => ({
    ...post,
    commentCount: db.comments.filter(c => c.postId === post.id).length
  }));
  
  res.json({
    success: true,
    posts: postsWithCommentCount,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

// 게시물 상세
app.get('/api/posts/:id', optionalAuth, (req, res) => {
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
  }
  
  // 조회수 증가
  post.views++;
  
  // 댓글 가져오기
  const comments = db.comments
    .filter(c => c.postId === post.id)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  res.json({
    success: true,
    post: { ...post, comments }
  });
});

// 게시물 작성
app.post('/api/posts', authenticateToken, (req, res) => {
  const { title, content, category } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ success: false, message: '제목과 내용을 입력해주세요.' });
  }
  
  const newPost = {
    id: uuidv4(),
    title,
    content,
    category: category || 'free',
    authorId: req.user.id,
    authorName: req.user.name,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.posts.push(newPost);
  logActivity(req.user.id, 'POST_CREATE', { postId: newPost.id });
  
  res.json({ success: true, message: '게시물이 작성되었습니다.', post: newPost });
});

// 게시물 수정
app.put('/api/posts/:id', authenticateToken, (req, res) => {
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
  }
  
  // 작성자 또는 관리자만 수정 가능
  if (post.authorId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: '수정 권한이 없습니다.' });
  }
  
  const { title, content, category } = req.body;
  
  if (title) post.title = title;
  if (content) post.content = content;
  if (category) post.category = category;
  post.updatedAt = new Date().toISOString();
  
  logActivity(req.user.id, 'POST_UPDATE', { postId: post.id });
  
  res.json({ success: true, message: '게시물이 수정되었습니다.', post });
});

// 게시물 삭제
app.delete('/api/posts/:id', authenticateToken, (req, res) => {
  const postIndex = db.posts.findIndex(p => p.id === req.params.id);
  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
  }
  
  const post = db.posts[postIndex];
  
  // 작성자 또는 관리자만 삭제 가능
  if (post.authorId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.' });
  }
  
  // 게시물 삭제
  db.posts.splice(postIndex, 1);
  
  // 관련 댓글도 삭제
  db.comments = db.comments.filter(c => c.postId !== req.params.id);
  
  logActivity(req.user.id, 'POST_DELETE', { postId: req.params.id });
  
  res.json({ success: true, message: '게시물이 삭제되었습니다.' });
});

// ============== 댓글 API ==============
// 댓글 작성
app.post('/api/posts/:postId/comments', authenticateToken, (req, res) => {
  const post = db.posts.find(p => p.id === req.params.postId);
  if (!post) {
    return res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
  }
  
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, message: '댓글 내용을 입력해주세요.' });
  }
  
  const newComment = {
    id: uuidv4(),
    postId: req.params.postId,
    content,
    authorId: req.user.id,
    authorName: req.user.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.comments.push(newComment);
  logActivity(req.user.id, 'COMMENT_CREATE', { postId: req.params.postId, commentId: newComment.id });
  
  res.json({ success: true, message: '댓글이 작성되었습니다.', comment: newComment });
});

// 댓글 수정
app.put('/api/comments/:id', authenticateToken, (req, res) => {
  const comment = db.comments.find(c => c.id === req.params.id);
  if (!comment) {
    return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다.' });
  }
  
  // 작성자 또는 관리자만 수정 가능
  if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: '수정 권한이 없습니다.' });
  }
  
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, message: '댓글 내용을 입력해주세요.' });
  }
  
  comment.content = content;
  comment.updatedAt = new Date().toISOString();
  
  logActivity(req.user.id, 'COMMENT_UPDATE', { commentId: comment.id });
  
  res.json({ success: true, message: '댓글이 수정되었습니다.', comment });
});

// 댓글 삭제
app.delete('/api/comments/:id', authenticateToken, (req, res) => {
  const commentIndex = db.comments.findIndex(c => c.id === req.params.id);
  if (commentIndex === -1) {
    return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다.' });
  }
  
  const comment = db.comments[commentIndex];
  
  // 작성자 또는 관리자만 삭제 가능
  if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.' });
  }
  
  db.comments.splice(commentIndex, 1);
  logActivity(req.user.id, 'COMMENT_DELETE', { commentId: req.params.id });
  
  res.json({ success: true, message: '댓글이 삭제되었습니다.' });
});

// ============== 관리자 API ==============
// 사용자 목록 (관리자)
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  const { page = 1, limit = 20, search, status, role } = req.query;
  
  let users = [...db.users];
  
  // 필터링
  if (search) {
    const searchLower = search.toLowerCase();
    users = users.filter(u => 
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower)
    );
  }
  if (status) users = users.filter(u => u.status === status);
  if (role) users = users.filter(u => u.role === role);
  
  // 최신순 정렬
  users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // 페이지네이션
  const total = users.length;
  const startIndex = (page - 1) * limit;
  const paginatedUsers = users.slice(startIndex, startIndex + parseInt(limit));
  
  res.json({
    success: true,
    users: paginatedUsers.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      status: u.status,
      subscription: u.subscription,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt
    })),
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

// 사용자 상태 변경 (관리자)
app.put('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
  }
  
  const { status, role } = req.body;
  
  if (status) user.status = status;
  if (role) user.role = role;
  
  logActivity(req.user.id, 'USER_UPDATE', { targetUserId: user.id });
  
  res.json({ success: true, message: '사용자 정보가 수정되었습니다.' });
});

// 사용자 삭제 (관리자)
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const userIndex = db.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
  }
  
  const user = db.users[userIndex];
  if (user.role === 'admin') {
    return res.status(400).json({ success: false, message: '관리자 계정은 삭제할 수 없습니다.' });
  }
  
  db.users.splice(userIndex, 1);
  logActivity(req.user.id, 'USER_DELETE', { targetUserId: req.params.id });
  
  res.json({ success: true, message: '사용자가 삭제되었습니다.' });
});

// 게시물 목록 (관리자)
app.get('/api/admin/posts', authenticateToken, requireAdmin, (req, res) => {
  const { page = 1, limit = 20, category, search } = req.query;
  
  let posts = [...db.posts];
  
  if (category && category !== 'all') {
    posts = posts.filter(p => p.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.authorName.toLowerCase().includes(searchLower)
    );
  }
  
  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const total = posts.length;
  const startIndex = (page - 1) * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + parseInt(limit));
  
  // 댓글 수 추가
  const postsWithCommentCount = paginatedPosts.map(post => ({
    ...post,
    commentCount: db.comments.filter(c => c.postId === post.id).length
  }));
  
  res.json({
    success: true,
    posts: postsWithCommentCount,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

// 댓글 목록 (관리자)
app.get('/api/admin/comments', authenticateToken, requireAdmin, (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  
  let comments = [...db.comments];
  
  if (search) {
    const searchLower = search.toLowerCase();
    comments = comments.filter(c => 
      c.content.toLowerCase().includes(searchLower) ||
      c.authorName.toLowerCase().includes(searchLower)
    );
  }
  
  comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const total = comments.length;
  const startIndex = (page - 1) * limit;
  const paginatedComments = comments.slice(startIndex, startIndex + parseInt(limit));
  
  // 게시물 제목 추가
  const commentsWithPostTitle = paginatedComments.map(comment => {
    const post = db.posts.find(p => p.id === comment.postId);
    return { ...comment, postTitle: post?.title || '삭제된 게시물' };
  });
  
  res.json({
    success: true,
    comments: commentsWithPostTitle,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

// 관리자 대시보드 통계
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  const totalUsers = db.users.length;
  const activeUsers = db.users.filter(u => u.status === 'active').length;
  const totalPosts = db.posts.length;
  const totalComments = db.comments.length;
  
  // 최근 7일 가입자
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentUsers = db.users.filter(u => new Date(u.createdAt) > weekAgo).length;
  
  // 카테고리별 게시물 수
  const postsByCategory = {
    notice: db.posts.filter(p => p.category === 'notice').length,
    party: db.posts.filter(p => p.category === 'party').length,
    review: db.posts.filter(p => p.category === 'review').length,
    free: db.posts.filter(p => p.category === 'free').length,
    qna: db.posts.filter(p => p.category === 'qna').length
  };
  
  res.json({
    success: true,
    stats: {
      totalUsers,
      activeUsers,
      totalPosts,
      totalComments,
      recentUsers,
      postsByCategory
    }
  });
});

// OTT 서비스 관리 (관리자)
app.post('/api/admin/ott', authenticateToken, requireAdmin, (req, res) => {
  const { name, logo, price, maxMembers, category, color, description } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ success: false, message: '서비스 이름과 가격은 필수입니다.' });
  }
  
  const newService = {
    id: uuidv4(),
    name,
    logo: logo || '📺',
    price,
    maxMembers: maxMembers || 4,
    category: category || '영화/드라마',
    color: color || '#333',
    description: description || ''
  };
  
  db.ottServices.push(newService);
  
  res.json({ success: true, message: 'OTT 서비스가 추가되었습니다.', service: newService });
});

app.put('/api/admin/ott/:id', authenticateToken, requireAdmin, (req, res) => {
  const service = db.ottServices.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'OTT 서비스를 찾을 수 없습니다.' });
  }
  
  const { name, logo, price, maxMembers, category, color, description } = req.body;
  
  if (name) service.name = name;
  if (logo) service.logo = logo;
  if (price) service.price = price;
  if (maxMembers) service.maxMembers = maxMembers;
  if (category) service.category = category;
  if (color) service.color = color;
  if (description !== undefined) service.description = description;
  
  res.json({ success: true, message: 'OTT 서비스가 수정되었습니다.', service });
});

app.delete('/api/admin/ott/:id', authenticateToken, requireAdmin, (req, res) => {
  const serviceIndex = db.ottServices.findIndex(s => s.id === req.params.id);
  if (serviceIndex === -1) {
    return res.status(404).json({ success: false, message: 'OTT 서비스를 찾을 수 없습니다.' });
  }
  
  db.ottServices.splice(serviceIndex, 1);
  
  res.json({ success: true, message: 'OTT 서비스가 삭제되었습니다.' });
});

// ============== 헬스 체크 ==============
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    service: 'APEX Logistics API'
  });
});

// ============== 프론트엔드 정적 파일 서빙 ==============
// 프론트엔드 빌드 폴더 경로
const frontendBuildPath = path.join(__dirname, '../frontend/dist');

// 정적 파일 서빙 (프론트엔드 빌드 결과물)
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  
  // SPA를 위한 모든 GET 요청을 index.html로 라우팅 (API 제외)
  // Express 5에서는 app.use 미들웨어 사용
  app.use((req, res, next) => {
    // API 요청이 아니고 GET 요청인 경우에만 index.html 반환
    if (!req.path.startsWith('/api') && req.method === 'GET') {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    } else {
      next();
    }
  });
  
  console.log('📂 프론트엔드 정적 파일 서빙 활성화');
}

// ============== 홈페이지 설정 API ==============
// 홈페이지 설정 조회 (공개)
app.get('/api/homepage-settings', (req, res) => {
  res.json({ success: true, settings: db.homepageSettings });
});

// 홈페이지 설정 업데이트 (관리자 전용)
app.put('/api/homepage-settings', authenticateToken, requireAdmin, (req, res) => {
  const { heroSlides, features, pricingPreview, cta, sectionTitles } = req.body;
  
  if (heroSlides) db.homepageSettings.heroSlides = heroSlides;
  if (features) db.homepageSettings.features = features;
  if (pricingPreview) db.homepageSettings.pricingPreview = pricingPreview;
  if (cta) db.homepageSettings.cta = cta;
  if (sectionTitles) db.homepageSettings.sectionTitles = sectionTitles;
  
  res.json({ success: true, message: '홈페이지 설정이 저장되었습니다.', settings: db.homepageSettings });
});

// 히어로 슬라이드 추가
app.post('/api/homepage-settings/hero-slides', authenticateToken, requireAdmin, (req, res) => {
  const { title, subtitle, gradient, ctaText, ctaLink } = req.body;
  
  const newSlide = {
    id: `slide-${uuidv4()}`,
    title: title || '새 슬라이드',
    subtitle: subtitle || '설명을 입력하세요',
    gradient: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ctaText: ctaText || '자세히 보기',
    ctaLink: ctaLink || '/'
  };
  
  db.homepageSettings.heroSlides.push(newSlide);
  res.json({ success: true, slide: newSlide });
});

// 히어로 슬라이드 삭제
app.delete('/api/homepage-settings/hero-slides/:id', authenticateToken, requireAdmin, (req, res) => {
  const index = db.homepageSettings.heroSlides.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: '슬라이드를 찾을 수 없습니다.' });
  }
  
  db.homepageSettings.heroSlides.splice(index, 1);
  res.json({ success: true, message: '슬라이드가 삭제되었습니다.' });
});

// 특성(Features) 추가
app.post('/api/homepage-settings/features', authenticateToken, requireAdmin, (req, res) => {
  const { icon, title, desc } = req.body;
  
  const newFeature = {
    id: `feat-${uuidv4()}`,
    icon: icon || 'Star',
    title: title || '새 특성',
    desc: desc || '설명을 입력하세요'
  };
  
  db.homepageSettings.features.push(newFeature);
  res.json({ success: true, feature: newFeature });
});

// 특성 삭제
app.delete('/api/homepage-settings/features/:id', authenticateToken, requireAdmin, (req, res) => {
  const index = db.homepageSettings.features.findIndex(f => f.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: '특성을 찾을 수 없습니다.' });
  }
  
  db.homepageSettings.features.splice(index, 1);
  res.json({ success: true, message: '특성이 삭제되었습니다.' });
});

// 가격 미리보기 카드 추가
app.post('/api/homepage-settings/pricing-cards', authenticateToken, requireAdmin, (req, res) => {
  const { service, original, sale, discount, featured } = req.body;
  
  const newCard = {
    id: `price-${uuidv4()}`,
    service: service || '서비스명',
    original: original || '₩0',
    sale: sale || '₩0',
    discount: discount || '-0%',
    featured: featured || false
  };
  
  db.homepageSettings.pricingPreview.cards.push(newCard);
  res.json({ success: true, card: newCard });
});

// 가격 미리보기 카드 삭제
app.delete('/api/homepage-settings/pricing-cards/:id', authenticateToken, requireAdmin, (req, res) => {
  const index = db.homepageSettings.pricingPreview.cards.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: '카드를 찾을 수 없습니다.' });
  }
  
  db.homepageSettings.pricingPreview.cards.splice(index, 1);
  res.json({ success: true, message: '카드가 삭제되었습니다.' });
});

// ============== 페이지 빌더 API ==============
// 모든 페이지 목록 조회
app.get('/api/pages', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  
  const pages = db.pages.map(page => ({
    id: page.id,
    name: page.name,
    slug: page.slug,
    isPublished: page.isPublished,
    componentsCount: page.components?.length || 0,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt
  }));
  
  res.json(pages);
});

// 특정 페이지 조회
app.get('/api/pages/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  
  const page = db.pages.find(p => p.id === req.params.id);
  if (!page) {
    return res.status(404).json({ message: '페이지를 찾을 수 없습니다.' });
  }
  
  res.json(page);
});

// 새 페이지 생성
app.post('/api/pages', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  
  const { name, slug } = req.body;
  
  if (!name || !slug) {
    return res.status(400).json({ message: '페이지 이름과 URL이 필요합니다.' });
  }
  
  // 중복 체크
  if (db.pages.some(p => p.slug === slug)) {
    return res.status(400).json({ message: '이미 존재하는 URL입니다.' });
  }
  
  const newPage = {
    id: uuidv4(),
    name,
    slug,
    components: [],
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.pages.push(newPage);
  res.status(201).json(newPage);
});

// 페이지 업데이트 (컴포넌트 저장)
app.put('/api/pages/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  
  const pageIndex = db.pages.findIndex(p => p.id === req.params.id);
  if (pageIndex === -1) {
    return res.status(404).json({ message: '페이지를 찾을 수 없습니다.' });
  }
  
  const { name, slug, components, isPublished } = req.body;
  
  db.pages[pageIndex] = {
    ...db.pages[pageIndex],
    name: name || db.pages[pageIndex].name,
    slug: slug || db.pages[pageIndex].slug,
    components: components !== undefined ? components : db.pages[pageIndex].components,
    isPublished: isPublished !== undefined ? isPublished : db.pages[pageIndex].isPublished,
    updatedAt: new Date().toISOString()
  };
  
  res.json(db.pages[pageIndex]);
});

// 페이지 삭제
app.delete('/api/pages/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  
  const pageIndex = db.pages.findIndex(p => p.id === req.params.id);
  if (pageIndex === -1) {
    return res.status(404).json({ message: '페이지를 찾을 수 없습니다.' });
  }
  
  // 홈페이지는 삭제 불가
  if (db.pages[pageIndex].slug === '/') {
    return res.status(400).json({ message: '홈페이지는 삭제할 수 없습니다.' });
  }
  
  db.pages.splice(pageIndex, 1);
  res.json({ message: '페이지가 삭제되었습니다.' });
});

// 페이지 복제
app.post('/api/pages/:id/duplicate', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  
  const page = db.pages.find(p => p.id === req.params.id);
  if (!page) {
    return res.status(404).json({ message: '페이지를 찾을 수 없습니다.' });
  }
  
  const newPage = {
    id: uuidv4(),
    name: `${page.name} (복사본)`,
    slug: `${page.slug}-copy-${Date.now()}`,
    components: JSON.parse(JSON.stringify(page.components)),
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.pages.push(newPage);
  res.status(201).json(newPage);
});

// 공개된 페이지 조회 (인증 불필요)
app.get('/api/public/pages/:slug', (req, res) => {
  const slug = '/' + req.params.slug;
  const page = db.pages.find(p => p.slug === slug && p.isPublished);
  
  if (!page) {
    return res.status(404).json({ message: '페이지를 찾을 수 없습니다.' });
  }
  
  res.json({
    name: page.name,
    components: page.components
  });
});

// ============== 비주얼 에디터 API ==============
// 비주얼 에디터 데이터 조회 (공개 - 홈페이지 렌더링용)
app.get('/api/visual-editor/:pageId', (req, res) => {
  const pageId = req.params.pageId;
  const data = db.visualEditorData[pageId];
  
  if (!data) {
    return res.json({
      success: true,
      data: { elements: [], settings: {} }
    });
  }
  
  res.json({
    success: true,
    data: {
      elements: data.elements,
      settings: data.settings,
      lastUpdated: data.lastUpdated
    }
  });
});

// 비주얼 에디터 데이터 저장 (관리자 전용)
app.put('/api/visual-editor/:pageId', authenticateToken, requireAdmin, (req, res) => {
  const pageId = req.params.pageId;
  const { elements, settings, targetLocation } = req.body;
  
  if (!db.visualEditorData[pageId]) {
    db.visualEditorData[pageId] = {
      elements: [],
      settings: { canvasWidth: '100%', canvasHeight: 800 }
    };
  }
  
  db.visualEditorData[pageId] = {
    elements: elements || [],
    settings: settings || db.visualEditorData[pageId].settings,
    targetLocation: targetLocation || null,
    lastUpdated: new Date().toISOString(),
    updatedBy: req.user.id
  };
  
  logActivity(req.user.id, 'VISUAL_EDITOR_SAVE', { pageId, elementsCount: elements?.length || 0 });
  
  res.json({
    success: true,
    message: '비주얼 에디터 데이터가 저장되었습니다.',
    data: db.visualEditorData[pageId]
  });
});

// 비주얼 에디터 데이터 삭제 (관리자 전용)
app.delete('/api/visual-editor/:pageId', authenticateToken, requireAdmin, (req, res) => {
  const pageId = req.params.pageId;
  
  if (db.visualEditorData[pageId]) {
    db.visualEditorData[pageId] = {
      elements: [],
      settings: { canvasWidth: '100%', canvasHeight: 800 },
      lastUpdated: new Date().toISOString(),
      updatedBy: req.user.id
    };
  }
  
  res.json({
    success: true,
    message: '비주얼 에디터 데이터가 초기화되었습니다.'
  });
});

// 모든 페이지의 비주얼 에디터 데이터 목록 (관리자 전용)
app.get('/api/visual-editor', authenticateToken, requireAdmin, (req, res) => {
  const pages = Object.entries(db.visualEditorData).map(([pageId, data]) => ({
    pageId,
    elementsCount: data.elements?.length || 0,
    lastUpdated: data.lastUpdated,
    updatedBy: data.updatedBy
  }));
  
  res.json({
    success: true,
    pages
  });
});

// ============== 관리자 - 요금 관리 API ==============
// 가격 기준 데이터
db.pricingCategories = [
  {
    id: 1,
    category: '이커머스 풀필먼트',
    items: [
      { id: 1, name: '입고 처리', unit: '박스당', price: '500원~', description: '상품 입고 및 검수' },
      { id: 2, name: '보관료', unit: '㎡/일', price: '150원~', description: '상온 보관 기준' },
      { id: 3, name: '출고 처리', unit: '건당', price: '800원~', description: '피킹, 패킹 포함' },
    ]
  },
  {
    id: 2,
    category: 'B2B 물류',
    items: [
      { id: 4, name: '파레트 보관', unit: 'PLT/일', price: '1,500원~', description: '표준 파레트 기준' },
      { id: 5, name: '하역 작업', unit: '톤당', price: '15,000원~', description: '지게차 작업 포함' },
    ]
  },
  {
    id: 3,
    category: '글로벌 물류',
    items: [
      { id: 6, name: '항공 운송', unit: 'kg당', price: '협의', description: '목적지별 상이' },
      { id: 7, name: '해상 운송', unit: 'CBM당', price: '협의', description: 'FCL/LCL 별도' },
    ]
  }
];

// 견적 요청 데이터
db.quotes = [
  { id: 1, company: '(주)테크솔루션', contact: '김담당', email: 'kim@techsol.com', phone: '010-1234-5678', serviceType: '이커머스 풀필먼트', message: '월 출고량 5,000건 예상', date: '2025.12.30', status: 'pending' },
  { id: 2, company: '글로벌트레이드', contact: '박매니저', email: 'park@globaltrade.com', phone: '010-2345-6789', serviceType: '글로벌 물류', message: '중국발 미국행 FCL 문의', date: '2025.12.29', status: 'contacted' },
  { id: 3, company: '푸드프레시', contact: '이대리', email: 'lee@foodfresh.co.kr', phone: '010-3456-7890', serviceType: '콜드체인', message: '냉동 식품 보관 및 배송', date: '2025.12.28', status: 'completed' },
];

// 가격 기준 조회
app.get('/api/admin/pricing', authenticateToken, requireAdmin, (req, res) => {
  res.json({ success: true, categories: db.pricingCategories });
});

// 가격 항목 추가
app.post('/api/admin/pricing', authenticateToken, requireAdmin, (req, res) => {
  const { category, name, unit, price, description } = req.body;
  
  let categoryObj = db.pricingCategories.find(c => c.category === category);
  if (!categoryObj) {
    categoryObj = { id: Date.now(), category, items: [] };
    db.pricingCategories.push(categoryObj);
  }
  
  const newItem = {
    id: Date.now(),
    name,
    unit,
    price,
    description
  };
  
  categoryObj.items.push(newItem);
  res.json({ success: true, message: '가격 항목이 추가되었습니다.', item: newItem });
});

// 가격 항목 수정
app.put('/api/admin/pricing/:id', authenticateToken, requireAdmin, (req, res) => {
  const itemId = parseInt(req.params.id);
  const { name, unit, price, description } = req.body;
  
  for (const category of db.pricingCategories) {
    const item = category.items.find(i => i.id === itemId);
    if (item) {
      if (name) item.name = name;
      if (unit) item.unit = unit;
      if (price) item.price = price;
      if (description) item.description = description;
      return res.json({ success: true, message: '가격 항목이 수정되었습니다.', item });
    }
  }
  
  res.status(404).json({ success: false, message: '항목을 찾을 수 없습니다.' });
});

// 가격 항목 삭제
app.delete('/api/admin/pricing/:categoryId/:itemId', authenticateToken, requireAdmin, (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const itemId = parseInt(req.params.itemId);
  
  const category = db.pricingCategories.find(c => c.id === categoryId);
  if (!category) {
    return res.status(404).json({ success: false, message: '카테고리를 찾을 수 없습니다.' });
  }
  
  const itemIndex = category.items.findIndex(i => i.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: '항목을 찾을 수 없습니다.' });
  }
  
  category.items.splice(itemIndex, 1);
  res.json({ success: true, message: '가격 항목이 삭제되었습니다.' });
});

// 견적 요청 목록 조회
app.get('/api/admin/quotes', authenticateToken, requireAdmin, (req, res) => {
  res.json({ success: true, quotes: db.quotes });
});

// 견적 요청 추가 (공개 API)
app.post('/api/quotes', (req, res) => {
  const { company, contact, email, phone, serviceType, message } = req.body;
  
  const newQuote = {
    id: Date.now(),
    company,
    contact,
    email,
    phone,
    serviceType,
    message,
    date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    status: 'pending'
  };
  
  db.quotes.push(newQuote);
  res.json({ success: true, message: '견적 요청이 접수되었습니다.', quote: newQuote });
});

// 견적 요청 상태 변경
app.put('/api/admin/quotes/:id', authenticateToken, requireAdmin, (req, res) => {
  const quoteId = parseInt(req.params.id);
  const { status } = req.body;
  
  const quote = db.quotes.find(q => q.id === quoteId);
  if (!quote) {
    return res.status(404).json({ success: false, message: '견적 요청을 찾을 수 없습니다.' });
  }
  
  quote.status = status;
  res.json({ success: true, message: '상태가 변경되었습니다.', quote });
});

// 견적 요청 삭제
app.delete('/api/admin/quotes/:id', authenticateToken, requireAdmin, (req, res) => {
  const quoteId = parseInt(req.params.id);
  const index = db.quotes.findIndex(q => q.id === quoteId);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: '견적 요청을 찾을 수 없습니다.' });
  }
  
  db.quotes.splice(index, 1);
  res.json({ success: true, message: '견적 요청이 삭제되었습니다.' });
});

// ============== 관리자 - 인사이트 관리 API ==============
db.insights = [
  { id: 1, title: '세계 경제 흐름을 읽는 4대 운임지수', slug: 'freight-index-guide', category: '공급망 관리', status: 'published', views: 1234, excerpt: 'CCFI, SCFI, BDI, HRCI - 세계 경제를 읽는 핵심 지표', featuredImage: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200', content: '', date: '2025.11.05' },
  { id: 2, title: '포워더(Forwarder)란? 글로벌 물류의 핵심', slug: 'forwarder-guide', category: '공급망 관리', status: 'published', views: 987, excerpt: '포워더의 역할과 선택 기준', featuredImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200', content: '', date: '2025.10.31' },
];

// 인사이트 목록 조회
app.get('/api/admin/insights', authenticateToken, requireAdmin, (req, res) => {
  res.json({ success: true, insights: db.insights });
});

// 인사이트 생성
app.post('/api/admin/insights', authenticateToken, requireAdmin, (req, res) => {
  const { title, slug, category, status, excerpt, featuredImage, content } = req.body;
  
  const newInsight = {
    id: Date.now(),
    title,
    slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
    category,
    status: status || 'draft',
    views: 0,
    excerpt,
    featuredImage,
    content,
    date: new Date().toISOString().slice(0, 10).replace(/-/g, '.')
  };
  
  db.insights.push(newInsight);
  res.json({ success: true, message: '인사이트가 생성되었습니다.', insight: newInsight });
});

// 인사이트 수정
app.put('/api/admin/insights/:id', authenticateToken, requireAdmin, (req, res) => {
  const insightId = parseInt(req.params.id);
  const insight = db.insights.find(i => i.id === insightId);
  
  if (!insight) {
    return res.status(404).json({ success: false, message: '인사이트를 찾을 수 없습니다.' });
  }
  
  const { title, slug, category, status, excerpt, featuredImage, content } = req.body;
  
  if (title) insight.title = title;
  if (slug) insight.slug = slug;
  if (category) insight.category = category;
  if (status) insight.status = status;
  if (excerpt) insight.excerpt = excerpt;
  if (featuredImage) insight.featuredImage = featuredImage;
  if (content !== undefined) insight.content = content;
  
  res.json({ success: true, message: '인사이트가 수정되었습니다.', insight });
});

// 인사이트 삭제
app.delete('/api/admin/insights/:id', authenticateToken, requireAdmin, (req, res) => {
  const insightId = parseInt(req.params.id);
  const index = db.insights.findIndex(i => i.id === insightId);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: '인사이트를 찾을 수 없습니다.' });
  }
  
  db.insights.splice(index, 1);
  res.json({ success: true, message: '인사이트가 삭제되었습니다.' });
});

// ============== 관리자 - 고객지원 관리 API ==============
// 공지사항 데이터
db.announcements = [
  { id: 1, title: '2025년 설날 연휴 운영 안내', content: '설날 연휴 기간 물류센터 운영 시간 안내드립니다.', type: 'notice', isPinned: true, date: '2025.01.20', views: 234 },
  { id: 2, title: '신규 콜드체인 서비스 오픈', content: '냉장/냉동 상품 전용 물류 서비스가 오픈되었습니다.', type: 'service', isPinned: false, date: '2025.01.15', views: 567 },
];

// FAQ 데이터
db.faqs = [
  { id: 1, category: '서비스 일반', question: 'APEX Logistics의 최소 계약 기간은 어떻게 되나요?', answer: '최소 계약 기간은 없습니다.', order: 1 },
  { id: 2, category: '서비스 일반', question: '해외 배송도 가능한가요?', answer: '네, 가능합니다. 200여 개국으로의 해외 배송을 지원합니다.', order: 2 },
  { id: 3, category: '요금 안내', question: '견적은 어떻게 받을 수 있나요?', answer: '요금안내 페이지에서 맞춤 견적을 요청하시거나 전화 문의 주세요.', order: 3 },
];

// 공지사항 조회
app.get('/api/admin/announcements', authenticateToken, requireAdmin, (req, res) => {
  res.json({ success: true, announcements: db.announcements });
});

// 공지사항 추가
app.post('/api/admin/announcements', authenticateToken, requireAdmin, (req, res) => {
  const { title, content, type, isPinned } = req.body;
  
  const newAnnouncement = {
    id: Date.now(),
    title,
    content,
    type: type || 'notice',
    isPinned: isPinned || false,
    date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    views: 0
  };
  
  db.announcements.push(newAnnouncement);
  res.json({ success: true, message: '공지사항이 추가되었습니다.', announcement: newAnnouncement });
});

// 공지사항 수정
app.put('/api/admin/announcements/:id', authenticateToken, requireAdmin, (req, res) => {
  const announcementId = parseInt(req.params.id);
  const announcement = db.announcements.find(a => a.id === announcementId);
  
  if (!announcement) {
    return res.status(404).json({ success: false, message: '공지사항을 찾을 수 없습니다.' });
  }
  
  const { title, content, type, isPinned } = req.body;
  
  if (title) announcement.title = title;
  if (content) announcement.content = content;
  if (type) announcement.type = type;
  if (isPinned !== undefined) announcement.isPinned = isPinned;
  
  res.json({ success: true, message: '공지사항이 수정되었습니다.', announcement });
});

// 공지사항 삭제
app.delete('/api/admin/announcements/:id', authenticateToken, requireAdmin, (req, res) => {
  const announcementId = parseInt(req.params.id);
  const index = db.announcements.findIndex(a => a.id === announcementId);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: '공지사항을 찾을 수 없습니다.' });
  }
  
  db.announcements.splice(index, 1);
  res.json({ success: true, message: '공지사항이 삭제되었습니다.' });
});

// FAQ 조회
app.get('/api/admin/faqs', authenticateToken, requireAdmin, (req, res) => {
  res.json({ success: true, faqs: db.faqs });
});

// FAQ 추가
app.post('/api/admin/faqs', authenticateToken, requireAdmin, (req, res) => {
  const { category, question, answer } = req.body;
  
  const newFaq = {
    id: Date.now(),
    category,
    question,
    answer,
    order: db.faqs.length + 1
  };
  
  db.faqs.push(newFaq);
  res.json({ success: true, message: 'FAQ가 추가되었습니다.', faq: newFaq });
});

// FAQ 수정
app.put('/api/admin/faqs/:id', authenticateToken, requireAdmin, (req, res) => {
  const faqId = parseInt(req.params.id);
  const faq = db.faqs.find(f => f.id === faqId);
  
  if (!faq) {
    return res.status(404).json({ success: false, message: 'FAQ를 찾을 수 없습니다.' });
  }
  
  const { category, question, answer, order } = req.body;
  
  if (category) faq.category = category;
  if (question) faq.question = question;
  if (answer) faq.answer = answer;
  if (order) faq.order = order;
  
  res.json({ success: true, message: 'FAQ가 수정되었습니다.', faq });
});

// FAQ 삭제
app.delete('/api/admin/faqs/:id', authenticateToken, requireAdmin, (req, res) => {
  const faqId = parseInt(req.params.id);
  const index = db.faqs.findIndex(f => f.id === faqId);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'FAQ를 찾을 수 없습니다.' });
  }
  
  db.faqs.splice(index, 1);
  res.json({ success: true, message: 'FAQ가 삭제되었습니다.' });
});

// ============== 관리자 - 고객 데이터 관리 API ==============
db.customers = [
  { id: 1, company: '(주)테크솔루션', contact: '김담당', email: 'kim@techsol.com', phone: '010-1234-5678', service: '이커머스 풀필먼트', status: 'active', joinDate: '2024.06.15', lastActivity: '2025.12.30', monthlyVolume: '5,200건', totalSpent: '₩45,600,000' },
  { id: 2, company: '글로벌트레이드', contact: '박매니저', email: 'park@globaltrade.com', phone: '010-2345-6789', service: '글로벌 물류', status: 'active', joinDate: '2024.03.20', lastActivity: '2025.12.29', monthlyVolume: '120 TEU', totalSpent: '₩234,000,000' },
  { id: 3, company: '푸드프레시', contact: '이대리', email: 'lee@foodfresh.co.kr', phone: '010-3456-7890', service: '콜드체인', status: 'pending', joinDate: '2025.01.05', lastActivity: '2025.12.28', monthlyVolume: '-', totalSpent: '₩0' },
];

// 고객 목록 조회
app.get('/api/admin/customers', authenticateToken, requireAdmin, (req, res) => {
  const { status, service, search } = req.query;
  let customers = [...db.customers];
  
  if (status) customers = customers.filter(c => c.status === status);
  if (service) customers = customers.filter(c => c.service === service);
  if (search) {
    const searchLower = search.toLowerCase();
    customers = customers.filter(c => 
      c.company.toLowerCase().includes(searchLower) ||
      c.contact.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({ success: true, customers });
});

// 고객 추가
app.post('/api/admin/customers', authenticateToken, requireAdmin, (req, res) => {
  const { company, contact, email, phone, service, status } = req.body;
  
  const newCustomer = {
    id: Date.now(),
    company,
    contact,
    email,
    phone,
    service,
    status: status || 'pending',
    joinDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    lastActivity: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    monthlyVolume: '-',
    totalSpent: '₩0'
  };
  
  db.customers.push(newCustomer);
  res.json({ success: true, message: '고객이 추가되었습니다.', customer: newCustomer });
});

// 고객 정보 수정
app.put('/api/admin/customers/:id', authenticateToken, requireAdmin, (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = db.customers.find(c => c.id === customerId);
  
  if (!customer) {
    return res.status(404).json({ success: false, message: '고객을 찾을 수 없습니다.' });
  }
  
  const { company, contact, email, phone, service, status, monthlyVolume, totalSpent } = req.body;
  
  if (company) customer.company = company;
  if (contact) customer.contact = contact;
  if (email) customer.email = email;
  if (phone) customer.phone = phone;
  if (service) customer.service = service;
  if (status) customer.status = status;
  if (monthlyVolume) customer.monthlyVolume = monthlyVolume;
  if (totalSpent) customer.totalSpent = totalSpent;
  
  customer.lastActivity = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
  
  res.json({ success: true, message: '고객 정보가 수정되었습니다.', customer });
});

// 고객 삭제
app.delete('/api/admin/customers/:id', authenticateToken, requireAdmin, (req, res) => {
  const customerId = parseInt(req.params.id);
  const index = db.customers.findIndex(c => c.id === customerId);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: '고객을 찾을 수 없습니다.' });
  }
  
  db.customers.splice(index, 1);
  res.json({ success: true, message: '고객이 삭제되었습니다.' });
});

// 공개 API - 공지사항
app.get('/api/announcements', (req, res) => {
  res.json({ success: true, announcements: db.announcements });
});

// 공개 API - FAQ
app.get('/api/faqs', (req, res) => {
  res.json({ success: true, faqs: db.faqs });
});

// ============== 서버 시작 ==============
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ APEX Logistics API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`👥 등록된 사용자: ${db.users.length}명`);
  console.log(`📦 물류 서비스: ${db.logisticsServices.length}개`);
  console.log(`📝 게시물: ${db.posts.length}개`);
});
