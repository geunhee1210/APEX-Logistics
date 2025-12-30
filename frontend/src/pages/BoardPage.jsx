import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  MessageSquare, 
  Eye, 
  Clock, 
  Pin, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  HelpCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Headphones
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import './BoardPage.css';

const BoardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const { user } = useAuth();
  
  const selectedCategory = searchParams.get('category') || 'notice';
  const postsPerPage = 10;

  const categories = [
    { id: 'notice', name: '공지사항', icon: '📢' },
    { id: 'faq', name: '자주 묻는 질문', icon: '❓' },
    { id: 'qna', name: '1:1 문의', icon: '💬' },
    { id: 'guide', name: '이용 가이드', icon: '📖' },
  ];

  const faqs = [
    {
      q: '물류 서비스 이용 절차가 어떻게 되나요?',
      a: '1) 상담 신청 → 2) 물류 현황 분석 → 3) 맞춤 견적 제안 → 4) 계약 체결 → 5) 시스템 연동 → 6) 서비스 시작 순으로 진행됩니다. 평균 2~4주 내에 서비스 시작이 가능합니다.'
    },
    {
      q: '최소 물량 기준이 있나요?',
      a: '서비스 유형에 따라 최소 물량 기준이 상이합니다. 이커머스 풀필먼트의 경우 월 500건 이상, B2B 물류는 별도 협의가 필요합니다. 자세한 내용은 상담을 통해 안내해 드립니다.'
    },
    {
      q: '정산은 어떻게 이루어지나요?',
      a: '월별 정산을 기본으로 하며, 매월 초에 전월 서비스 이용 내역에 대한 상세 청구서를 발송해 드립니다. 세금계산서는 익월 10일 내에 발행됩니다.'
    },
    {
      q: 'WMS 시스템 연동이 가능한가요?',
      a: '네, 가능합니다. 카페24, 메이크샵, 고도몰, 쇼피파이 등 주요 이커머스 플랫폼과 API 연동을 지원합니다. 자체 ERP 시스템 연동도 커스터마이징 개발을 통해 지원합니다.'
    },
    {
      q: '반품 처리는 어떻게 진행되나요?',
      a: '반품 수거부터 검수, 재입고까지 원스톱으로 처리합니다. 반품 사유별 분류 및 사진 촬영 후 고객사에 리포트를 제공해 드립니다.'
    },
    {
      q: '전국 배송이 가능한가요?',
      a: '네, 전국 익일 배송 네트워크를 구축하고 있습니다. 수도권의 경우 당일 배송도 지원합니다. 제주 및 도서산간 지역은 1~2일 추가 소요될 수 있습니다.'
    },
    {
      q: '해외 배송도 지원하나요?',
      a: '네, 28개국 글로벌 배송 네트워크를 통해 해외 직배송 서비스를 제공합니다. FBA/FBM 입고 대행, 수출입 통관 대행도 가능합니다.'
    },
    {
      q: '물류센터 방문 견학이 가능한가요?',
      a: '네, 사전 예약을 통해 물류센터 견학이 가능합니다. 상담 신청 시 방문 견학 희망 일자를 말씀해 주시면 일정을 조율해 드립니다.'
    },
  ];

  // 게시물 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      if (selectedCategory === 'faq') {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: postsPerPage,
          category: selectedCategory,
          ...(searchTerm && { search: searchTerm })
        };
        
        const response = await postAPI.getPosts(params);
        if (response.success) {
          setPosts(response.posts);
          setTotalPages(response.pagination.totalPages);
        }
      } catch (error) {
        console.error('게시물 불러오기 실패:', error);
        // 에러 시 샘플 데이터 표시
        setPosts([
          { id: 1, title: '[안내] 2025년 1월 물류비 정산 안내', category: 'notice', authorName: '관리자', createdAt: '2025-01-02', views: 234, commentCount: 0 },
          { id: 2, title: '[공지] 설 연휴 기간 배송 일정 안내', category: 'notice', authorName: '관리자', createdAt: '2025-01-15', views: 567, commentCount: 3 },
          { id: 3, title: '[업데이트] WMS 시스템 업데이트 안내 (v3.2.1)', category: 'notice', authorName: '관리자', createdAt: '2025-01-20', views: 189, commentCount: 1 },
        ]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, currentPage, searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId) || { name: categoryId, icon: '📄' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="board-page support-page">
      {/* Header */}
      <section className="board-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="header-badge">SUPPORT</span>
            <h1>고객지원</h1>
            <p>궁금한 점이 있으신가요? 언제든지 문의해 주세요.</p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Bar */}
      <section className="quick-contact-bar">
        <div className="container">
          <div className="contact-items">
            <a href="tel:1566-0000" className="contact-item">
              <Phone size={20} />
              <div>
                <span>대표전화</span>
                <strong>1566-0000</strong>
              </div>
            </a>
            <a href="mailto:support@apexlogistics.kr" className="contact-item">
              <Mail size={20} />
              <div>
                <span>이메일 문의</span>
                <strong>support@apexlogistics.kr</strong>
              </div>
            </a>
            <div className="contact-item">
              <Headphones size={20} />
              <div>
                <span>운영시간</span>
                <strong>평일 09:00~18:00</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="board-layout">
          {/* Sidebar */}
          <aside className="board-sidebar">
            <nav className="category-nav">
              <h3>고객지원</h3>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setSearchParams({ category: cat.id });
                    setCurrentPage(1);
                  }}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </nav>

            {/* Contact Card */}
            <div className="support-contact-card">
              <h4>빠른 상담이 필요하신가요?</h4>
              <p>전문 상담사가 친절히 안내해 드립니다.</p>
              <a href="tel:1566-0000" className="btn btn-primary">
                <Phone size={18} />
                전화 상담
              </a>
            </div>
          </aside>

          {/* Main Content */}
          <main className="board-main">
            {/* FAQ Section */}
            {selectedCategory === 'faq' ? (
              <div className="faq-section">
                <div className="faq-header">
                  <HelpCircle size={24} />
                  <h2>자주 묻는 질문</h2>
                </div>
                <p className="faq-desc">물류 서비스 이용에 관한 궁금한 점을 확인해 보세요.</p>

                <div className="faq-list">
                  {faqs.map((faq, idx) => (
                    <motion.div
                      key={idx}
                      className={`faq-item ${openFaq === idx ? 'open' : ''}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <button
                        className="faq-question"
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      >
                        <span className="q-mark">Q</span>
                        <span className="q-text">{faq.q}</span>
                        <ChevronDown size={20} className={`faq-arrow ${openFaq === idx ? 'open' : ''}`} />
                      </button>
                      {openFaq === idx && (
                        <motion.div
                          className="faq-answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                        >
                          <span className="a-mark">A</span>
                          <p>{faq.a}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="faq-cta">
                  <p>찾으시는 답변이 없으신가요?</p>
                  <Link to="/community?category=qna" className="btn btn-outline">
                    <MessageSquare size={18} />
                    1:1 문의하기
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Search & Write */}
                <div className="board-toolbar">
                  <div className="search-box">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="검색어를 입력하세요..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  {user && selectedCategory === 'qna' && (
                    <Link to="/community/write" className="btn btn-primary">
                      <Plus size={18} />
                      문의하기
                    </Link>
                  )}
                </div>

                {/* Posts List */}
                <div className="posts-list">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="post-item skeleton-item">
                        <div className="skeleton" style={{ width: '80px', height: '20px', marginBottom: '8px' }} />
                        <div className="skeleton" style={{ width: '100%', height: '24px', marginBottom: '8px' }} />
                        <div className="skeleton" style={{ width: '60%', height: '16px' }} />
                      </div>
                    ))
                  ) : (
                    <>
                      {posts.map((post, idx) => (
                        <motion.div
                          key={post.id}
                          className={`post-item ${post.category === 'notice' ? 'notice' : ''}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <Link to={`/community/${post.id}`}>
                            <div className="post-badges">
                              {post.category === 'notice' && (
                                <span className="badge-pin"><Pin size={12} /> 공지</span>
                              )}
                              <span className="badge-category">
                                {getCategoryInfo(post.category).icon} {getCategoryInfo(post.category).name}
                              </span>
                            </div>
                            <h3 className="post-title">{post.title}</h3>
                            <div className="post-meta">
                              <span className="author">{post.authorName}</span>
                              <span className="meta-item"><Clock size={14} /> {formatDate(post.createdAt)}</span>
                              <span className="meta-item"><Eye size={14} /> {post.views}</span>
                              {post.commentCount > 0 && (
                                <span className="meta-item"><MessageSquare size={14} /> {post.commentCount}</span>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}

                      {posts.length === 0 && (
                        <div className="no-posts">
                          <FileText size={48} />
                          <p>등록된 게시글이 없습니다.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
