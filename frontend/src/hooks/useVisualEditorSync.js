import { useState, useEffect, useCallback } from 'react';

/**
 * 비주얼 에디터 실시간 동기화 훅
 * - localStorage를 통한 데이터 동기화
 * - postMessage를 통한 iframe 통신
 */
const useVisualEditorSync = () => {
  const [elements, setElements] = useState([]);
  const [isEditorActive, setIsEditorActive] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    const loadElements = () => {
      try {
        // 실시간 미리보기용 데이터 확인
        const livePreviewData = localStorage.getItem('visual-editor-live-preview');
        if (livePreviewData) {
          setElements(JSON.parse(livePreviewData));
          setIsEditorActive(true);
          return;
        }

        // 저장된 데이터 확인
        const savedData = localStorage.getItem('visual-editor-elements');
        if (savedData) {
          setElements(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('비주얼 에디터 데이터 로드 실패:', error);
      }
    };

    loadElements();

    // localStorage 변경 감지
    const handleStorageChange = (e) => {
      if (e.key === 'visual-editor-live-preview' || e.key === 'visual-editor-elements') {
        loadElements();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // postMessage 수신 (iframe 통신)
    const handleMessage = (event) => {
      if (event.data?.type === 'VISUAL_EDITOR_UPDATE') {
        setElements(event.data.elements || []);
        setIsEditorActive(true);
      }
    };

    window.addEventListener('message', handleMessage);

    // 정기적으로 localStorage 확인 (같은 탭에서의 변경 감지)
    const interval = setInterval(loadElements, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
      clearInterval(interval);
    };
  }, []);

  // 요소 렌더링 스타일 생성
  const getElementStyle = useCallback((element) => {
    const style = {
      position: 'absolute',
      left: element.position?.x || 0,
      top: element.position?.y || 0,
      width: typeof element.size?.width === 'number' ? element.size.width : 'auto',
      height: typeof element.size?.height === 'number' ? element.size.height : 'auto',
      zIndex: element.zIndex || 1,
      backgroundColor: element.style?.bgType === 'solid' ? element.style.bgColor : 'transparent',
      background: element.style?.bgType === 'gradient' ? element.style.bgGradient : undefined,
      borderStyle: element.style?.borderStyle || 'none',
      borderWidth: element.style?.borderStyle !== 'none' ? `${element.style.borderWidth || 1}px` : 0,
      borderColor: element.style?.borderColor,
      borderRadius: `${element.style?.borderRadius || 0}px`,
      boxShadow: element.style?.shadow !== 'none' ? element.style.shadow : undefined,
      opacity: (element.style?.opacity || 100) / 100,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined
    };

    return style;
  }, []);

  return {
    elements,
    isEditorActive,
    getElementStyle
  };
};

export default useVisualEditorSync;


