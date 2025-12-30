import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { getComponentsByCategory } from './builderUtils';

const DraggableComponent = ({ componentKey, component }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${componentKey}`,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      className={`palette-item ${isDragging ? 'dragging' : ''}`}
      style={style}
      {...listeners}
      {...attributes}
    >
      <span className="palette-item-icon">{component.icon}</span>
      <span className="palette-item-name">{component.name}</span>
    </div>
  );
};

const ComponentPalette = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    섹션: true,
    기본: true,
    미디어: false,
    레이아웃: false,
    폼: false,
    고급: false
  });

  const groupedComponents = getComponentsByCategory();

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredComponents = (components) => {
    if (!searchTerm) return components;
    return components.filter(comp => 
      comp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const categoryIcons = {
    섹션: '📦',
    기본: '📝',
    미디어: '🖼️',
    레이아웃: '📐',
    폼: '📋',
    고급: '⚙️'
  };

  return (
    <div className="component-palette">
      <div className="palette-header">
        <h3>컴포넌트</h3>
        <p>드래그하여 추가</p>
      </div>

      <div className="palette-search">
        <input
          type="text"
          placeholder="컴포넌트 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm('')}>
            ✕
          </button>
        )}
      </div>

      <div className="palette-categories">
        {Object.entries(groupedComponents).map(([category, components]) => {
          const filtered = filteredComponents(components);
          if (filtered.length === 0) return null;

          return (
            <div key={category} className="palette-category">
              <button 
                className="category-header"
                onClick={() => toggleCategory(category)}
              >
                <span className="category-icon">{categoryIcons[category] || '📁'}</span>
                <span className="category-name">{category}</span>
                <span className="category-count">{filtered.length}</span>
                <span className={`category-arrow ${expandedCategories[category] ? 'expanded' : ''}`}>
                  ▶
                </span>
              </button>
              
              {expandedCategories[category] && (
                <div className="category-items">
                  {filtered.map(comp => (
                    <DraggableComponent
                      key={comp.key}
                      componentKey={comp.key}
                      component={comp}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="palette-footer">
        <p>💡 팁: 컴포넌트를 캔버스에 드래그하세요</p>
      </div>
    </div>
  );
};

export default ComponentPalette;

