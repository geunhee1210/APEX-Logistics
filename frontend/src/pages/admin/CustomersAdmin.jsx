import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Building2,
  Calendar,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  X,
  User,
  Package,
  TrendingUp,
  Clock
} from 'lucide-react';

const CustomersAdmin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 고객 데이터
  const [customers, setCustomers] = useState([
    {
      id: 1,
      company: '(주)테크솔루션',
      contact: '김담당',
      email: 'kim@techsol.com',
      phone: '010-1234-5678',
      service: '이커머스 풀필먼트',
      status: 'active',
      joinDate: '2024.06.15',
      lastActivity: '2025.12.30',
      monthlyVolume: '5,200건',
      totalSpent: '₩45,600,000'
    },
    {
      id: 2,
      company: '글로벌트레이드',
      contact: '박매니저',
      email: 'park@globaltrade.com',
      phone: '010-2345-6789',
      service: '글로벌 물류',
      status: 'active',
      joinDate: '2024.03.20',
      lastActivity: '2025.12.29',
      monthlyVolume: '120 TEU',
      totalSpent: '₩234,000,000'
    },
    {
      id: 3,
      company: '푸드프레시',
      contact: '이대리',
      email: 'lee@foodfresh.co.kr',
      phone: '010-3456-7890',
      service: '콜드체인',
      status: 'pending',
      joinDate: '2025.01.05',
      lastActivity: '2025.12.28',
      monthlyVolume: '-',
      totalSpent: '₩0'
    },
    {
      id: 4,
      company: '패션하우스',
      contact: '최차장',
      email: 'choi@fashionhouse.kr',
      phone: '010-4567-8901',
      service: 'B2B 물류',
      status: 'active',
      joinDate: '2024.09.10',
      lastActivity: '2025.12.27',
      monthlyVolume: '1,800 PLT',
      totalSpent: '₩89,400,000'
    },
    {
      id: 5,
      company: '헬스케어플러스',
      contact: '정과장',
      email: 'jung@healthcareplus.kr',
      phone: '010-5678-9012',
      service: '의료물류',
      status: 'inactive',
      joinDate: '2024.01.15',
      lastActivity: '2025.10.15',
      monthlyVolume: '0건',
      totalSpent: '₩12,300,000'
    },
    {
      id: 6,
      company: '스마트일렉트로닉스',
      contact: '송부장',
      email: 'song@smartelec.com',
      phone: '010-6789-0123',
      service: '이커머스 풀필먼트',
      status: 'active',
      joinDate: '2024.08.01',
      lastActivity: '2025.12.30',
      monthlyVolume: '12,500건',
      totalSpent: '₩156,200,000'
    },
  ]);

  const services = [
    '이커머스 풀필먼트',
    'B2B 물류',
    '글로벌 물류',
    '콜드체인',
    '의료물류',
    '위험물 물류'
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge active">이용중</span>;
      case 'pending':
        return <span className="status-badge pending">상담중</span>;
      case 'inactive':
        return <span className="status-badge inactive">휴면</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleExport = () => {
    // CSV 내보내기 로직
    alert('고객 데이터를 CSV로 내보내기합니다.');
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    const matchesService = !serviceFilter || c.service === serviceFilter;
    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div className="customers-admin">
      <div className="admin-page-header">
        <h1>고객 데이터</h1>
        <p>고객 정보를 조회하고 관리합니다.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid customer-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>전체 고객</h3>
            <div className="stat-value">{customers.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>이용중</h3>
            <div className="stat-value">{customers.filter(c => c.status === 'active').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>상담중</h3>
            <div className="stat-value">{customers.filter(c => c.status === 'pending').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>이번 달 신규</h3>
            <div className="stat-value">2</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="회사명, 담당자, 이메일로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">전체 상태</option>
            <option value="active">이용중</option>
            <option value="pending">상담중</option>
            <option value="inactive">휴면</option>
          </select>
          <select 
            className="filter-select"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="">전체 서비스</option>
            {services.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={handleExport}
          >
            <Download size={18} />
            내보내기
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="admin-card">
        <table className="admin-table customers-table">
          <thead>
            <tr>
              <th>회사명</th>
              <th>담당자</th>
              <th>연락처</th>
              <th>서비스</th>
              <th>상태</th>
              <th>최근 활동</th>
              <th>월 물량</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="company-cell">
                    <div className="company-avatar">
                      {customer.company.charAt(0)}
                    </div>
                    <strong>{customer.company}</strong>
                  </div>
                </td>
                <td>{customer.contact}</td>
                <td>
                  <div className="contact-info">
                    <div className="contact-email">
                      <Mail size={14} />
                      {customer.email}
                    </div>
                    <div className="contact-phone">
                      <Phone size={14} />
                      {customer.phone}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="service-tag">{customer.service}</span>
                </td>
                <td>{getStatusBadge(customer.status)}</td>
                <td>{customer.lastActivity}</td>
                <td className="volume-cell">{customer.monthlyVolume}</td>
                <td className="actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleViewDetails(customer)}
                  >
                    <Eye size={14} />
                    상세
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedCustomer && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              className="admin-modal customer-detail-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal-header">
                <h2>고객 상세 정보</h2>
                <button className="modal-close-btn" onClick={() => setShowDetailModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="admin-modal-body">
                <div className="customer-profile">
                  <div className="profile-avatar">
                    {selectedCustomer.company.charAt(0)}
                  </div>
                  <div className="profile-info">
                    <h3>{selectedCustomer.company}</h3>
                    {getStatusBadge(selectedCustomer.status)}
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="detail-section">
                    <h4>기본 정보</h4>
                    <div className="detail-row">
                      <span className="detail-label">담당자</span>
                      <span className="detail-value">{selectedCustomer.contact}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">이메일</span>
                      <span className="detail-value">{selectedCustomer.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">연락처</span>
                      <span className="detail-value">{selectedCustomer.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">가입일</span>
                      <span className="detail-value">{selectedCustomer.joinDate}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>이용 정보</h4>
                    <div className="detail-row">
                      <span className="detail-label">서비스</span>
                      <span className="detail-value">{selectedCustomer.service}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">월 물량</span>
                      <span className="detail-value">{selectedCustomer.monthlyVolume}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">누적 거래액</span>
                      <span className="detail-value highlight">{selectedCustomer.totalSpent}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">최근 활동</span>
                      <span className="detail-value">{selectedCustomer.lastActivity}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>최근 거래 내역</h4>
                  <div className="transaction-list">
                    <div className="transaction-item">
                      <div className="transaction-icon">
                        <Package size={16} />
                      </div>
                      <div className="transaction-info">
                        <span className="transaction-title">출고 처리</span>
                        <span className="transaction-detail">320건 / 2025.12.30</span>
                      </div>
                      <span className="transaction-amount">₩256,000</span>
                    </div>
                    <div className="transaction-item">
                      <div className="transaction-icon">
                        <Package size={16} />
                      </div>
                      <div className="transaction-info">
                        <span className="transaction-title">입고 처리</span>
                        <span className="transaction-detail">150박스 / 2025.12.28</span>
                      </div>
                      <span className="transaction-amount">₩75,000</span>
                    </div>
                    <div className="transaction-item">
                      <div className="transaction-icon">
                        <Calendar size={16} />
                      </div>
                      <div className="transaction-info">
                        <span className="transaction-title">월 정산</span>
                        <span className="transaction-detail">2025년 11월</span>
                      </div>
                      <span className="transaction-amount">₩3,840,000</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button className="admin-btn admin-btn-secondary">
                  <Mail size={18} />
                  이메일 발송
                </button>
                <button className="admin-btn admin-btn-primary">
                  <Edit2 size={18} />
                  정보 수정
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .customer-stats {
          margin-bottom: 24px;
        }

        .company-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .company-avatar {
          width: 36px;
          height: 36px;
          background: var(--apex-blue);
          color: var(--apex-white);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .contact-email,
        .contact-phone {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
        }

        .contact-email {
          color: var(--apex-gray-700);
        }

        .contact-phone {
          color: var(--apex-gray-400);
        }

        .service-tag {
          padding: 4px 10px;
          background: var(--apex-gray-100);
          color: var(--apex-gray-600);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .volume-cell {
          font-weight: 600;
          color: var(--apex-blue);
        }

        /* Customer Detail Modal */
        .customer-detail-modal {
          max-width: 700px;
        }

        .customer-profile {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--apex-gray-200);
          margin-bottom: 24px;
        }

        .profile-avatar {
          width: 64px;
          height: 64px;
          background: var(--apex-blue);
          color: var(--apex-white);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .profile-info h3 {
          font-size: 1.25rem;
          color: var(--apex-gray-900);
          margin-bottom: 8px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        .detail-section h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--apex-gray-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--apex-gray-100);
        }

        .detail-label {
          color: var(--apex-gray-500);
          font-size: 0.875rem;
        }

        .detail-value {
          color: var(--apex-gray-900);
          font-weight: 500;
          font-size: 0.875rem;
        }

        .detail-value.highlight {
          color: var(--apex-blue);
          font-weight: 700;
        }

        .transaction-list {
          display: flex;
          flex-direction: column;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid var(--apex-gray-100);
        }

        .transaction-item:last-child {
          border-bottom: none;
        }

        .transaction-icon {
          width: 36px;
          height: 36px;
          background: var(--apex-gray-100);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--apex-gray-500);
        }

        .transaction-info {
          flex: 1;
        }

        .transaction-title {
          display: block;
          font-weight: 500;
          color: var(--apex-gray-800);
          font-size: 0.9375rem;
        }

        .transaction-detail {
          font-size: 0.8125rem;
          color: var(--apex-gray-400);
        }

        .transaction-amount {
          font-weight: 600;
          color: var(--apex-gray-900);
        }

        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomersAdmin;

