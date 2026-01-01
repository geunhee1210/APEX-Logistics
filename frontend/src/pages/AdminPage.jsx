import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  DollarSign,
  FileText,
  HelpCircle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Admin Sub-pages
import AdminOverview from './admin/AdminOverview';
import PricingAdmin from './admin/PricingAdmin';
import InsightAdmin from './admin/InsightAdmin';
import SupportAdmin from './admin/SupportAdmin';
import CustomersAdmin from './admin/CustomersAdmin';

import './admin/AdminDashboard.css';

const AdminPage = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);

  // 관리자 권한 체크
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: '대시보드',
      icon: <LayoutDashboard size={20} />,
      path: '/admin'
    },
    {
      id: 'pricing',
      label: '요금 관리',
      icon: <DollarSign size={20} />,
      path: '/admin/pricing'
    },
    {
      id: 'insights',
      label: '인사이트 관리',
      icon: <FileText size={20} />,
      path: '/admin/insights'
    },
    {
      id: 'support',
      label: '고객지원 관리',
      icon: <HelpCircle size={20} />,
      path: '/admin/support'
    },
    {
      id: 'customers',
      label: '고객 데이터',
      icon: <Users size={20} />,
      path: '/admin/customers'
    },
    {
      id: 'settings',
      label: '설정',
      icon: <Settings size={20} />,
      path: '/admin/settings'
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
        <p>로딩 중...</p>
      </div>
    );
  }

  // 권한 없음
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/" className="admin-logo">
            <div className="logo-icon">
              <LayoutDashboard size={24} />
            </div>
            {sidebarOpen && <span>APEX Admin</span>}
          </Link>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
              {sidebarOpen && isActive(item.path) && (
                <ChevronRight size={16} className="nav-arrow" />
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item home-link">
            <span className="nav-icon"><Home size={20} /></span>
            {sidebarOpen && <span className="nav-label">홈페이지로</span>}
          </Link>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon"><LogOut size={20} /></span>
            {sidebarOpen && <span className="nav-label">로그아웃</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="breadcrumb">
              <span>관리자</span>
              <ChevronRight size={16} />
              <span>{menuItems.find(item => isActive(item.path))?.label || '대시보드'}</span>
              </div>
          </div>

          <div className="header-right">
            <button className="notification-btn">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </button>
            <div className="user-info">
              <div className="user-avatar">
                {user.name?.charAt(0) || 'A'}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">관리자</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="pricing" element={<PricingAdmin />} />
            <Route path="insights" element={<InsightAdmin />} />
            <Route path="support" element={<SupportAdmin />} />
            <Route path="customers" element={<CustomersAdmin />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Settings placeholder component
const AdminSettings = () => (
  <div className="admin-settings">
    <div className="admin-page-header">
      <h1>설정</h1>
      <p>시스템 설정을 관리합니다.</p>
    </div>
    <div className="admin-card">
      <div className="admin-card-header">
        <h2>일반 설정</h2>
      </div>
      <div className="admin-form">
        <div className="form-group">
          <label>사이트 이름</label>
          <input type="text" defaultValue="APEX Logistics" />
        </div>
        <div className="form-group">
          <label>관리자 이메일</label>
          <input type="email" defaultValue="admin@apexlogistics.kr" />
        </div>
        <div className="form-group">
          <label>대표 전화번호</label>
          <input type="tel" defaultValue="1566-0000" />
        </div>
        <div className="form-group">
          <label>회사 주소</label>
          <textarea defaultValue="서울특별시 강남구 테헤란로 123 APEX타워 15층" rows={3} />
        </div>
        <button className="admin-btn admin-btn-primary" style={{ marginTop: '16px' }}>
          설정 저장
        </button>
      </div>
    </div>
  </div>
);

export default AdminPage;
