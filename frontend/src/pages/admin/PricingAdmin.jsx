import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  DollarSign,
  FileText,
  Download,
  Filter
} from 'lucide-react';

const PricingAdmin = () => {
  const [activeTab, setActiveTab] = useState('pricing');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 가격 기준 데이터
  const [pricingCategories, setPricingCategories] = useState([
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
  ]);

  // 견적 요청 데이터
  const [quotes, setQuotes] = useState([
    { id: 1, company: '(주)테크솔루션', contact: '김담당', email: 'kim@techsol.com', phone: '010-1234-5678', serviceType: '이커머스 풀필먼트', message: '월 출고량 5,000건 예상', date: '2025.12.30', status: 'pending' },
    { id: 2, company: '글로벌트레이드', contact: '박매니저', email: 'park@globaltrade.com', phone: '010-2345-6789', serviceType: '글로벌 물류', message: '중국발 미국행 FCL 문의', date: '2025.12.29', status: 'contacted' },
    { id: 3, company: '푸드프레시', contact: '이대리', email: 'lee@foodfresh.co.kr', phone: '010-3456-7890', serviceType: '콜드체인', message: '냉동 식품 보관 및 배송', date: '2025.12.28', status: 'completed' },
    { id: 4, company: '패션하우스', contact: '최차장', email: 'choi@fashionhouse.kr', phone: '010-4567-8901', serviceType: 'B2B 물류', message: '시즌 상품 대량 입출고', date: '2025.12.27', status: 'pending' },
  ]);

  // 모달 폼 데이터
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    unit: '',
    price: '',
    description: ''
  });

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    if (type === 'edit' && item) {
      setEditingItem(item);
      setFormData({
        category: item.category || '',
        name: item.name,
        unit: item.unit,
        price: item.price,
        description: item.description
      });
    } else {
      setFormData({
        category: '',
        name: '',
        unit: '',
        price: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      category: '',
      name: '',
      unit: '',
      price: '',
      description: ''
    });
  };

  const handleSavePricing = () => {
    if (modalType === 'add') {
      // 새 항목 추가 로직
      console.log('Adding new pricing item:', formData);
    } else {
      // 수정 로직
      console.log('Editing pricing item:', editingItem, formData);
    }
    handleCloseModal();
  };

  const handleDeletePricing = (categoryId, itemId) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setPricingCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
            : cat
        )
      );
    }
  };

  const handleStatusChange = (quoteId, newStatus) => {
    setQuotes(prev => 
      prev.map(q => q.id === quoteId ? { ...q, status: newStatus } : q)
    );
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'contacted': return '연락완료';
      case 'completed': return '처리완료';
      default: return status;
    }
  };

  const filteredQuotes = quotes.filter(q => 
    q.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pricing-admin">
      <div className="admin-page-header">
        <h1>요금 관리</h1>
        <p>가격 기준을 수정하고 견적 요청을 관리합니다.</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          <DollarSign size={18} />
          가격 기준
        </button>
        <button 
          className={`admin-tab ${activeTab === 'quotes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quotes')}
        >
          <FileText size={18} />
          견적 요청
          <span className="tab-badge">{quotes.filter(q => q.status === 'pending').length}</span>
        </button>
      </div>

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="admin-toolbar">
            <button 
              className="admin-btn admin-btn-primary"
              onClick={() => handleOpenModal('add')}
            >
              <Plus size={18} />
              가격 항목 추가
            </button>
          </div>

          {pricingCategories.map((category) => (
            <div key={category.id} className="admin-card">
              <div className="admin-card-header">
                <h2>{category.category}</h2>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>항목명</th>
                    <th>단위</th>
                    <th>가격</th>
                    <th>설명</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {category.items.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td>{item.unit}</td>
                      <td className="price-cell">{item.price}</td>
                      <td>{item.description}</td>
                      <td className="actions">
                        <button 
                          className="action-btn edit"
                          onClick={() => handleOpenModal('edit', { ...item, category: category.category })}
                        >
                          <Edit2 size={14} />
                          수정
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDeletePricing(category.id, item.id)}
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
          ))}
        </motion.div>
      )}

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="admin-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="회사명, 담당자, 서비스로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select className="filter-select">
                <option value="">전체 상태</option>
                <option value="pending">대기중</option>
                <option value="contacted">연락완료</option>
                <option value="completed">처리완료</option>
              </select>
              <button className="admin-btn admin-btn-secondary">
                <Download size={18} />
                내보내기
              </button>
            </div>
          </div>

          <div className="admin-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>회사명</th>
                  <th>담당자</th>
                  <th>연락처</th>
                  <th>서비스 유형</th>
                  <th>요청일</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id}>
                    <td><strong>{quote.company}</strong></td>
                    <td>{quote.contact}</td>
                    <td>
                      <div className="contact-info">
                        <div>{quote.email}</div>
                        <div className="phone">{quote.phone}</div>
                      </div>
                    </td>
                    <td>{quote.serviceType}</td>
                    <td>{quote.date}</td>
                    <td>
                      <select 
                        className={`status-select ${quote.status}`}
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                      >
                        <option value="pending">대기중</option>
                        <option value="contacted">연락완료</option>
                        <option value="completed">처리완료</option>
                      </select>
                    </td>
                    <td className="actions">
                      <button className="action-btn edit">
                        <Edit2 size={14} />
                        상세
                      </button>
                      <button className="action-btn delete">
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
                <h2>{modalType === 'add' ? '가격 항목 추가' : '가격 항목 수정'}</h2>
                <button className="modal-close-btn" onClick={handleCloseModal}>
                  <X size={20} />
                </button>
              </div>
              <div className="admin-modal-body">
                <div className="admin-form">
                  <div className="form-group">
                    <label>카테고리</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">카테고리 선택</option>
                      {pricingCategories.map((cat) => (
                        <option key={cat.id} value={cat.category}>{cat.category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>항목명</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="예: 입고 처리"
                      />
                    </div>
                    <div className="form-group">
                      <label>단위</label>
                      <input
                        type="text"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="예: 박스당"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>가격</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="예: 500원~"
                    />
                  </div>
                  <div className="form-group">
                    <label>설명</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="가격 항목에 대한 간단한 설명"
                    />
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button className="admin-btn admin-btn-secondary" onClick={handleCloseModal}>
                  취소
                </button>
                <button className="admin-btn admin-btn-primary" onClick={handleSavePricing}>
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

        .tab-badge {
          background: #ef4444;
          color: white;
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .price-cell {
          color: var(--apex-blue);
          font-weight: 600;
        }

        .contact-info {
          font-size: 0.875rem;
        }

        .contact-info .phone {
          color: var(--apex-gray-400);
          font-size: 0.8125rem;
        }

        .status-select {
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }

        .status-select.pending {
          background: #fef3c7;
          color: #d97706;
        }

        .status-select.contacted {
          background: #dbeafe;
          color: #2563eb;
        }

        .status-select.completed {
          background: #dcfce7;
          color: #16a34a;
        }
      `}</style>
    </div>
  );
};

export default PricingAdmin;

