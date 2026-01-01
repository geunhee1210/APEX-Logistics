import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ComponentRenderer from './ComponentRenderer';

const SortableComponent = ({ component, isSelected, onSelect, onDelete, onDuplicate, previewMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`canvas-component ${isSelected ? 'selected' : ''} ${previewMode ? 'preview' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!previewMode) onSelect(component.id);
      }}
    >
      {!previewMode && (
        <div className="component-controls" {...attributes} {...listeners}>
          <span className="drag-handle">⋮⋮</span>
          <span className="component-type">{component.type}</span>
          <div className="component-actions">
            <button 
              className="action-btn duplicate"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(component.id);
              }}
              title="복제"
            >
              📋
            </button>
            <button 
              className="action-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(component.id);
              }}
              title="삭제"
            >
              🗑️
            </button>
          </div>
        </div>
      )}
      <div className="component-content">
        <ComponentRenderer component={component} />
      </div>
    </div>
  );
};

const BuilderCanvas = ({ components, selectedId, onSelect, onDelete, onDuplicate, previewMode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  return (
    <div className={`builder-canvas ${previewMode ? 'preview-mode' : ''}`}>
      <div 
        ref={setNodeRef}
        className={`canvas-content ${isOver ? 'drag-over' : ''}`}
        onClick={() => onSelect(null)}
      >
        {components.length === 0 ? (
          <div className="canvas-empty">
            <div className="empty-icon">📦</div>
            <h3>페이지가 비어있습니다</h3>
            <p>왼쪽 패널에서 컴포넌트를 드래그하여 추가하세요</p>
          </div>
        ) : (
          <div className="canvas-components">
            {components.map(component => (
              <SortableComponent
                key={component.id}
                component={component}
                isSelected={selectedId === component.id}
                onSelect={onSelect}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                previewMode={previewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuilderCanvas;

