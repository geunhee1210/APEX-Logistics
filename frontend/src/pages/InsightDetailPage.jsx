import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, 
  Clock, 
  Calendar,
  Tag,
  Share2,
  Bookmark,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { blogPosts, getPostBySlug } from '../data/blogPosts';
import './InsightDetailPage.css';

const InsightDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [copied, setCopied] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const foundPost = getPostBySlug(slug);
    if (foundPost) {
      setPost(foundPost);
      // 같은 카테고리의 다른 글 3개 추천
      const related = blogPosts
        .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
        .slice(0, 3);
      setRelatedPosts(related);
      window.scrollTo(0, 0);
    } else {
      navigate('/insights');
    }
  }, [slug, navigate]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!post) {
    return (
      <div className="insight-detail-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="insight-detail-page">
      {/* Hero Section */}
      <section className="detail-hero">
        <div className="hero-background">
          <img src={post.image} alt={post.title} />
          <div className="hero-overlay" />
        </div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content"
          >
            <Link to="/insights" className="back-link">
              <ArrowLeft size={18} />
              인사이트로 돌아가기
            </Link>
            
            <h1>{post.title}</h1>
            
            <div className="post-info">
              <span><Calendar size={16} /> {post.date}</span>
              <span><Clock size={16} /> {post.readTime} 읽기</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="detail-content">
        <div className="container">
          <div className="content-layout">
            {/* Main Content */}
            <motion.article 
              className="article-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="excerpt-box">
                <p>{post.excerpt}</p>
              </div>
              
              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({node, ...props}) => <h2 className="content-h2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="content-h3" {...props} />,
                    p: ({node, ...props}) => <p className="content-p" {...props} />,
                    ul: ({node, ...props}) => <ul className="content-ul" {...props} />,
                    ol: ({node, ...props}) => <ol className="content-ol" {...props} />,
                    li: ({node, ...props}) => <li className="content-li" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="content-quote" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? <code className="inline-code" {...props} /> : <code className="code-block" {...props} />,
                    pre: ({node, ...props}) => <pre className="pre-block" {...props} />,
                    table: ({node, ...props}) => <div className="table-wrapper"><table className="content-table" {...props} /></div>,
                    thead: ({node, ...props}) => <thead className="table-thead" {...props} />,
                    tbody: ({node, ...props}) => <tbody className="table-tbody" {...props} />,
                    tr: ({node, ...props}) => <tr className="table-tr" {...props} />,
                    th: ({node, ...props}) => <th className="table-th" {...props} />,
                    td: ({node, ...props}) => <td className="table-td" {...props} />,
                    strong: ({node, ...props}) => <strong className="content-strong" {...props} />,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
              
              {/* Tags & Share */}
              <div className="article-footer">
                <div className="article-tags">
                  <Tag size={16} />
                  <span>물류</span>
                  <span>인사이트</span>
                </div>
                <div className="article-actions">
                  <button 
                    className={`action-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? '복사됨!' : '링크 복사'}
                  </button>
                  <button className="action-btn">
                    <Bookmark size={18} />
                    저장
                  </button>
                  <button className="action-btn">
                    <Share2 size={18} />
                    공유
                  </button>
                </div>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="article-sidebar">
              <div className="sidebar-card cta-card">
                <h3>물류 컨설팅이 필요하신가요?</h3>
                <p>APEX Logistics 전문가가 맞춤 솔루션을 제안해 드립니다.</p>
                <Link to="/pricing" className="btn btn-primary">
                  무료 상담 신청
                </Link>
              </div>
              
              {post.tableOfContents && post.tableOfContents.length > 0 && (
                <div className="sidebar-card toc-card">
                  <h4>목차</h4>
                  <nav className="toc-nav">
                    {post.tableOfContents.map((item, idx) => (
                      <a key={idx} href={`#${item.id}`}>{item.title}</a>
                    ))}
                  </nav>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="related-section">
          <div className="container">
            <div className="section-header">
              <h2>관련 인사이트</h2>
              <Link to="/insights" className="view-all">
                전체보기 <ChevronRight size={18} />
              </Link>
            </div>
            <div className="related-grid">
              {relatedPosts.map((relatedPost, idx) => (
                <motion.article
                  key={relatedPost.id}
                  className="related-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={`/insights/${relatedPost.slug}`}>
                    <div className="card-image">
                      <img src={relatedPost.image} alt={relatedPost.title} />
                    </div>
                    <div className="card-content">
                      <h3>{relatedPost.title}</h3>
                      <div className="card-meta">
                        <span><Clock size={14} /> {relatedPost.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

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

export default InsightDetailPage;
