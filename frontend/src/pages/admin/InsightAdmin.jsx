import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Eye,
  Clock,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Save,
  Upload,
  GripVertical,
  FolderOpen,
  Tag,
  Calendar,
  FileText
} from 'lucide-react';
import { blogPosts as initialBlogPosts } from '../../data/blogPosts';

// 에디터 메뉴바 컴포넌트
const EditorMenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = useCallback(() => {
    const url = window.prompt('이미지 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL을 입력하세요:', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="editor-menu-bar">
      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
          title="제목 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
          title="제목 3"
        >
          <Heading3 size={18} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
          title="굵게"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
          title="기울임"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'active' : ''}
          title="밑줄"
        >
          <UnderlineIcon size={18} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
          title="왼쪽 정렬"
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
          title="가운데 정렬"
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
          title="오른쪽 정렬"
        >
          <AlignRight size={18} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'active' : ''}
          title="글머리 기호"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'active' : ''}
          title="번호 목록"
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'active' : ''}
          title="인용구"
        >
          <Quote size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'active' : ''}
          title="코드 블록"
        >
          <Code size={18} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button onClick={setLink} className={editor.isActive('link') ? 'active' : ''} title="링크">
          <LinkIcon size={18} />
        </button>
        <button onClick={addImage} title="이미지">
          <ImageIcon size={18} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="실행 취소">
          <Undo size={18} />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="다시 실행">
          <Redo size={18} />
        </button>
      </div>
    </div>
  );
};

// 카테고리 정의
const CATEGORIES = [
  { value: 'scm', label: 'SCM 노하우', color: '#0ea5e9' },
  { value: 'fulfillment', label: '풀필먼트 인사이트', color: '#8b5cf6' },
  { value: 'trend', label: '마켓 & 트렌드', color: '#f59e0b' },
  { value: 'warehouse', label: '스마트 웨어하우스', color: '#10b981' },
  { value: 'case', label: '성공사례', color: '#ec4899' },
  { value: 'news', label: '뉴스', color: '#6366f1' },
  { value: 'all', label: '가이드', color: '#64748b' }
];

const getCategoryLabel = (value) => {
  const cat = CATEGORIES.find(c => c.value === value);
  return cat ? cat.label : value;
};

const getCategoryColor = (value) => {
  const cat = CATEGORIES.find(c => c.value === value);
  return cat ? cat.color : '#64748b';
};

