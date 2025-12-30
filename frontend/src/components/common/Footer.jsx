import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Linkedin, Youtube, FileText } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" fill="url(#footer-logo-gradient)" />
                  <path d="M20 12L28 16V24L20 28L12 24V16L20 12Z" fill="white" fillOpacity="0.9" />
                  <defs>
                    <linearGradient id="footer-logo-gradient" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2563eb" />
                      <stop offset="1" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="logo-text-group">
                <span className="logo-text">APEX</span>
                <span className="logo-highlight">Logistics</span>
              </div>
            </Link>
            <p className="footer-desc">
              대기업 전문 통합 물류 솔루션 파트너.<br />
              Beyond Logistics, Business Partner.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" aria-label="Youtube"><Youtube size={20} /></a>
              <a href="#" aria-label="블로그"><FileText size={20} /></a>
            </div>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>서비스</h4>
            <ul>
              <li><Link to="/catalog">이커머스 풀필먼트</Link></li>
              <li><Link to="/catalog">B2B 물류</Link></li>
              <li><Link to="/catalog">글로벌 물류</Link></li>
              <li><Link to="/catalog">콜드체인</Link></li>
              <li><Link to="/catalog">물류 IT 솔루션</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>고객지원</h4>
            <ul>
              <li><Link to="/community">공지사항</Link></li>
              <li><Link to="/community">자주 묻는 질문</Link></li>
              <li><Link to="/pricing">요금 안내</Link></li>
              <li><Link to="/insights">인사이트</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4>회사</h4>
            <ul>
              <li><a href="#">회사 소개</a></li>
              <li><a href="#">연혁</a></li>
              <li><a href="#">인재 채용</a></li>
              <li><a href="#">뉴스룸</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section footer-contact">
            <h4>문의</h4>
            <ul className="contact-list">
              <li>
                <Phone size={16} />
                <div>
                  <span>고객센터</span>
                  <strong>1566-0000</strong>
                </div>
              </li>
              <li>
                <Mail size={16} />
                <div>
                  <span>이메일</span>
                  <strong>contact@apexlogistics.kr</strong>
                </div>
              </li>
              <li>
                <MapPin size={16} />
                <div>
                  <span>본사</span>
                  <strong>서울시 강남구 테헤란로 123</strong>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div className="footer-info">
            <p>
              <strong>APEX Logistics(주)</strong> | 대표이사: 홍길동 | 사업자등록번호: 123-45-67890
            </p>
            <p>서울시 강남구 테헤란로 123, APEX타워 15층 | 통신판매업신고: 제2024-서울강남-0000호</p>
          </div>
          <div className="footer-links">
            <a href="#">이용약관</a>
            <span>|</span>
            <a href="#" className="privacy">개인정보처리방침</a>
            <span>|</span>
            <a href="#">물류센터 안내</a>
          </div>
          <p className="footer-copyright">© {currentYear} APEX Logistics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
