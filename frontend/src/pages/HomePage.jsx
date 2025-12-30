import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  ArrowRight, 
  Package, 
  Truck, 
  Globe, 
  BarChart3, 
  Shield, 
  Clock, 
  Zap,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Play,
  Building2,
  Container,
  Warehouse,
  Ship,
  Plane
} from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const [activeService, setActiveService] = useState(0);
  const [stats, setStats] = useState({ clients: 0, centers: 0, countries: 0, deliveries: 0 });
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });

  // Animate stats when in view
  useEffect(() => {
    if (isStatsInView) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      const targets = { clients: 500, centers: 42, countries: 28, deliveries: 15 };
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setStats({
          clients: Math.floor(targets.clients * progress),
          centers: Math.floor(targets.centers * progress),
          countries: Math.floor(targets.countries * progress),
          deliveries: Math.floor(targets.deliveries * progress),
        });
        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isStatsInView]);

  const services = [
    {
      icon: <Package size={32} />,
      title: '이커머스 풀필먼트',
      desc: '입고부터 출고까지 원스톱 물류 서비스. AI 기반 재고 관리와 당일 출고 시스템으로 고객 만족도를 높입니다.',
      features: ['실시간 재고 관리', '당일 출고 보장', '반품 처리 자동화']
    },
    {
      icon: <Building2 size={32} />,
      title: 'B2B 물류',
      desc: '대기업 맞춤형 B2B 물류 솔루션. 복잡한 공급망을 효율적으로 관리하고 비용을 최적화합니다.',
      features: ['공급망 최적화', 'JIT 배송', '통합 물류 관리']
    },
    {
      icon: <Globe size={32} />,
      title: '글로벌 물류',
      desc: '28개국 글로벌 네트워크를 통한 크로스보더 물류. 수출입 통관부터 라스트마일까지 책임집니다.',
      features: ['수출입 통관 대행', '글로벌 배송', 'FBA/FBM 지원']
    },
    {
      icon: <Container size={32} />,
      title: '콜드체인',
      desc: '신선식품과 의약품을 위한 온도 관리 물류. IoT 센서로 실시간 온도 모니터링을 제공합니다.',
      features: ['실시간 온도 추적', '의약품 GMP', 'HACCP 인증']
    },
  ];

  const values = [
    {
      icon: <Zap size={28} />,
      title: 'Speed',
      subtitle: '신속한 대응',
      desc: '고객의 요청에 즉각 대응하는 민첩한 서비스'
    },
    {
      icon: <Shield size={28} />,
      title: 'Trust',
      subtitle: '신뢰할 수 있는',
      desc: '20년간 쌓아온 물류 노하우와 안정적인 서비스'
    },
    {
      icon: <BarChart3 size={28} />,
      title: 'Innovation',
      subtitle: '혁신적인',
      desc: 'AI와 자동화로 물류의 미래를 선도합니다'
    },
    {
      icon: <Globe size={28} />,
      title: 'Global',
      subtitle: '글로벌 네트워크',
      desc: '28개국 파트너십으로 세계와 연결합니다'
    },
  ];

  const clients = [
    '삼성전자', 'LG전자', 'SK하이닉스', '현대자동차', 'CJ대한통운', '쿠팡', '네이버', '카카오'
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-pattern" />
          <div className="hero-shapes">
            <div className="shape shape-1" />
            <div className="shape shape-2" />
            <div className="shape shape-3" />
          </div>
        </div>
        
        <div className="hero-content container">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">
              <span className="badge-dot" />
              대기업 전문 물류 파트너
            </span>
            <h1>
              Beyond Logistics,<br />
              <span className="text-gradient">Business Partner</span>
            </h1>
            <p className="hero-subtitle">
              단순한 물류를 넘어, 비즈니스의 성장을 함께하는 파트너.<br />
              APEX Logistics가 귀사의 물류 혁신을 이끌어갑니다.
            </p>
            
            <div className="hero-buttons">
              <Link to="/catalog" className="btn btn-accent btn-lg">
                서비스 둘러보기
                <ArrowRight size={20} />
              </Link>
              <button className="btn btn-outline btn-lg video-btn">
                <Play size={20} />
                회사 소개 영상
              </button>
            </div>

            <div className="hero-clients">
              <span>신뢰받는 파트너사</span>
              <div className="client-logos">
                {clients.slice(0, 5).map((client, idx) => (
                  <div key={idx} className="client-logo">{client}</div>
                ))}
                <div className="client-more">+{clients.length - 5}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="visual-container">
              <div className="visual-card card-1">
                <Truck size={24} />
                <div>
                  <span>실시간 배송</span>
                  <strong>1,247건 진행중</strong>
                </div>
              </div>
              <div className="visual-card card-2">
                <Package size={24} />
                <div>
                  <span>오늘 처리량</span>
                  <strong>52,847건</strong>
                </div>
              </div>
              <div className="visual-card card-3">
                <Globe size={24} />
                <div>
                  <span>글로벌 출고</span>
                  <strong>28개국</strong>
                </div>
              </div>
              <div className="visual-globe">
                <div className="globe-ring ring-1" />
                <div className="globe-ring ring-2" />
                <div className="globe-ring ring-3" />
                <div className="globe-center">
                  <Ship size={40} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="hero-scroll">
          <span>스크롤하여 더 알아보기</span>
          <div className="scroll-indicator" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <span className="stat-number">{stats.clients}+</span>
              <span className="stat-label">파트너 기업</span>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="stat-number">{stats.centers}</span>
              <span className="stat-label">물류센터</span>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span className="stat-number">{stats.countries}</span>
              <span className="stat-label">서비스 국가</span>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <span className="stat-number">{stats.deliveries}M+</span>
              <span className="stat-label">연간 배송건수</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section services-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge badge badge-primary">SERVICES</span>
            <h2>통합 물류 솔루션</h2>
            <p>비즈니스 규모와 업종에 최적화된 맞춤형 물류 서비스를 제공합니다.</p>
          </motion.div>

          <div className="services-container">
            <div className="services-tabs">
              {services.map((service, idx) => (
                <motion.button
                  key={idx}
                  className={`service-tab ${activeService === idx ? 'active' : ''}`}
                  onClick={() => setActiveService(idx)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="tab-icon">{service.icon}</div>
                  <div className="tab-content">
                    <h4>{service.title}</h4>
                    <p>{service.desc.slice(0, 40)}...</p>
                  </div>
                  <ChevronRight size={20} className="tab-arrow" />
                </motion.button>
              ))}
            </div>

            <motion.div 
              className="service-detail"
              key={activeService}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="detail-icon">{services[activeService].icon}</div>
              <h3>{services[activeService].title}</h3>
              <p>{services[activeService].desc}</p>
              <ul className="detail-features">
                {services[activeService].features.map((feature, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={18} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/catalog" className="btn btn-primary">
                자세히 보기 <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section section-dark values-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge badge badge-accent">OUR VALUES</span>
            <h2>핵심 가치</h2>
            <p>APEX Logistics가 추구하는 4가지 핵심 가치입니다.</p>
          </motion.div>

          <div className="values-grid">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <span className="value-subtitle">{value.subtitle}</span>
                <p>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why APEX Section */}
      <section className="section why-section">
        <div className="container">
          <div className="why-content">
            <motion.div 
              className="why-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge badge badge-primary">WHY APEX</span>
              <h2>왜 APEX Logistics인가요?</h2>
              <p className="why-desc">
                20년간 대기업 물류를 전문으로 해온 APEX Logistics는 
                단순한 운송을 넘어 비즈니스 파트너로서 함께 성장합니다.
              </p>
              
              <div className="why-features">
                <div className="why-feature">
                  <div className="feature-check">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4>전문 컨설팅</h4>
                    <p>물류 전문가가 직접 분석하고 최적의 솔루션을 제안합니다.</p>
                  </div>
                </div>
                <div className="why-feature">
                  <div className="feature-check">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4>IT 기술력</h4>
                    <p>자체 개발 WMS/TMS로 실시간 물류 현황을 투명하게 공유합니다.</p>
                  </div>
                </div>
                <div className="why-feature">
                  <div className="feature-check">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4>확장성</h4>
                    <p>사업 성장에 따라 유연하게 물류 역량을 확장할 수 있습니다.</p>
                  </div>
                </div>
              </div>

              <Link to="/pricing" className="btn btn-primary btn-lg">
                요금 알아보기 <ArrowRight size={20} />
              </Link>
            </motion.div>

            <motion.div 
              className="why-visual"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="process-flow">
                <div className="process-step">
                  <div className="step-number">01</div>
                  <div className="step-content">
                    <h4>상담 및 분석</h4>
                    <p>물류 현황 파악</p>
                  </div>
                </div>
                <div className="process-line" />
                <div className="process-step">
                  <div className="step-number">02</div>
                  <div className="step-content">
                    <h4>맞춤 설계</h4>
                    <p>최적 솔루션 제안</p>
                  </div>
                </div>
                <div className="process-line" />
                <div className="process-step">
                  <div className="step-number">03</div>
                  <div className="step-content">
                    <h4>시스템 구축</h4>
                    <p>IT 연동 및 셋업</p>
                  </div>
                </div>
                <div className="process-line" />
                <div className="process-step">
                  <div className="step-number">04</div>
                  <div className="step-content">
                    <h4>운영 시작</h4>
                    <p>물류 서비스 개시</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Showcase Section - 물류 시설 이미지 */}
      <section className="section showcase-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge badge badge-primary">FACILITIES</span>
            <h2>물류 인프라</h2>
            <p>최첨단 시설과 시스템으로 완벽한 물류 서비스를 제공합니다.</p>
          </motion.div>

          <div className="showcase-grid">
            <motion.div
              className="showcase-item showcase-large"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img src="/images/automation-center.jpg" alt="자동화 물류센터" />
              <div className="showcase-overlay">
                <span className="showcase-tag">스마트 웨어하우스</span>
                <h3>최첨단 자동화 물류센터</h3>
                <p>로봇 자동화 시스템으로 24시간 무인 운영이 가능한 스마트 물류센터</p>
              </div>
            </motion.div>

            <motion.div
              className="showcase-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <img src="/images/warehouse-storage.jpg" alt="창고 보관 시스템" />
              <div className="showcase-overlay">
                <span className="showcase-tag">창고 관리</span>
                <h3>체계적인 재고 관리</h3>
                <p>SKU별 최적화된 보관 시스템</p>
              </div>
            </motion.div>

            <motion.div
              className="showcase-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img src="/images/fashion-logistics.jpg" alt="패션 물류" />
              <div className="showcase-overlay">
                <span className="showcase-tag">이커머스</span>
                <h3>패션/의류 전문 물류</h3>
                <p>시즌별 물량 대응 전문</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="section section-gray clients-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge badge badge-primary">CLIENTS</span>
            <h2>신뢰하는 파트너</h2>
            <p>대한민국을 대표하는 기업들이 APEX Logistics와 함께합니다.</p>
          </motion.div>

          <div className="clients-marquee">
            <div className="marquee-track">
              {[...clients, ...clients].map((client, idx) => (
                <div key={idx} className="client-item">
                  <span>{client}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg">
          <div className="cta-pattern" />
        </div>
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>물류 혁신, 지금 시작하세요</h2>
            <p>전문 컨설턴트가 귀사에 최적화된 물류 솔루션을 제안해드립니다.</p>
            
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-accent btn-lg">
                무료 상담 신청
                <ArrowRight size={20} />
              </Link>
              <a href="tel:1566-0000" className="btn btn-outline btn-lg">
                <Phone size={20} />
                1566-0000
              </a>
            </div>

            <div className="cta-contact">
              <div className="contact-item">
                <Mail size={18} />
                <span>contact@apexlogistics.kr</span>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <span>서울시 강남구 테헤란로 123</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
