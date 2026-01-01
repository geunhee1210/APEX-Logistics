import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Clock, 
  ArrowRight, 
  Tag,
  TrendingUp,
  BookOpen,
  Lightbulb,
  BarChart3,
  Award,
  Megaphone
} from 'lucide-react';
import { blogPosts, getFeaturedPosts, getPostsByCategory } from '../data/blogPosts';
import './InsightPage.css';

const InsightPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: '전체보기', icon: <BookOpen size={18} /> },
    { id: 'scm', name: '공급망 관리', icon: <TrendingUp size={18} /> },
    { id: 'fulfillment', name: '풀필먼트', icon: <Lightbulb size={18} /> },
    { id: 'warehouse', name: '웨어하우스', icon: <BarChart3 size={18} /> },
    { id: 'trend', name: '트렌드', icon: <Tag size={18} /> },
    { id: 'case', name: '성공사례', icon: <Award size={18} /> },
    { id: 'news', name: '뉴스', icon: <Megaphone size={18} /> },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = getFeaturedPosts();

  return (
    <div className="insight-page">
      {/* Hero Section */}
      <section className="insight-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content"
          >
            <span className="hero-badge">APEX INSIGHTS</span>
            <h1>물류 인사이트</h1>
            <p>SCM, 풀필먼트, 웨어하우스에 대한 전문 정보와<br />물류 트렌드를 제공합니다.</p>
            
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {!searchQuery && activeCategory === 'all' && (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2>주요 인사이트</h2>
            </div>
            <div className="featured-grid">
              {featuredPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  className="featured-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={`/insights/${post.slug}`}>
                    <div className="card-image">
                      <img src={post.image} alt={post.title} />
                    </div>
                    <div className="card-content">
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="card-meta">
                        <span><Clock size={14} /> {post.readTime} 읽기</span>
                        <span>{post.date}</span>
                      </div>
                      <span className="read-more">
                        자세히 보기 <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="category-section">
        <div className="container">
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="posts-section">
        <div className="container">
          <div className="posts-grid">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                className="post-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/insights/${post.slug}`}>
                  <div className="post-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="post-meta">
                      <span><Clock size={14} /> {post.readTime}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="no-results">
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-content">
              <h2>물류 인사이트 뉴스레터</h2>
              <p>매주 최신 물류 트렌드와 인사이트를 이메일로 받아보세요.</p>
            </div>
            <div className="newsletter-form">
              <input type="email" placeholder="이메일 주소를 입력하세요" />
              <button className="btn btn-accent">구독하기</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsightPage;
