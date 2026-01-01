import { useState } from 'react';
import { defaultComponents } from './builderUtils';

// 속성 편집 필드 컴포넌트들
const TextField = ({ label, value, onChange, placeholder, multiline }) => (
  <div className="property-field">
    <label>{label}</label>
    {multiline ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
      />
    ) : (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
  </div>
);

const NumberField = ({ label, value, onChange, min, max, step }) => (
  <div className="property-field">
    <label>{label}</label>
    <input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="property-field">
    <label>{label}</label>
    <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const ColorField = ({ label, value, onChange }) => (
  <div className="property-field color-field">
    <label>{label}</label>
    <div className="color-input-wrapper">
      <input
        type="color"
        value={value || '#ffffff'}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
      />
    </div>
  </div>
);

const CheckboxField = ({ label, value, onChange }) => (
  <div className="property-field checkbox-field">
    <label>
      <input
        type="checkbox"
        checked={value || false}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  </div>
);

const ImageField = ({ label, value, onChange }) => (
  <div className="property-field image-field">
    <label>{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="이미지 URL 입력"
    />
    {value && (
      <div className="image-preview">
        <img src={value} alt="미리보기" />
      </div>
    )}
  </div>
);

const RichTextField = ({ label, value, onChange }) => (
  <div className="property-field rich-text-field">
    <label>{label}</label>
    <div className="rich-toolbar">
      <button type="button" onClick={() => {
        const newValue = value.replace(/<p>/g, '<p><strong>').replace(/<\/p>/g, '</strong></p>');
        onChange(newValue);
      }}>B</button>
      <button type="button" onClick={() => {
        const newValue = value.replace(/<p>/g, '<p><em>').replace(/<\/p>/g, '</em></p>');
        onChange(newValue);
      }}>I</button>
    </div>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      rows={6}
      placeholder="HTML 형식으로 입력 가능"
    />
  </div>
);

// 배열 아이템 편집 (카드, FAQ 등)
const ArrayField = ({ label, value, onChange, itemSchema, addLabel }) => {
  const handleItemChange = (index, field, newValue) => {
    const newArray = [...value];
    newArray[index] = { ...newArray[index], [field]: newValue };
    onChange(newArray);
  };

  const handleAddItem = () => {
    const newItem = {};
    Object.keys(itemSchema).forEach(key => {
      newItem[key] = itemSchema[key].default || '';
    });
    onChange([...value, newItem]);
  };

  const handleRemoveItem = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="property-field array-field">
      <label>{label}</label>
      <div className="array-items">
        {value.map((item, index) => (
          <div key={index} className="array-item">
            <div className="array-item-header">
              <span>항목 {index + 1}</span>
              <button 
                type="button" 
                className="remove-item"
                onClick={() => handleRemoveItem(index)}
              >
                ✕
              </button>
            </div>
            <div className="array-item-fields">
              {Object.entries(itemSchema).map(([field, schema]) => (
                <TextField
                  key={field}
                  label={schema.label}
                  value={item[field]}
                  onChange={(val) => handleItemChange(index, field, val)}
                  placeholder={schema.placeholder}
                  multiline={schema.multiline}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="add-item-btn" onClick={handleAddItem}>
        + {addLabel || '항목 추가'}
      </button>
    </div>
  );
};

// 컴포넌트별 속성 스키마
const getPropertySchema = (type) => {
  const schemas = {
    hero: [
      { key: 'title', type: 'text', label: '제목' },
      { key: 'subtitle', type: 'text', label: '부제목', multiline: true },
      { key: 'buttonText', type: 'text', label: '버튼 텍스트' },
      { key: 'buttonLink', type: 'text', label: '버튼 링크' },
      { key: 'backgroundType', type: 'select', label: '배경 유형', options: [
        { value: 'solid', label: '단색' },
        { value: 'gradient', label: '그라데이션' },
        { value: 'image', label: '이미지' }
      ]},
      { key: 'backgroundColor', type: 'color', label: '배경색' },
      { key: 'backgroundGradient', type: 'text', label: '그라데이션 CSS' },
      { key: 'backgroundImage', type: 'image', label: '배경 이미지' },
      { key: 'textColor', type: 'color', label: '텍스트 색상' },
      { key: 'alignment', type: 'select', label: '정렬', options: [
        { value: 'left', label: '왼쪽' },
        { value: 'center', label: '가운데' },
        { value: 'right', label: '오른쪽' }
      ]},
      { key: 'height', type: 'select', label: '높이', options: [
        { value: 'small', label: '작게 (300px)' },
        { value: 'medium', label: '중간 (450px)' },
        { value: 'large', label: '크게 (600px)' },
        { value: 'full', label: '전체 화면' }
      ]}
    ],
    text: [
      { key: 'content', type: 'richtext', label: '내용' },
      { key: 'fontSize', type: 'select', label: '글자 크기', options: [
        { value: 'small', label: '작게' },
        { value: 'medium', label: '보통' },
        { value: 'large', label: '크게' },
        { value: 'xlarge', label: '매우 크게' }
      ]},
      { key: 'textAlign', type: 'select', label: '정렬', options: [
        { value: 'left', label: '왼쪽' },
        { value: 'center', label: '가운데' },
        { value: 'right', label: '오른쪽' }
      ]},
      { key: 'textColor', type: 'color', label: '텍스트 색상' },
      { key: 'backgroundColor', type: 'color', label: '배경색' },
      { key: 'padding', type: 'select', label: '여백', options: [
        { value: 'none', label: '없음' },
        { value: 'small', label: '작게' },
        { value: 'medium', label: '보통' },
        { value: 'large', label: '크게' }
      ]}
    ],
    heading: [
      { key: 'text', type: 'text', label: '제목 텍스트' },
      { key: 'level', type: 'select', label: '제목 레벨', options: [
        { value: 'h1', label: 'H1' },
        { value: 'h2', label: 'H2' },
        { value: 'h3', label: 'H3' },
        { value: 'h4', label: 'H4' }
      ]},
      { key: 'textAlign', type: 'select', label: '정렬', options: [
        { value: 'left', label: '왼쪽' },
        { value: 'center', label: '가운데' },
        { value: 'right', label: '오른쪽' }
      ]},
      { key: 'textColor', type: 'color', label: '색상' },
      { key: 'fontSize', type: 'select', label: '글자 크기', options: [
        { value: 'small', label: '작게' },
        { value: 'medium', label: '보통' },
        { value: 'large', label: '크게' },
        { value: 'xlarge', label: '매우 크게' }
      ]}
    ],
    image: [
      { key: 'src', type: 'image', label: '이미지 URL' },
      { key: 'alt', type: 'text', label: '대체 텍스트' },
      { key: 'width', type: 'text', label: '너비' },
      { key: 'height', type: 'text', label: '높이' },
      { key: 'borderRadius', type: 'text', label: '모서리 둥글기' },
      { key: 'objectFit', type: 'select', label: '맞춤', options: [
        { value: 'cover', label: '채우기' },
        { value: 'contain', label: '맞추기' },
        { value: 'fill', label: '늘리기' }
      ]},
      { key: 'caption', type: 'text', label: '캡션' }
    ],
    button: [
      { key: 'text', type: 'text', label: '버튼 텍스트' },
      { key: 'link', type: 'text', label: '링크' },
      { key: 'variant', type: 'select', label: '스타일', options: [
        { value: 'primary', label: '기본' },
        { value: 'secondary', label: '보조' },
        { value: 'outline', label: '외곽선' }
      ]},
      { key: 'size', type: 'select', label: '크기', options: [
        { value: 'small', label: '작게' },
        { value: 'medium', label: '보통' },
        { value: 'large', label: '크게' }
      ]},
      { key: 'alignment', type: 'select', label: '정렬', options: [
        { value: 'left', label: '왼쪽' },
        { value: 'center', label: '가운데' },
        { value: 'right', label: '오른쪽' }
      ]},
      { key: 'fullWidth', type: 'checkbox', label: '전체 너비' }
    ],
    spacer: [
      { key: 'height', type: 'text', label: '높이 (px)' }
    ],
    divider: [
      { key: 'color', type: 'color', label: '색상' },
      { key: 'thickness', type: 'text', label: '두께' },
      { key: 'style', type: 'select', label: '스타일', options: [
        { value: 'solid', label: '실선' },
        { value: 'dashed', label: '점선' },
        { value: 'dotted', label: '도트' }
      ]},
      { key: 'width', type: 'text', label: '너비' }
    ],
    cards: [
      { key: 'title', type: 'text', label: '섹션 제목' },
      { key: 'columns', type: 'select', label: '열 수', options: [
        { value: 2, label: '2열' },
        { value: 3, label: '3열' },
        { value: 4, label: '4열' }
      ]},
      { key: 'gap', type: 'text', label: '간격' },
      { key: 'cards', type: 'array', label: '카드 목록', itemSchema: {
        icon: { label: '아이콘', default: '⭐' },
        title: { label: '제목', default: '제목' },
        description: { label: '설명', default: '설명', multiline: true }
      }, addLabel: '카드 추가' }
    ],
    features: [
      { key: 'title', type: 'text', label: '제목' },
      { key: 'subtitle', type: 'text', label: '부제목' },
      { key: 'layout', type: 'select', label: '레이아웃', options: [
        { value: 'grid', label: '그리드' },
        { value: 'list', label: '목록' }
      ]},
      { key: 'features', type: 'array', label: '기능 목록', itemSchema: {
        icon: { label: '아이콘', default: '✨' },
        title: { label: '제목', default: '기능' },
        description: { label: '설명', default: '설명' }
      }, addLabel: '기능 추가' }
    ],
    pricing: [
      { key: 'title', type: 'text', label: '제목' },
      { key: 'subtitle', type: 'text', label: '부제목' }
    ],
    testimonials: [
      { key: 'title', type: 'text', label: '제목' }
    ],
    faq: [
      { key: 'title', type: 'text', label: '제목' },
      { key: 'items', type: 'array', label: 'FAQ 목록', itemSchema: {
        question: { label: '질문', default: '질문?' },
        answer: { label: '답변', default: '답변', multiline: true }
      }, addLabel: 'FAQ 추가' }
    ],
    cta: [
      { key: 'title', type: 'text', label: '제목' },
      { key: 'subtitle', type: 'text', label: '부제목' },
      { key: 'buttonText', type: 'text', label: '버튼 텍스트' },
      { key: 'buttonLink', type: 'text', label: '버튼 링크' },
      { key: 'backgroundColor', type: 'color', label: '배경색' },
      { key: 'textColor', type: 'color', label: '텍스트 색상' }
    ],
    video: [
      { key: 'url', type: 'text', label: '영상 URL (임베드)' },
      { key: 'title', type: 'text', label: '제목' },
      { key: 'aspectRatio', type: 'select', label: '비율', options: [
        { value: '16:9', label: '16:9' },
        { value: '4:3', label: '4:3' },
        { value: '1:1', label: '1:1' }
      ]}
    ],
    gallery: [
      { key: 'columns', type: 'select', label: '열 수', options: [
        { value: 2, label: '2열' },
        { value: 3, label: '3열' },
        { value: 4, label: '4열' }
      ]},
      { key: 'gap', type: 'text', label: '간격' }
    ],
    contact: [
      { key: 'title', type: 'text', label: '제목' },
      { key: 'subtitle', type: 'text', label: '부제목' },
      { key: 'buttonText', type: 'text', label: '버튼 텍스트' }
    ],
    newsletter: [
      { key: 'title', type: 'text', label: '제목' },
      { key: 'subtitle', type: 'text', label: '부제목' },
      { key: 'buttonText', type: 'text', label: '버튼 텍스트' },
      { key: 'placeholder', type: 'text', label: '입력 안내 텍스트' }
    ],
    social: [
      { key: 'alignment', type: 'select', label: '정렬', options: [
        { value: 'left', label: '왼쪽' },
        { value: 'center', label: '가운데' },
        { value: 'right', label: '오른쪽' }
      ]},
      { key: 'size', type: 'select', label: '크기', options: [
        { value: 'small', label: '작게' },
        { value: 'medium', label: '보통' },
        { value: 'large', label: '크게' }
      ]}
    ],
    html: [
      { key: 'code', type: 'richtext', label: 'HTML 코드' }
    ]
  };

  return schemas[type] || [];
};

// 메인 PropertyPanel 컴포넌트
const PropertyPanel = ({ component, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('content');
  const schema = getPropertySchema(component.type);
  const componentInfo = defaultComponents[component.type];

  const renderField = (field) => {
    const value = component.props[field.key];
    const handleChange = (newValue) => {
      onUpdate({ [field.key]: newValue });
    };

    switch (field.type) {
      case 'text':
        return (
          <TextField
            key={field.key}
            label={field.label}
            value={value}
            onChange={handleChange}
            multiline={field.multiline}
          />
        );
      case 'number':
        return (
          <NumberField
            key={field.key}
            label={field.label}
            value={value}
            onChange={handleChange}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );
      case 'select':
        return (
          <SelectField
            key={field.key}
            label={field.label}
            value={value}
            onChange={handleChange}
            options={field.options}
          />
        );
      case 'color':
        return (
          <ColorField
            key={field.key}
            label={field.label}
            value={value}
            onChange={handleChange}
          />
        );
      case 'checkbox':
        return (
          <CheckboxField
            key={field.key}
            label={field.label}
            value={value}
            onChange={handleChange}
          />
        );
      case 'image':
        return (
          <ImageField
            key={field.key}
            label={field.label}
            value={value}
            onChange={handleChange}
          />
        );
      case 'richtext':
        return (
          <RichTextField
            key={field.key}
            label={field.label}
            value={value}
            onChange={handleChange}
          />
        );
      case 'array':
        return (
          <ArrayField
            key={field.key}
            label={field.label}
            value={value || []}
            onChange={handleChange}
            itemSchema={field.itemSchema}
            addLabel={field.addLabel}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="property-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="component-icon">{componentInfo?.icon}</span>
          <span>{componentInfo?.name || component.type}</span>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="panel-tabs">
        <button 
          className={activeTab === 'content' ? 'active' : ''}
          onClick={() => setActiveTab('content')}
        >
          콘텐츠
        </button>
        <button 
          className={activeTab === 'style' ? 'active' : ''}
          onClick={() => setActiveTab('style')}
        >
          스타일
        </button>
      </div>

      <div className="panel-content">
        {schema.map(field => renderField(field))}
      </div>

      <div className="panel-footer">
        <p className="component-id">ID: {component.id}</p>
      </div>
    </div>
  );
};

export default PropertyPanel;

