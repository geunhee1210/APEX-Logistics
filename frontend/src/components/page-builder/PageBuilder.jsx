import { useState, useCallback } from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import ComponentPalette from './ComponentPalette';
import BuilderCanvas from './BuilderCanvas';
import PropertyPanel from './PropertyPanel';
import { generateId, defaultComponents } from './builderUtils';
import './PageBuilder.css';

const PageBuilder = ({ initialData, onSave, pageName = '홈페이지' }) => {
  const [components, setComponents] = useState(initialData?.components || []);
  const [selectedId, setSelectedId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const selectedComponent = components.find(c => c.id === selectedId);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // 새 컴포넌트 추가
    if (active.id.startsWith('palette-')) {
      const componentType = active.id.replace('palette-', '');
      const newComponent = {
        id: generateId(),
        type: componentType,
        props: { ...defaultComponents[componentType].defaultProps }
      };
      
      const overIndex = components.findIndex(c => c.id === over.id);
      if (overIndex >= 0) {
        setComponents(prev => {
          const newList = [...prev];
          newList.splice(overIndex, 0, newComponent);
          return newList;
        });
      } else {
        setComponents(prev => [...prev, newComponent]);
      }
      setSelectedId(newComponent.id);
      return;
    }

    // 기존 컴포넌트 정렬
    if (active.id !== over.id) {
      setComponents(prev => {
        const oldIndex = prev.findIndex(c => c.id === active.id);
        const newIndex = prev.findIndex(c => c.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id.startsWith('palette-') && over.id === 'canvas-drop-zone') {
      // 캔버스에 드롭 가능
    }
  };

  const handleUpdateComponent = useCallback((id, newProps) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, props: { ...comp.props, ...newProps } } : comp
    ));
  }, []);

  const handleDeleteComponent = useCallback((id) => {
    setComponents(prev => prev.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleDuplicateComponent = useCallback((id) => {
    const index = components.findIndex(c => c.id === id);
    if (index >= 0) {
      const original = components[index];
      const duplicate = {
        ...original,
        id: generateId(),
        props: { ...original.props }
      };
      setComponents(prev => {
        const newList = [...prev];
        newList.splice(index + 1, 0, duplicate);
        return newList;
      });
    }
  }, [components]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave?.({ components, pageName });
      alert('저장되었습니다!');
    } catch (error) {
      alert('저장 실패: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`page-builder ${previewMode ? 'preview-mode' : ''}`}>
      {/* 헤더 툴바 */}
      <div className="builder-toolbar">
        <div className="toolbar-left">
          <h2>페이지 빌더</h2>
          <span className="page-name">{pageName}</span>
        </div>
        <div className="toolbar-center">
          <button 
            className={`toolbar-btn ${!previewMode ? 'active' : ''}`}
            onClick={() => setPreviewMode(false)}
          >
            ✏️ 편집
          </button>
          <button 
            className={`toolbar-btn ${previewMode ? 'active' : ''}`}
            onClick={() => setPreviewMode(true)}
          >
            👁️ 미리보기
          </button>
        </div>
        <div className="toolbar-right">
          <button className="toolbar-btn" onClick={() => setComponents([])}>
            🗑️ 초기화
          </button>
          <button 
            className="toolbar-btn primary" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '저장 중...' : '💾 저장'}
          </button>
        </div>
      </div>

      {/* 메인 빌더 영역 */}
      <div className="builder-main">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          {/* 왼쪽: 컴포넌트 팔레트 */}
          {!previewMode && (
            <ComponentPalette />
          )}

          {/* 중앙: 캔버스 */}
          <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <BuilderCanvas
              components={components}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDelete={handleDeleteComponent}
              onDuplicate={handleDuplicateComponent}
              previewMode={previewMode}
            />
          </SortableContext>

          {/* 오른쪽: 속성 패널 */}
          {!previewMode && selectedComponent && (
            <PropertyPanel
              component={selectedComponent}
              onUpdate={(newProps) => handleUpdateComponent(selectedId, newProps)}
              onClose={() => setSelectedId(null)}
            />
          )}

          <DragOverlay>
            {activeId && activeId.startsWith('palette-') && (
              <div className="drag-overlay-item">
                {defaultComponents[activeId.replace('palette-', '')]?.icon} 
                {defaultComponents[activeId.replace('palette-', '')]?.name}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default PageBuilder;

