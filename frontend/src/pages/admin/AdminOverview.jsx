import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  MessageSquare,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Eye
} from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalQuotes: 24,
    totalPosts: 12,
    totalFaqs: 15,
    totalCustomers: 156
  });

  const [recentQuotes, setRecentQuotes] = useState([
    { id: 1, company: '(주)테크솔루션', contact: '김담당', service: '이커머스 풀필먼트', date: '2025.12.30', status: 'pending' },
    { id: 2, company: '글로벌트레이드', contact: '박매니저', service: '글로벌 물류', date: '2025.12.29', status: 'active' },
    { id: 3, company: '푸드프레시', contact: '이대리', service: '콜드체인', date: '2025.12.28', status: 'pending' },
    { id: 4, company: '패션하우스', contact: '최차장', service: 'B2B 물류', date: '2025.12.27', status: 'active' },
  ]);

  const [recentPosts, setRecentPosts] = useState([
    { id: 1, title: '세계 경제 흐름을 읽는 4대 운임지수', views: 1234, date: '2025.11.05' },
    { id: 2, title: 'SKU가 바뀌면, 물류가 달라진다', views: 987, date: '2025.11.06' },
    { id: 3, title: '물류비 청구서가 복잡한 이유, CBM 하나로 끝내기', views: 856, date: '2025.10.29' },
  ]);

  return (
    <div className="admin-overview">
      <div className="admin-page-header">
        <h1>대시보드</h1>
        <p>APEX Logistics 관리자 페이지에 오신 것을 환영합니다.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="stat-icon blue">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>견적 요청</h3>
            <div className="stat-value">{stats.totalQuotes}</div>
            <div className="stat-change positive">
              <ArrowUpRight size={14} /> +12% 이번 주
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon teal">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>인사이트 글</h3>
            <div className="stat-value">{stats.totalPosts}</div>
            <div className="stat-change positive">
              <ArrowUpRight size={14} /> +2 신규
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon purple">
            <MessageSquare size={24} />
          </div>
          <div className="stat-content">
            <h3>FAQ</h3>
            <div className="stat-value">{stats.totalFaqs}</div>
            <div className="stat-change">
              변동 없음
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon orange">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>고객 수</h3>
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-change positive">
              <ArrowUpRight size={14} /> +8 이번 달
            </div>
          </div>
        </motion.div>
      </div>

      <div className="overview-grid">
        {/* Recent Quotes */}
        <motion.div 
          className="admin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="admin-card-header">
            <h2>최근 견적 요청</h2>
            <Link to="/admin/pricing" className="admin-btn admin-btn-secondary">
              전체보기
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>회사명</th>
                <th>담당자</th>
                <th>서비스</th>
                <th>날짜</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.map((quote) => (
                <tr key={quote.id}>
                  <td>{quote.company}</td>
                  <td>{quote.contact}</td>
                  <td>{quote.service}</td>
                  <td>{quote.date}</td>
                  <td>
                    <span className={`status-badge ${quote.status}`}>
                      {quote.status === 'pending' ? '대기중' : '처리완료'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Recent Posts */}
        <motion.div 
          className="admin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="admin-card-header">
            <h2>인기 인사이트</h2>
            <Link to="/admin/insights" className="admin-btn admin-btn-secondary">
              전체보기
            </Link>
          </div>
          <div className="recent-posts-list">
            {recentPosts.map((post, idx) => (
              <div key={post.id} className="recent-post-item">
                <div className="post-rank">{idx + 1}</div>
                <div className="post-info">
                  <h4>{post.title}</h4>
                  <div className="post-meta">
                    <span><Eye size={14} /> {post.views.toLocaleString()}</span>
                    <span><Clock size={14} /> {post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .overview-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
        }

        .recent-posts-list {
          display: flex;
          flex-direction: column;
        }

        .recent-post-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid var(--apex-gray-100);
        }

        .recent-post-item:last-child {
          border-bottom: none;
        }

        .post-rank {
          width: 32px;
          height: 32px;
          background: var(--apex-gray-100);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--apex-gray-600);
          font-size: 0.875rem;
        }

        .post-info {
          flex: 1;
        }

        .post-info h4 {
          font-size: 0.9375rem;
          color: var(--apex-gray-800);
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-meta {
          display: flex;
          gap: 16px;
          font-size: 0.8125rem;
          color: var(--apex-gray-400);
        }

        .post-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (max-width: 1024px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOverview;

