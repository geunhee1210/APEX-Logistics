import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './VisualEditorRenderer.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * 비주얼 에디터에서 생성된 콘텐츠를 렌더링하는 컴포넌트
 * - 백엔드 API에서 데이터 로드
 * - 실시간 동기화 지원 (BroadcastChannel)
 * - 미리보기 모드 지원
 */
const VisualEditorRenderer = ({ pageId = 'home', sectionId = null }) => {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // URL에서 미리보기 모드 확인
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPreviewMode(params.get('preview') === 'visual-editor');
  }, []);

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      // 미리보기 모드면 로컬 스토리지에서 로드
      if (isPreviewMode) {
        const liveData = localStorage.getItem('visual-editor-live-preview');
        if (liveData) {
          setElements(JSON.parse(liveData));
        }
        setLoading(false);
        return;
      }

      // 실제 운영에서는 백엔드 API에서 로드
      const response = await fetch(`${API_BASE}/api/visual-editor/${pageId}`);
      const result = await response.json();
      
      if (result.success && result.data?.elements?.length > 0) {
        // 섹션 필터링
        let filteredElements = result.data.elements;
        if (sectionId) {
          filteredElements = filteredElements.filter(el => 
            el.target?.section === sectionId
          );
        }
        setElements(filteredElements);
      } else {
        // 백엔드 데이터가 없으면 로컬 스토리지 확인
        const savedData = localStorage.getItem('visual-editor-elements');
        if (savedData) {
          let parsed = JSON.parse(savedData);
          if (sectionId) {
            parsed = parsed.filter(el => el.target?.section === sectionId);
          }
          setElements(parsed);
        }
      }
    } catch (error) {
      console.error('비주얼 에디터 데이터 로드 실패:', error);
      // 로컬 스토리지 폴백
      const savedData = localStorage.getItem('visual-editor-elements');
      if (savedData) {
        setElements(JSON.parse(savedData));
      }
    } finally {
      setLoading(false);
    }
  }, [pageId, sectionId, isPreviewMode]);

  // 초기 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 실시간 동기화 (BroadcastChannel)
  useEffect(() => {
    if (!isPreviewMode) return;

    // BroadcastChannel 리스너
    let channel;
    try {
      channel = new BroadcastChannel('visual-editor-sync');
      channel.onmessage = (event) => {
        if (event.data.type === 'update' || event.data.type === 'saved') {
          let newElements = event.data.elements;
          if (sectionId) {
            newElements = newElements.filter(el => el.target?.section === sectionId);
          }
          setElements(newElements);
        }
      };
    } catch (e) {
      // BroadcastChannel 미지원 환경
    }

    // localStorage 변경 감지
    const handleStorageChange = (e) => {
      if (e.key === 'visual-editor-live-preview' && e.newValue) {
        try {
          let newElements = JSON.parse(e.newValue);
          if (sectionId) {
            newElements = newElements.filter(el => el.target?.section === sectionId);
          }
          setElements(newElements);
        } catch (err) {
          console.error('실시간 동기화 오류:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 주기적으로 로컬 스토리지 체크 (같은 창에서의 변경 감지)
    const interval = setInterval(() => {
      const liveData = localStorage.getItem('visual-editor-live-preview');
      if (liveData) {
        try {
          let newElements = JSON.parse(liveData);
          if (sectionId) {
            newElements = newElements.filter(el => el.target?.section === sectionId);
          }
          if (JSON.stringify(newElements) !== JSON.stringify(elements)) {
            setElements(newElements);
          }
        } catch (err) {
          // 무시
        }
      }
    }, 1000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isPreviewMode, sectionId, elements]);

  // 요소 렌더링
  const renderElement = (element) => {
    const {
      id, type, content, position, size, style = {}, presetName
    } = element;

    const baseStyle = {
      position: 'absolute',
      left: position?.x || 0,
      top: position?.y || 0,
      width: typeof size?.width === 'number' ? size.width : size?.width || 'auto',
      height: typeof size?.height === 'number' ? size.height : size?.height || 'auto',
      transform: style.rotation ? `rotate(${style.rotation}deg)` : undefined,
      backgroundColor: style.bgType === 'solid' ? style.bgColor : 'transparent',
      background: style.bgType === 'gradient' ? style.bgGradient : undefined,
      borderRadius: style.borderRadius || 0,
      borderStyle: style.borderStyle || 'none',
      borderWidth: style.borderWidth || 0,
      borderColor: style.borderColor || 'transparent',
      boxShadow: style.shadow || 'none',
      opacity: style.opacity !== undefined ? style.opacity / 100 : 1,
      zIndex: element.zIndex || 1
    };

    // 애니메이션 설정
    const motionProps = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: style.opacity !== undefined ? style.opacity / 100 : 1, y: 0 },
      transition: { duration: 0.5, delay: (element.zIndex || 1) * 0.1 }
    };

    switch (type) {
      case 'text':
        return (
          <motion.div
            key={id}
            style={baseStyle}
            {...motionProps}
            className="ve-element ve-text"
            dangerouslySetInnerHTML={{ __html: content || '텍스트' }}
          />
        );

      case 'heading':
        return (
          <motion.h2
            key={id}
            style={{ ...baseStyle, fontSize: '2rem', fontWeight: 'bold' }}
            {...motionProps}
            className="ve-element ve-heading"
            dangerouslySetInnerHTML={{ __html: content || '제목' }}
          />
        );

      case 'button':
        return (
          <motion.button
            key={id}
            style={{
              ...baseStyle,
              padding: '12px 24px',
              backgroundColor: style.bgColor || '#E50914',
              color: style.textColor || '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
            {...motionProps}
            className="ve-element ve-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {content || '버튼'}
          </motion.button>
        );

      case 'image':
        return (
          <motion.div
            key={id}
            style={baseStyle}
            {...motionProps}
            className={`ve-element ve-image ${presetName ? `preset-${presetName}` : ''}`}
          >
            {element.src ? (
              <img 
                src={element.src} 
                alt={element.alt || ''} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: style.borderRadius || 0 }}
              />
            ) : (
              <div className="ve-image-placeholder">이미지</div>
            )}
          </motion.div>
        );

      case 'video':
        return (
          <motion.div
            key={id}
            style={baseStyle}
            {...motionProps}
            className={`ve-element ve-video ${presetName ? `preset-${presetName}` : ''}`}
          >
            {element.src ? (
              <video 
                src={element.src} 
                controls 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: style.borderRadius || 0 }}
              />
            ) : (
              <div className="ve-video-placeholder">
                <span>▶</span>
                비디오
              </div>
            )}
          </motion.div>
        );

      case 'divider':
        return (
          <motion.hr
            key={id}
            style={{
              ...baseStyle,
              border: 'none',
              borderTop: `${style.borderWidth || 1}px ${style.borderStyle || 'solid'} ${style.borderColor || '#333'}`
            }}
            {...motionProps}
            className="ve-element ve-divider"
          />
        );

      case 'spacer':
        return (
          <div
            key={id}
            style={{ ...baseStyle, backgroundColor: 'transparent' }}
            className="ve-element ve-spacer"
          />
        );

      case 'card':
        return (
          <motion.div
            key={id}
            style={{
              ...baseStyle,
              padding: '20px',
              backgroundColor: style.bgColor || '#1a1a1a'
            }}
            {...motionProps}
            className="ve-element ve-card"
          >
            <div dangerouslySetInnerHTML={{ __html: content || '카드 내용' }} />
          </motion.div>
        );

      case 'testimonial':
        return (
          <motion.div
            key={id}
            style={{
              ...baseStyle,
              padding: '24px',
              backgroundColor: style.bgColor || '#1a1a1a',
              textAlign: 'center'
            }}
            {...motionProps}
            className="ve-element ve-testimonial"
          >
            <div className="testimonial-avatar">👤</div>
            <div dangerouslySetInnerHTML={{ __html: content || '"후기 내용"' }} />
          </motion.div>
        );

      case 'quote':
        return (
          <motion.blockquote
            key={id}
            style={{
              ...baseStyle,
              padding: '20px 30px',
              borderLeft: '4px solid #E50914',
              fontStyle: 'italic',
              backgroundColor: style.bgColor || 'rgba(229, 9, 20, 0.1)'
            }}
            {...motionProps}
            className="ve-element ve-quote"
            dangerouslySetInnerHTML={{ __html: content || '인용구' }}
          />
        );

      case 'cardnews':
        return (
          <motion.div
            key={id}
            style={{
              ...baseStyle,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              padding: '20px'
            }}
            {...motionProps}
            className="ve-element ve-cardnews"
          >
            {element.cards?.map((card, idx) => (
              <div key={idx} className="cardnews-item" style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: 8 }}>
                {card.image && <img src={card.image} alt={card.title} />}
                {card.title && <h4>{card.title}</h4>}
                {card.description && <p>{card.description}</p>}
              </div>
            )) || <div>카드뉴스</div>}
          </motion.div>
        );

      default:
        return (
          <motion.div
            key={id}
            style={baseStyle}
            {...motionProps}
            className="ve-element"
          >
            {content || type}
          </motion.div>
        );
    }
  };

  if (loading) {
    return null; // 로딩 중에는 아무것도 표시하지 않음
  }

  if (elements.length === 0) {
    return null; // 요소가 없으면 아무것도 표시하지 않음
  }

  // 요소들의 최대 높이 계산
  const maxBottom = elements.reduce((max, el) => {
    const bottom = (el.position?.y || 0) + (typeof el.size?.height === 'number' ? el.size.height : 200);
    return Math.max(max, bottom);
  }, 0);

  return (
    <div 
      className={`visual-editor-renderer ${isPreviewMode ? 'preview-mode' : ''}`}
      style={{ 
        position: 'relative', 
        minHeight: maxBottom + 50,
        overflow: 'hidden'
      }}
    >
      {isPreviewMode && (
        <div className="preview-indicator">
          🔴 실시간 미리보기 모드
        </div>
      )}
      
      {elements.map(renderElement)}
    </div>
  );
};

export default VisualEditorRenderer;


