import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  Globe, 
  Thermometer, 
  Cpu,
  Ship,
  Plane,
  Warehouse,
  CheckCircle2,
  ArrowRight,
  Phone,
  Building2
} from 'lucide-react';
import './CatalogPage.css';

const CatalogPage = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      id: 'ecommerce',
      icon: <Package size={40} />,
      name: '이커머스 풀필먼트',
      shortDesc: '온라인 셀러를 위한 원스톱 물류',
      description: '입고부터 출고까지 모든 물류 프로세스를 한 번에 해결합니다. AI 기반 재고 관리와 당일 출고 시스템으로 고객 만족도를 극대화합니다.',
      image: '/images/ecommerce-fulfillment.jpg',
      color: '#2563eb',
      features: [
        '실시간 재고 관리 (WMS)',
        '당일 출고 보장',
        '반품 처리 자동화',
        '쇼핑몰 API 연동',
        '맞춤형 패키징',
        '데이터 리포트'
      ],
      benefits: ['출고 정확도 99.9%', '당일 출고율 98%', '물류비 30% 절감']
    },
    {
      id: 'b2b',
      icon: <Building2 size={40} />,
      name: 'B2B 물류',
      shortDesc: '대기업 맞춤형 공급망 솔루션',
      description: '복잡한 B2B 물류를 효율적으로 관리합니다. JIT 배송, VMI 운영, 통합 물류 관리로 공급망을 최적화하고 비용을 절감합니다.',
      image: '/images/b2b-logistics.jpg',
      color: '#0891b2',
      features: [
        '공급망 최적화 컨설팅',
        'JIT(Just-In-Time) 배송',
        'VMI(Vendor Managed Inventory)',
        '통합 물류 관리',
        '전담 매니저 배정',
        'EDI 연동'
      ],
      benefits: ['재고 비용 40% 절감', '배송 리드타임 50% 단축', '운영 효율 35% 향상']
    },
    {
      id: 'global',
      icon: <Globe size={40} />,
      name: '글로벌 물류',
      shortDesc: '28개국 네트워크 크로스보더 물류',
      description: '글로벌 네트워크를 통한 수출입 물류 서비스입니다. 통관 대행부터 라스트마일 배송까지 원스톱으로 지원합니다.',
      image: '/images/global-logistics.jpg',
      color: '#7c3aed',
      features: [
        '수출입 통관 대행',
        '해상/항공 운송',
        'FBA/FBM 입고 대행',
        '관세 컨설팅',
        '글로벌 라스트마일',
        '실시간 화물 추적'
      ],
      benefits: ['28개국 배송 커버리지', '통관 성공률 99.5%', '운송비 20% 절감']
    },
    {
      id: 'cold',
      icon: <Thermometer size={40} />,
      name: '콜드체인',
      shortDesc: '온도 관리 신선/의약품 물류',
      description: '신선식품과 의약품을 위한 온도 관리 물류입니다. IoT 센서로 실시간 온도를 모니터링하여 품질을 보장합니다.',
      image: '/images/cold-chain.jpg',
      color: '#0d9488',
      features: [
        '실시간 온도 모니터링',
        '냉장/냉동 보관',
        'HACCP 인증 센터',
        '의약품 GDP 인증',
        '콜드체인 배송',
        '온도 이력 리포트'
      ],
      benefits: ['온도 편차 ±0.5°C', 'HACCP/GDP 인증', '신선도 유지율 99%']
    },
    {
      id: 'transport',
      icon: <Truck size={40} />,
      name: '화물 운송',
      shortDesc: '전국 네트워크 통합 운송',
      description: '전국 물류 네트워크를 통한 화물 운송 서비스입니다. 정기/비정기 배송, 긴급 배송까지 다양한 니즈에 대응합니다.',
      image: '/images/transportation.jpg',
      color: '#ea580c',
      features: [
        '전국 배송 네트워크',
        '정기 배송 서비스',
        '긴급 배송',
        '대형/특수 화물',
        'GPS 실시간 추적',
        '배송 일정 최적화'
      ],
      benefits: ['전국 익일 배송', '정시 배송률 99%', '배송 사고율 0.01%']
    },
    {
      id: 'it',
      icon: <Cpu size={40} />,
      name: '물류 IT 솔루션',
      shortDesc: 'WMS/TMS/OMS 통합 시스템',
      description: '자체 개발한 물류 IT 솔루션으로 물류 현황을 실시간으로 파악하고 효율적으로 관리할 수 있습니다.',
      image: '/images/it-solution.jpg',
      color: '#4f46e5',
      features: [
        'WMS (창고관리시스템)',
        'TMS (운송관리시스템)',
        'OMS (주문관리시스템)',
        'API 연동 지원',
        '대시보드/리포트',
        '커스터마이징'
      ],
      benefits: ['운영 효율 50% 향상', '실시간 데이터 연동', '맞춤형 개발 지원']
    },
  ];

  const industries = [
    { name: '패션/의류', icon: '👕', desc: '시즌별 물량 대응, 반품 처리' },
    { name: '식품/음료', icon: '🍎', desc: '콜드체인, HACCP 인증' },
    { name: '화장품/뷰티', icon: '💄', desc: '소량 다품종, 정교한 관리' },
    { name: '전자제품', icon: '📱', desc: '안전 보관, A/S 물류' },
    { name: '헬스케어', icon: '💊', desc: 'GDP 인증, 의약품 물류' },
    { name: '가구/인테리어', icon: '🛋️', desc: '대형 화물, 설치 배송' },
  ];

  return (
    <div className="catalog-page">
      {/* Hero Section */}
      <section className="catalog-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content"
          >
            <span className="hero-badge">SERVICES</span>
            <h1>통합 물류 서비스</h1>
            <p>
              비즈니스 규모와 업종에 최적화된<br />
              맞춤형 물류 솔루션을 제공합니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                className={`service-card ${activeService === service.id ? 'active' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
              >
                <div className="card-header" style={{ background: service.color }}>
                  <div className="card-icon">{service.icon}</div>
                  <h3>{service.name}</h3>
                  <p>{service.shortDesc}</p>
                </div>
                
                <div className="card-body">
                  <p className="card-description">{service.description}</p>
                  
                  <div className="card-features">
                    <h4>주요 서비스</h4>
                    <ul>
                      {service.features.slice(0, 4).map((feature, fidx) => (
                        <li key={fidx}>
                          <CheckCircle2 size={16} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card-benefits">
                    {service.benefits.map((benefit, bidx) => (
                      <span key={bidx} className="benefit-tag">{benefit}</span>
                    ))}
                  </div>

                  <Link to="/pricing" className="btn btn-primary card-btn">
                    견적 문의 <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="industries-section section section-gray">
        <div className="container">
          <div className="section-header">
            <h2>산업별 맞춤 솔루션</h2>
            <p>다양한 산업군의 물류 노하우를 보유하고 있습니다</p>
          </div>

          <div className="industries-grid">
            {industries.map((industry, idx) => (
              <motion.div
                key={idx}
                className="industry-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <span className="industry-icon">{industry.icon}</span>
                <h4>{industry.name}</h4>
                <p>{industry.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section section">
        <div className="container">
          <div className="section-header">
            <h2>서비스 도입 프로세스</h2>
            <p>간단한 4단계로 물류 서비스를 시작하세요</p>
          </div>

          <div className="process-timeline">
            <div className="process-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h4>상담 신청</h4>
                <p>물류 현황과 니즈를 파악합니다</p>
              </div>
            </div>
            <div className="process-line" />
            <div className="process-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h4>현장 방문</h4>
                <p>전문가가 직접 분석합니다</p>
              </div>
            </div>
            <div className="process-line" />
            <div className="process-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h4>맞춤 제안</h4>
                <p>최적의 솔루션을 제안합니다</p>
              </div>
            </div>
            <div className="process-line" />
            <div className="process-step">
              <div className="step-number">04</div>
              <div className="step-content">
                <h4>서비스 시작</h4>
                <p>물류 운영을 개시합니다</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="catalog-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>물류 서비스가 필요하신가요?</h2>
            <p>전문 컨설턴트가 최적의 솔루션을 제안해드립니다</p>
            <div className="cta-buttons">
              <Link to="/pricing" className="btn btn-accent btn-lg">
                견적 문의하기 <ArrowRight size={20} />
              </Link>
              <a href="tel:1566-0000" className="btn btn-outline btn-lg">
                <Phone size={20} />
                1566-0000
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {activeService && (
        <div className="modal-overlay" onClick={() => setActiveService(null)}>
          <motion.div
            className="service-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const service = services.find(s => s.id === activeService);
              return (
                <>
                  <div className="modal-header" style={{ background: service.color }}>
                    <div className="modal-icon">{service.icon}</div>
                    <div>
                      <h2>{service.name}</h2>
                      <p>{service.shortDesc}</p>
                    </div>
                    <button className="modal-close" onClick={() => setActiveService(null)}>×</button>
                  </div>
                  
                  <div className="modal-body">
                    <p className="modal-desc">{service.description}</p>
                    
                    <div className="modal-features">
                      <h4>제공 서비스</h4>
                      <ul>
                        {service.features.map((feature, idx) => (
                          <li key={idx}>
                            <CheckCircle2 size={18} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="modal-benefits">
                      <h4>기대 효과</h4>
                      <div className="benefits-grid">
                        {service.benefits.map((benefit, idx) => (
                          <div key={idx} className="benefit-item">{benefit}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="modal-actions">
                      <Link to="/pricing" className="btn btn-primary btn-lg">
                        견적 문의하기
                      </Link>
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