const InsightAdmin = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'reorder'

  // blogPosts.js에서 기존 글 불러오기
  const [posts, setPosts] = useState(() => {
    return initialBlogPosts.map(post => ({
      ...post,
      status: 'published',
      views: Math.floor(Math.random() * 2000) + 100
    }));
  });

  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    categoryName: '',
    excerpt: '',
    image: '',
    readTime: '5분',
    tableOfContents: [],
    status: 'draft',
    featured: false
  });

  // TipTap 에디터 설정
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: '본문 내용을 입력하세요...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose-editor',
      },
    },
  });

  const handleNewPost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      category: '',
      categoryName: '',
      excerpt: '',
      image: '',
      readTime: '5분',
      tableOfContents: [],
      status: 'draft',
      featured: false
    });
    if (editor) {
      editor.commands.setContent('');
    }
    setShowEditor(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug || '',
      category: post.category,
      categoryName: post.categoryName || getCategoryLabel(post.category),
      excerpt: post.excerpt || '',
      image: post.image || '',
      readTime: post.readTime || '5분',
      tableOfContents: post.tableOfContents || [],
      status: post.status || 'published',
      featured: post.featured || false
    });
    
    // 실제 콘텐츠를 에디터에 로드
    if (editor && post.content) {
      // Markdown을 HTML로 간단히 변환 (기본적인 변환)
      const htmlContent = convertMarkdownToHtml(post.content);
      editor.commands.setContent(htmlContent);
    }
    setShowEditor(true);
  };

  // 간단한 Markdown → HTML 변환 함수
  const convertMarkdownToHtml = (markdown) => {
    if (!markdown) return '';
    
    let html = markdown
      // 헤딩
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      // 굵은 글씨
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // 이탤릭
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 인용구
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      // 코드 블록
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // 인라인 코드
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // 리스트
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
      // 줄바꿈
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    
    // p 태그로 감싸기
    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>';
    }
    
    return html;
  };

  const handleCloseEditor = () => {
    if (editor?.getText() && !confirm('작성 중인 내용이 있습니다. 정말 닫으시겠습니까?')) {
      return;
    }
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleSavePost = (publish = false) => {
    const content = editor?.getHTML();
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    
    const postData = {
      ...formData,
      content,
      categoryName: getCategoryLabel(formData.category),
      status: publish ? 'published' : 'draft',
      date: editingPost?.date || dateStr
    };
    
    if (editingPost) {
      // 기존 글 수정
      setPosts(prev => prev.map(p => 
        p.id === editingPost.id 
          ? { ...p, ...postData }
          : p
      ));
      alert('글이 수정되었습니다!');
    } else {
      // 새 글 추가
      const newPost = {
        id: Math.max(...posts.map(p => p.id)) + 1,
        ...postData,
        views: 0,
        date: dateStr
      };
      setPosts(prev => [newPost, ...prev]);
      alert(publish ? '글이 게시되었습니다!' : '임시 저장되었습니다!');
    }
    
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleDeletePost = (postId) => {
    if (confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const handleImageUpload = () => {
    const url = window.prompt('이미지 URL을 입력하세요:');
    if (url) {
      setFormData({ ...formData, image: url });
    }
  };

  const handleCategoryChange = (categoryValue) => {
    setFormData({
      ...formData,
      category: categoryValue,
      categoryName: getCategoryLabel(categoryValue)
    });
  };

  // 배치 순서 변경
  const handleReorder = (newOrder) => {
    setPosts(newOrder);
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 카테고리별 글 그룹핑
  const groupedPosts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = posts.filter(p => p.category === cat.value);
    return acc;
  }, {});

  return (
    <div className="insight-admin">
      {!showEditor ? (
        <>
          <div className="admin-page-header">
            <h1>인사이트 관리</h1>
            <p>블로그 글을 작성하고 관리합니다. 기존 글을 수정하거나 새 글을 추가할 수 있습니다.</p>
          </div>

          {/* 카테고리별 통계 */}
          <div className="category-stats">
            {CATEGORIES.map(cat => (
              <div 
                key={cat.value} 
                className={`stat-card ${categoryFilter === cat.value ? 'active' : ''}`}
                onClick={() => setCategoryFilter(categoryFilter === cat.value ? '' : cat.value)}
                style={{ '--cat-color': cat.color }}
              >
                <div className="stat-icon">
                  <FolderOpen size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">{cat.label}</span>
                  <span className="stat-value">{groupedPosts[cat.value]?.length || 0}개</span>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="제목으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select 
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">전체 카테고리</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <div className="view-toggle">
                <button 
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                  title="목록 보기"
                >
                  <FileText size={18} />
                </button>
                <button 
                  className={viewMode === 'reorder' ? 'active' : ''}
                  onClick={() => setViewMode('reorder')}
                  title="배치 순서 변경"
                >
                  <GripVertical size={18} />
                </button>
              </div>
              <button 
                className="admin-btn admin-btn-primary"
                onClick={handleNewPost}
              >
                <Plus size={18} />
                새 글 작성
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="admin-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>제목</th>
                    <th>카테고리</th>
                    <th>상태</th>
                    <th>조회수</th>
                    <th>작성일</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <div className="post-title-cell">
                          {post.featured && <span className="featured-badge">추천</span>}
                          <strong className="post-title">{post.title}</strong>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="category-tag"
                          style={{ 
                            backgroundColor: `${getCategoryColor(post.category)}15`,
                            color: getCategoryColor(post.category),
                            borderColor: getCategoryColor(post.category)
                          }}
                        >
                          {getCategoryLabel(post.category)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${post.status === 'published' ? 'active' : 'pending'}`}>
                          {post.status === 'published' ? '게시됨' : '임시저장'}
                        </span>
                      </td>
                      <td>
                        <span className="view-count">
                          <Eye size={14} /> {post.views?.toLocaleString() || 0}
                        </span>
                      </td>
                      <td>{post.date}</td>
                      <td className="actions">
                        <button 
                          className="action-btn edit"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit2 size={14} />
                          수정
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDeletePost(post.id)}
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
          ) : (
            <div className="reorder-view">
              <div className="reorder-notice">
                <GripVertical size={18} />
                <span>드래그하여 글의 순서를 변경할 수 있습니다. 상단에 위치한 글이 먼저 표시됩니다.</span>
              </div>
              <Reorder.Group axis="y" values={filteredPosts} onReorder={handleReorder} className="reorder-list">
                {filteredPosts.map((post) => (
                  <Reorder.Item key={post.id} value={post} className="reorder-item">
                    <div className="drag-handle">
                      <GripVertical size={20} />
                    </div>
                    <div className="reorder-content">
                      <div className="reorder-header">
                        <span 
                          className="category-tag"
                          style={{ 
                            backgroundColor: `${getCategoryColor(post.category)}15`,
                            color: getCategoryColor(post.category)
                          }}
                        >
                          {getCategoryLabel(post.category)}
                        </span>
                        {post.featured && <span className="featured-badge">추천</span>}
                      </div>
                      <h4>{post.title}</h4>
                      <p className="reorder-excerpt">{post.excerpt}</p>
                      <div className="reorder-meta">
                        <span><Calendar size={14} /> {post.date}</span>
                        <span><Clock size={14} /> {post.readTime}</span>
                        <span><Eye size={14} /> {post.views?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                    <div className="reorder-actions">
                      <button onClick={() => handleEditPost(post)}>
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          )}
        </>
      ) : (
        <motion.div
          className="blog-editor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="editor-header">
            <button className="back-btn" onClick={handleCloseEditor}>
              <X size={20} />
              닫기
            </button>
            <div className="editor-actions">
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={() => handleSavePost(false)}
              >
                <Save size={18} />
                임시 저장
              </button>
              <button 
                className="admin-btn admin-btn-primary"
                onClick={() => handleSavePost(true)}
              >
                <Upload size={18} />
                게시하기
              </button>
            </div>
          </div>

          <div className="editor-layout">
            <div className="editor-main">
              <div className="form-group">
                <input
                  type="text"
                  className="title-input"
                  placeholder="제목을 입력하세요"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="editor-container">
                <EditorMenuBar editor={editor} />
                <EditorContent editor={editor} className="editor-content" />
              </div>
            </div>

            <div className="editor-sidebar">
              <div className="sidebar-section">
                <h3>게시 설정</h3>
                <div className="form-group">
                  <label>카테고리 *</label>
                  <div className="category-select-grid">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        className={`category-option ${formData.category === cat.value ? 'selected' : ''}`}
                        onClick={() => handleCategoryChange(cat.value)}
                        style={{ '--cat-color': cat.color }}
                      >
                        <Tag size={14} />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>슬러그 (URL)</label>
                  <input
                    type="text"
                    placeholder="url-friendly-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>예상 읽기 시간</label>
                  <input
                    type="text"
                    placeholder="5분"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    추천 글로 설정
                  </label>
                </div>
              </div>

              <div className="sidebar-section">
                <h3>대표 이미지</h3>
                <div 
                  className="featured-image-upload"
                  onClick={handleImageUpload}
                >
                  {formData.image ? (
                    <img src={formData.image} alt="Featured" />
                  ) : (
                    <div className="upload-placeholder">
                      <ImageIcon size={32} />
                      <span>이미지 업로드</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="sidebar-section">
                <h3>요약</h3>
                <div className="form-group">
                  <textarea
                    placeholder="글의 요약을 입력하세요 (목록에 표시됨)"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              {editingPost && (
                <div className="sidebar-section post-info">
                  <h3>글 정보</h3>
                  <div className="info-row">
                    <span>작성일</span>
                    <span>{editingPost.date}</span>
                  </div>
                  <div className="info-row">
                    <span>조회수</span>
                    <span>{editingPost.views?.toLocaleString() || 0}</span>
                  </div>
                  <div className="info-row">
                    <span>상태</span>
                    <span>{editingPost.status === 'published' ? '게시됨' : '임시저장'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <style>{`
        .category-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--apex-white);
          border-radius: var(--radius-lg);
          border: 1px solid var(--apex-gray-200);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .stat-card:hover {
          border-color: var(--cat-color);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .stat-card.active {
          border-color: var(--cat-color);
          background: color-mix(in srgb, var(--cat-color) 5%, white);
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          background: color-mix(in srgb, var(--cat-color) 15%, white);
          color: var(--cat-color);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.8125rem;
          color: var(--apex-gray-500);
        }

        .stat-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--apex-gray-900);
        }

        .view-toggle {
          display: flex;
          border: 1px solid var(--apex-gray-200);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .view-toggle button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          background: transparent;
          border: none;
          color: var(--apex-gray-500);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .view-toggle button:hover {
          background: var(--apex-gray-100);
        }

        .view-toggle button.active {
          background: var(--apex-blue);
          color: white;
        }

        .featured-badge {
          padding: 2px 8px;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: white;
          font-size: 0.6875rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          white-space: nowrap;
        }

        .post-title {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #1e293b;
          font-size: 0.9375rem;
          font-weight: 600;
        }

        .post-title-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Admin Table Override */
        .insight-admin .admin-table td {
          color: #334155;
          vertical-align: middle;
        }

        .insight-admin .admin-table th {
          color: #475569;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .category-tag {
          padding: 4px 10px;
          border: 1px solid;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .view-count {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--apex-gray-500);
          font-size: 0.875rem;
        }

        /* Reorder View */
        .reorder-view {
          background: var(--apex-white);
          border-radius: var(--radius-xl);
          border: 1px solid var(--apex-gray-200);
          padding: 24px;
        }

        .reorder-notice {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--apex-blue-light);
          border-radius: var(--radius-md);
          margin-bottom: 20px;
          color: var(--apex-blue);
          font-size: 0.875rem;
        }

        .reorder-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reorder-item {
          display: flex;
          align-items: stretch;
          background: var(--apex-gray-50);
          border: 1px solid var(--apex-gray-200);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: grab;
          transition: all var(--transition-fast);
        }

        .reorder-item:hover {
          border-color: var(--apex-gray-300);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .drag-handle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          background: var(--apex-gray-100);
          color: var(--apex-gray-400);
        }

        .reorder-content {
          flex: 1;
          padding: 16px 20px;
        }

        .reorder-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .reorder-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .reorder-excerpt {
          font-size: 0.875rem;
          color: var(--apex-gray-500);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .reorder-meta {
          display: flex;
          gap: 16px;
          font-size: 0.8125rem;
          color: var(--apex-gray-400);
        }

        .reorder-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .reorder-actions {
          display: flex;
          align-items: center;
          padding: 0 16px;
          border-left: 1px solid var(--apex-gray-200);
        }

        .reorder-actions button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          color: var(--apex-gray-500);
          border-radius: var(--radius-md);
          cursor: pointer;
        }

        .reorder-actions button:hover {
          background: var(--apex-gray-200);
          color: var(--apex-blue);
        }

        /* Blog Editor Styles */
        .blog-editor {
          background: var(--apex-white);
          border-radius: var(--radius-xl);
          border: 1px solid var(--apex-gray-200);
          min-height: calc(100vh - 140px);
        }

        .editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid var(--apex-gray-200);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--apex-gray-600);
          font-size: 0.9375rem;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: var(--radius-md);
        }

        .back-btn:hover {
          background: var(--apex-gray-100);
        }

        .editor-actions {
          display: flex;
          gap: 12px;
        }

        .editor-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 0;
        }

        .editor-main {
          padding: 24px;
          border-right: 1px solid var(--apex-gray-200);
        }

        .title-input {
          width: 100%;
          padding: 16px 0;
          border: none;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--apex-gray-900);
          margin-bottom: 24px;
        }

        .title-input::placeholder {
          color: var(--apex-gray-300);
        }

        .title-input:focus {
          outline: none;
        }

        .editor-container {
          border: 1px solid var(--apex-gray-200);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .editor-menu-bar {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px;
          background: var(--apex-gray-50);
          border-bottom: 1px solid var(--apex-gray-200);
          flex-wrap: wrap;
        }

        .menu-group {
          display: flex;
          gap: 2px;
        }

        .menu-divider {
          width: 1px;
          height: 24px;
          background: var(--apex-gray-200);
          margin: 0 8px;
        }

        .editor-menu-bar button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          color: var(--apex-gray-600);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .editor-menu-bar button:hover {
          background: var(--apex-gray-200);
          color: var(--apex-gray-900);
        }

        .editor-menu-bar button.active {
          background: var(--apex-blue);
          color: var(--apex-white);
        }

        .editor-menu-bar button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .editor-content {
          min-height: 400px;
          padding: 24px;
        }

        .prose-editor {
          outline: none;
          min-height: 400px;
        }

        .prose-editor h2 {
          font-size: 1.5rem;
          margin: 24px 0 16px;
          color: var(--apex-gray-900);
        }

        .prose-editor h3 {
          font-size: 1.25rem;
          margin: 20px 0 12px;
          color: var(--apex-gray-800);
        }

        .prose-editor p {
          margin: 16px 0;
          line-height: 1.8;
          color: var(--apex-gray-700);
        }

        .prose-editor ul,
        .prose-editor ol {
          margin: 16px 0;
          padding-left: 24px;
        }

        .prose-editor li {
          margin: 8px 0;
        }

        .prose-editor blockquote {
          margin: 20px 0;
          padding: 16px 20px;
          background: var(--apex-gray-50);
          border-left: 4px solid var(--apex-teal);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          font-style: italic;
        }

        .prose-editor pre {
          background: var(--apex-navy);
          color: var(--apex-gray-200);
          padding: 16px;
          border-radius: var(--radius-md);
          overflow-x: auto;
          margin: 16px 0;
        }

        .prose-editor img {
          max-width: 100%;
          height: auto;
          border-radius: var(--radius-md);
          margin: 16px 0;
        }

        .prose-editor a {
          color: var(--apex-blue);
          text-decoration: underline;
        }

        .prose-editor .is-empty::before {
          content: attr(data-placeholder);
          color: var(--apex-gray-400);
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* Editor Sidebar */
        .editor-sidebar {
          padding: 24px;
          background: var(--apex-gray-50);
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }

        .sidebar-section {
          margin-bottom: 24px;
        }

        .sidebar-section h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--apex-gray-700);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .category-select-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .category-option {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: var(--apex-white);
          border: 1px solid var(--apex-gray-200);
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          color: var(--apex-gray-600);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .category-option:hover {
          border-color: var(--cat-color);
          color: var(--cat-color);
        }

        .category-option.selected {
          background: color-mix(in srgb, var(--cat-color) 10%, white);
          border-color: var(--cat-color);
          color: var(--cat-color);
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: var(--apex-gray-700);
          cursor: pointer;
        }

        .checkbox-group input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: var(--apex-blue);
        }

        .featured-image-upload {
          width: 100%;
          aspect-ratio: 16/9;
          border: 2px dashed var(--apex-gray-300);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          transition: all var(--transition-fast);
        }

        .featured-image-upload:hover {
          border-color: var(--apex-blue);
        }

        .featured-image-upload img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--apex-gray-400);
        }

        .upload-placeholder span {
          font-size: 0.875rem;
        }

        .post-info {
          background: var(--apex-white);
          border-radius: var(--radius-md);
          padding: 16px;
          border: 1px solid var(--apex-gray-200);
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--apex-gray-100);
          font-size: 0.875rem;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row span:first-child {
          color: var(--apex-gray-500);
        }

        .info-row span:last-child {
          font-weight: 500;
          color: var(--apex-gray-800);
        }

        @media (max-width: 1024px) {
          .editor-layout {
            grid-template-columns: 1fr;
          }

          .editor-sidebar {
            border-top: 1px solid var(--apex-gray-200);
          }

          .category-stats {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default InsightAdmin;
