import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  Ship, 
  Plane, 
  Thermometer,
  Calculator,
  FileText,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Info
} from 'lucide-react';
import './PricingPage.css';

const PricingPage = () => {
  const [activeCategory, setActiveCategory] = useState('ecommerce');
  const [openFaq, setOpenFaq] = useState(null);
  const [quoteForm, setQuoteForm] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    category: 'ecommerce',
    volume: '',
    weight: '',
    message: ''
  });

  const categories = [
    {
      id: 'ecommerce',
      name: '이커머스 풀필먼트',
      icon: <Package size={24} />,
      description: '온라인 셀러를 위한 원스톱 물류 서비스',
      priceItems: [
        { name: '입고 처리', unit: '박스당', price: '500원~', note: '상품 검수 포함' },
        { name: '보관료', unit: 'CBM/일', price: '350원~', note: '월 최소 보관료 적용' },
        { name: '출고 처리', unit: '건당', price: '800원~', note: '포장재 별도' },
        { name: '반품 처리', unit: '건당', price: '1,200원~', note: '검수 및 재입고 포함' },
      ],
      features: ['실시간 재고 관리', '당일 출고', 'API 연동', '반품 처리'],
    },
    {
      id: 'b2b',
      name: 'B2B 물류',
      icon: <Truck size={24} />,
      description: '대기업 맞춤형 공급망 솔루션',
      priceItems: [
        { name: '팔레트 보관', unit: 'PLT/일', price: '800원~', note: '규격 팔레트 기준' },
        { name: '크로스도킹', unit: '건당', price: '협의', note: '물량에 따른 단가 협의' },
        { name: 'JIT 배송', unit: '건당', price: '협의', note: '정기 배송 할인 적용' },
        { name: '통합 물류 관리', unit: '월정액', price: '협의', note: '전담 매니저 배정' },
      ],
      features: ['공급망 최적화', 'JIT 배송', 'VMI 운영', '전담 매니저'],
    },
    {
      id: 'global',
      name: '글로벌 물류',
      icon: <Ship size={24} />,
      description: '수출입 통관부터 라스트마일까지',
      priceItems: [
        { name: '해상 운송 (LCL)', unit: 'CBM당', price: '협의', note: '목적지별 상이' },
        { name: '해상 운송 (FCL)', unit: '컨테이너당', price: '협의', note: '20ft/40ft' },
        { name: '항공 운송', unit: 'kg당', price: '협의', note: '중량/부피 중 큰 값 적용' },
        { name: '통관 대행', unit: '건당', price: '50,000원~', note: '서류 대행 포함' },
      ],
      features: ['수출입 통관', 'FBA/FBM', '글로벌 배송', '관세 컨설팅'],
    },
    {
      id: 'air',
      name: '항공 특송',
      icon: <Plane size={24} />,
      description: '긴급 화물을 위한 빠른 배송',
      priceItems: [
        { name: '익스프레스', unit: 'kg당', price: '협의', note: '1~3일 도착' },
        { name: '이코노미', unit: 'kg당', price: '협의', note: '5~7일 도착' },
        { name: '위험물 운송', unit: '건당', price: '협의', note: 'IATA 규정 준수' },
        { name: '냉장/냉동', unit: 'kg당', price: '협의', note: '온도 유지 필수' },
      ],
      features: ['Door-to-Door', '실시간 추적', '위험물 운송', '긴급 배송'],
    },
    {
      id: 'cold',
      name: '콜드체인',
      icon: <Thermometer size={24} />,
      description: '온도 관리가 필요한 식품/의약품',
      priceItems: [
        { name: '냉장 보관 (0~10℃)', unit: 'PLT/일', price: '2,500원~', note: '온도 실시간 모니터링' },
        { name: '냉동 보관 (-18℃ 이하)', unit: 'PLT/일', price: '3,500원~', note: 'HACCP 인증 센터' },
        { name: '냉장 배송', unit: '건당', price: '협의', note: '차량 및 거리별 상이' },
        { name: '의약품 물류', unit: '협의', price: '협의', note: 'GDP 인증 필수' },
      ],
      features: ['실시간 온도 추적', 'HACCP 인증', 'GDP 인증', '의약품 GMP'],
    },
  ];

  const additionalServices = [
    { name: '포장재', items: ['기본 박스 (소): 300원', '기본 박스 (중): 500원', '기본 박스 (대): 800원', '에어캡/완충재: 100원~'] },
    { name: '부가 서비스', items: ['라벨링: 50원/건', '세트 구성: 200원~/건', '사진 촬영: 500원/SKU', '검품: 100원/건'] },
    { name: 'IT 서비스', items: ['WMS 연동: 무료', 'API 연동: 무료', '커스텀 개발: 협의', '데이터 리포트: 월 50,000원~'] },
  ];

  const faqs = [
    {
      q: '견적은 어떻게 받나요?',
      a: '견적 문의 폼을 작성해 주시거나, 고객센터(1566-0000)로 연락 주시면 전문 컨설턴트가 물류 현황을 분석하여 맞춤 견적을 제공해 드립니다. 보통 1~2영업일 내 회신드립니다.',
    },
    {
      q: '최소 물량 기준이 있나요?',
      a: '서비스 유형에 따라 최소 물량 기준이 다릅니다. 이커머스 풀필먼트는 월 100건 이상, B2B 물류는 별도 협의가 필요합니다. 소규모 물량도 상담 후 진행 가능합니다.',
    },
    {
      q: '계약 기간은 얼마인가요?',
      a: '기본 계약 기간은 1년이며, 상호 협의에 따라 단기 계약도 가능합니다. 계약 종료 1개월 전 별도 통보가 없으면 자동 연장됩니다.',
    },
    {
      q: 'CBM은 어떻게 계산하나요?',
      a: 'CBM(Cubic Meter)은 가로(m) × 세로(m) × 높이(m)로 계산됩니다. 예를 들어 50cm × 40cm × 30cm 박스는 0.5 × 0.4 × 0.3 = 0.06 CBM입니다.',
    },
    {
      q: '정산은 어떻게 이루어지나요?',
      a: '매월 말일 기준으로 정산하며, 익월 10일까지 세금계산서를 발행합니다. 결제는 발행일로부터 30일 이내 계좌이체로 진행됩니다.',
    },
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setQuoteForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('견적 문의가 접수되었습니다. 담당자가 곧 연락드리겠습니다.');
  };

  const activeService = categories.find(c => c.id === activeCategory);

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content"
          >
            <span className="hero-badge">PRICING</span>
            <h1>요금 안내</h1>
            <p>
              물류 서비스 요금은 물품 종류, 무게, 부피, 수량에 따라<br />
              맞춤 견적으로 제공됩니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <div className="tab-icon">{cat.icon}</div>
                <span>{cat.name}</span>
              </button>
            ))}
            </div>
        </div>
      </section>

      {/* Pricing Details */}
      <section className="pricing-details-section">
        <div className="container">
          <div className="pricing-content">
              <motion.div
              className="pricing-info"
              key={activeCategory}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="service-header">
                <div className="service-icon">{activeService.icon}</div>
                <div>
                  <h2>{activeService.name}</h2>
                  <p>{activeService.description}</p>
                </div>
              </div>

              <div className="price-table">
                <div className="price-table-header">
                  <span>항목</span>
                  <span>단위</span>
                  <span>단가</span>
                  <span>비고</span>
                </div>
                {activeService.priceItems.map((item, idx) => (
                  <div key={idx} className="price-row">
                    <span className="item-name">{item.name}</span>
                    <span className="item-unit">{item.unit}</span>
                    <span className="item-price">{item.price}</span>
                    <span className="item-note">{item.note}</span>
                  </div>
                ))}
              </div>

              <div className="service-features">
                <h4>포함 서비스</h4>
                <div className="features-list">
                  {activeService.features.map((feature, idx) => (
                    <span key={idx} className="feature-tag">
                      <CheckCircle2 size={14} />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pricing-notice">
                <Info size={18} />
                <p>
                  표시된 단가는 기본 요금이며, 실제 요금은 물량, 계약 기간, 
                  상품 특성에 따라 달라질 수 있습니다. 정확한 견적은 문의 후 안내드립니다.
                </p>
              </div>
            </motion.div>

            {/* Quote Form */}
            <div className="quote-form-card">
              <div className="form-header">
                <Calculator size={24} />
                <h3>맞춤 견적 받기</h3>
                <p>전문 컨설턴트가 최적의 견적을 제안해드립니다</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>회사명</label>
                    <input 
                      type="text" 
                      name="company"
                      value={quoteForm.company}
                      onChange={handleFormChange}
                      placeholder="회사명을 입력하세요"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>담당자명</label>
                    <input 
                      type="text" 
                      name="name"
                      value={quoteForm.name}
                      onChange={handleFormChange}
                      placeholder="담당자명을 입력하세요"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>이메일</label>
                    <input 
                      type="email" 
                      name="email"
                      value={quoteForm.email}
                      onChange={handleFormChange}
                      placeholder="이메일을 입력하세요"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>연락처</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={quoteForm.phone}
                      onChange={handleFormChange}
                      placeholder="연락처를 입력하세요"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>서비스 유형</label>
                  <select 
                    name="category"
                    value={quoteForm.category}
                    onChange={handleFormChange}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>예상 월 물량 (건)</label>
                    <input 
                      type="text" 
                      name="volume"
                      value={quoteForm.volume}
                      onChange={handleFormChange}
                      placeholder="예: 1,000건"
                    />
                  </div>
                  <div className="form-group">
                    <label>평균 무게 (kg)</label>
                    <input 
                      type="text" 
                      name="weight"
                      value={quoteForm.weight}
                      onChange={handleFormChange}
                      placeholder="예: 2kg"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>추가 요청사항</label>
                  <textarea 
                    name="message"
                    value={quoteForm.message}
                    onChange={handleFormChange}
                    placeholder="상품 특성, 특별 요구사항 등을 알려주세요"
                    rows={4}
                  />
                </div>

                <button type="submit" className="btn btn-accent btn-lg submit-btn">
                  견적 문의하기
                  <ArrowRight size={20} />
                </button>
              </form>

              <div className="contact-direct">
                <p>빠른 상담을 원하시면</p>
                <div className="contact-options">
                  <a href="tel:1566-0000">
                    <Phone size={16} />
                    1566-0000
                  </a>
                  <a href="mailto:quote@apexlogistics.kr">
                    <Mail size={16} />
                    quote@apexlogistics.kr
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="additional-section section section-gray">
        <div className="container">
          <div className="section-header">
            <h2>부가 서비스 요금</h2>
            <p>기본 서비스 외 추가로 제공되는 서비스입니다</p>
          </div>

          <div className="additional-grid">
            {additionalServices.map((service, idx) => (
              <motion.div
                key={idx}
                className="additional-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3>{service.name}</h3>
                <ul>
                  {service.items.map((item, iidx) => (
                    <li key={iidx}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section section">
        <div className="container">
          <div className="section-header">
            <h2>자주 묻는 질문</h2>
            <p>요금 관련 궁금한 점을 확인하세요</p>
          </div>
          
          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                className={`faq-item ${openFaq === idx ? 'open' : ''}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <HelpCircle size={20} />
                  <span>{faq.q}</span>
                  <ChevronDown size={20} className="faq-chevron" />
                </button>
                {openFaq === idx && (
                  <motion.div
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                  >
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>지금 바로 상담받으세요</h2>
            <p>물류 전문가가 귀사에 최적화된 솔루션을 제안해드립니다</p>
            <div className="cta-buttons">
              <a href="tel:1566-0000" className="btn btn-accent btn-lg">
                <Phone size={20} />
                1566-0000
              </a>
              <a href="#quote-form" className="btn btn-outline btn-lg">
                <FileText size={20} />
                견적 문의
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
