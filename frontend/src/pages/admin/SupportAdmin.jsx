import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  GripVertical
} from 'lucide-react';

const SupportAdmin = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // 공지사항 데이터
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: '2025년 설날 연휴 운영 안내', content: '설날 연휴 기간 물류센터 운영 시간 안내드립니다.', type: 'notice', isPinned: true, date: '2025.01.20', views: 234 },
    { id: 2, title: '신규 콜드체인 서비스 오픈', content: '냉장/냉동 상품 전용 물류 서비스가 오픈되었습니다.', type: 'service', isPinned: false, date: '2025.01.15', views: 567 },
    { id: 3, title: '시스템 점검 안내 (1/25)', content: '시스템 점검으로 인해 일부 서비스가 제한됩니다.', type: 'system', isPinned: false, date: '2025.01.10', views: 123 },
    { id: 4, title: '물류비 정산 시스템 개선', content: '더욱 투명한 물류비 정산 시스템으로 개선되었습니다.', type: 'update', isPinned: false, date: '2025.01.05', views: 89 },
  ]);

  // FAQ 데이터
  const [faqs, setFaqs] = useState([
    { id: 1, category: '서비스 일반', question: 'APEX Logistics의 최소 계약 기간은 어떻게 되나요?', answer: '최소 계약 기간은 없습니다. 단, 물량에 따른 맞춤 견적이 제공되므로 최소 3개월 이상 이용 시 더 경제적인 요금이 적용됩니다.', order: 1 },
    { id: 2, category: '서비스 일반', question: '해외 배송도 가능한가요?', answer: '네, 가능합니다. 당사는 글로벌 물류 네트워크를 통해 200여 개국으로의 해외 배송을 지원합니다.', order: 2 },
    { id: 3, category: '요금 안내', question: '견적은 어떻게 받을 수 있나요?', answer: '요금안내 페이지에서 맞춤 견적을 요청하시거나, 1566-0000으로 전화 문의 주시면 상담 후 견적서를 발송해 드립니다.', order: 3 },
    { id: 4, category: '요금 안내', question: '추가 요금이 발생하는 경우는 언제인가요?', answer: '표준 규격 초과 상품, 특수 포장 요청, 긴급 배송 등의 경우 추가 요금이 발생할 수 있습니다. 사전에 담당자와 협의해 주세요.', order: 4 },
    { id: 5, category: '입출고', question: '입고 예약은 어떻게 하나요?', answer: '관리자 페이지에서 입고 예약을 하실 수 있습니다. 입고 예정일 기준 최소 2영업일 전에 예약해 주시기 바랍니다.', order: 5 },
    { id: 6, category: '배송', question: '당일 출고 마감 시간은 언제인가요?', answer: '당일 출고 마감 시간은 오후 2시입니다. 마감 이후 접수된 주문은 익영업일 출고됩니다.', order: 6 },
  ]);

  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'notice',
    isPinned: false,
    category: '',
    question: '',
    answer: ''
  });

  const announcementTypes = [
    { value: 'notice', label: '공지' },
    { value: 'service', label: '서비스' },
    { value: 'system', label: '시스템' },
    { value: 'update', label: '업데이트' },
    { value: 'event', label: '이벤트' }
  ];

  const faqCategories = [
    '서비스 일반',
    '요금 안내',
    '입출고',
    '배송',
    '정산',
    '시스템'
  ];

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      setEditingItem(item);
      if (activeTab === 'announcements') {
        setFormData({
          title: item.title,
          content: item.content,
          type: item.type,
          isPinned: item.isPinned
        });
      } else {
        setFormData({
          category: item.category,
          question: item.question,
          answer: item.answer
        });
      }
    } else {
      setFormData({
        title: '',
        content: '',
        type: 'notice',
        isPinned: false,
        category: '',
        question: '',
        answer: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    if (activeTab === 'announcements') {
      if (modalType === 'add') {
        const newAnnouncement = {
          id: Date.now(),
          ...formData,
          date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
          views: 0
        };
        setAnnouncements([newAnnouncement, ...announcements]);
      } else {
        setAnnouncements(announcements.map(a => 
          a.id === editingItem.id ? { ...a, ...formData } : a
        ));
      }
    } else {
      if (modalType === 'add') {
        const newFaq = {
          id: Date.now(),
          ...formData,
          order: faqs.length + 1
        };
        setFaqs([...faqs, newFaq]);
      } else {
        setFaqs(faqs.map(f => 
          f.id === editingItem.id ? { ...f, ...formData } : f
        ));
      }
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      if (activeTab === 'announcements') {
        setAnnouncements(announcements.filter(a => a.id !== id));
      } else {
        setFaqs(faqs.filter(f => f.id !== id));
      }
    }
  };

  const handleTogglePin = (id) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, isPinned: !a.isPinned } : a
    ));
  };

  const getTypeLabel = (type) => {
    return announcementTypes.find(t => t.value === type)?.label || type;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'notice': return 'blue';
      case 'service': return 'teal';
      case 'system': return 'orange';
      case 'update': return 'purple';
      case 'event': return 'pink';
      default: return 'gray';
    }
  };

  const filteredAnnouncements = announcements.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // FAQ를 카테고리별로 그룹화
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  return (
    <div className="support-admin">
      <div className="admin-page-header">
        <h1>고객지원 관리</h1>
        <p>공지사항과 자주 묻는 질문을 관리합니다.</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          <Bell size={18} />
          공지사항
          <span className="tab-count">{announcements.length}</span>
        </button>
        <button 
          className={`admin-tab ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          <HelpCircle size={18} />
          자주 묻는 질문
          <span className="tab-count">{faqs.length}</span>
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder={activeTab === 'announcements' ? '제목으로 검색...' : '질문으로 검색...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          className="admin-btn admin-btn-primary"
          onClick={() => handleOpenModal('add')}
        >
          <Plus size={18} />
          {activeTab === 'announcements' ? '공지사항 추가' : 'FAQ 추가'}
        </button>
      </div>

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="admin-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>고정</th>
                  <th>제목</th>
                  <th>유형</th>
                  <th>조회수</th>
                  <th>작성일</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements
                  .sort((a, b) => b.isPinned - a.isPinned)
                  .map((announcement) => (
                  <tr key={announcement.id} className={announcement.isPinned ? 'pinned' : ''}>
                    <td>
                      <button 
                        className={`pin-btn ${announcement.isPinned ? 'active' : ''}`}
                        onClick={() => handleTogglePin(announcement.id)}
                      >
                        📌
                      </button>
                    </td>
                    <td>
                      <strong>{announcement.title}</strong>
                    </td>
                    <td>
                      <span className={`type-badge ${getTypeColor(announcement.type)}`}>
                        {getTypeLabel(announcement.type)}
                      </span>
                    </td>
                    <td>{announcement.views.toLocaleString()}</td>
                    <td>{announcement.date}</td>
                    <td className="actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleOpenModal('edit', announcement)}
                      >
                        <Edit2 size={14} />
                        수정
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <Trash2 size={14} />
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <div key={category} className="admin-card faq-card">
              <div className="faq-category-header">
                <h3>{category}</h3>
                <span className="faq-count">{categoryFaqs.length}개</span>
              </div>
              <div className="faq-list">
                {categoryFaqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className={`faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}
                  >
                    <div 
                      className="faq-question"
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    >
                      <div className="faq-drag-handle">
                        <GripVertical size={16} />
                      </div>
                      <span className="faq-q">Q.</span>
                      <span className="faq-text">{faq.question}</span>
                      <div className="faq-actions">
                        <button 
                          className="action-btn edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal('edit', faq);
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(faq.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {expandedFaq === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {expandedFaq === faq.id && (
                      <motion.div 
                        className="faq-answer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <span className="faq-a">A.</span>
                        <p>{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="admin-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal-header">
                <h2>
                  {activeTab === 'announcements' 
                    ? (modalType === 'add' ? '공지사항 추가' : '공지사항 수정')
                    : (modalType === 'add' ? 'FAQ 추가' : 'FAQ 수정')
                  }
                </h2>
                <button className="modal-close-btn" onClick={handleCloseModal}>
                  <X size={20} />
                </button>
              </div>
              <div className="admin-modal-body">
                {activeTab === 'announcements' ? (
                  <div className="admin-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>유형</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                          {announcementTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.isPinned}
                            onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                          />
                          상단 고정
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>제목</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="공지사항 제목을 입력하세요"
                      />
                    </div>
                    <div className="form-group">
                      <label>내용</label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="공지사항 내용을 입력하세요"
                        rows={8}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="admin-form">
                    <div className="form-group">
                      <label>카테고리</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">카테고리 선택</option>
                        {faqCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>질문</label>
                      <input
                        type="text"
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="자주 묻는 질문을 입력하세요"
                      />
                    </div>
                    <div className="form-group">
                      <label>답변</label>
                      <textarea
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        placeholder="답변을 입력하세요"
                        rows={6}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="admin-modal-footer">
                <button className="admin-btn admin-btn-secondary" onClick={handleCloseModal}>
                  취소
                </button>
                <button className="admin-btn admin-btn-primary" onClick={handleSave}>
                  {modalType === 'add' ? '추가' : '저장'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-tabs {
          display: flex;
          gap: 4px;
          border-bottom: 1px solid var(--apex-gray-200);
          margin-bottom: 24px;
        }

        .admin-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: transparent;
          border: none;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--apex-gray-500);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all var(--transition-fast);
        }

        .admin-tab:hover {
          color: var(--apex-gray-700);
        }

        .admin-tab.active {
          color: var(--apex-blue);
          border-bottom-color: var(--apex-blue);
        }

        .tab-count {
          background: var(--apex-gray-100);
          color: var(--apex-gray-600);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .pinned td {
          background: #fef3c7;
        }

        .pin-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.125rem;
          opacity: 0.3;
          transition: all var(--transition-fast);
        }

        .pin-btn.active {
          opacity: 1;
        }

        .pin-btn:hover {
          opacity: 1;
        }

        .type-badge {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .type-badge.blue {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .type-badge.teal {
          background: #ccfbf1;
          color: #0f766e;
        }

        .type-badge.orange {
          background: #ffedd5;
          color: #c2410c;
        }

        .type-badge.purple {
          background: #ede9fe;
          color: #6d28d9;
        }

        .type-badge.pink {
          background: #fce7f3;
          color: #be185d;
        }

        /* FAQ Styles */
        .faq-card {
          padding: 0;
        }

        .faq-category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: var(--apex-gray-50);
          border-bottom: 1px solid var(--apex-gray-200);
        }

        .faq-category-header h3 {
          font-size: 1rem;
          color: var(--apex-gray-800);
        }

        .faq-count {
          font-size: 0.8125rem;
          color: var(--apex-gray-500);
        }

        .faq-list {
          padding: 0;
        }

        .faq-item {
          border-bottom: 1px solid var(--apex-gray-100);
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .faq-question:hover {
          background: var(--apex-gray-50);
        }

        .faq-drag-handle {
          color: var(--apex-gray-300);
          cursor: grab;
        }

        .faq-q,
        .faq-a {
          font-weight: 700;
          color: var(--apex-blue);
          flex-shrink: 0;
        }

        .faq-text {
          flex: 1;
          font-size: 0.9375rem;
          color: var(--apex-gray-800);
        }

        .faq-actions {
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .faq-question:hover .faq-actions {
          opacity: 1;
        }

        .faq-answer {
          display: flex;
          gap: 12px;
          padding: 0 24px 20px 60px;
        }

        .faq-answer p {
          color: var(--apex-gray-600);
          line-height: 1.7;
          font-size: 0.9375rem;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SupportAdmin;

