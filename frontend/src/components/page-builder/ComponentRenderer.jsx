import { useState } from 'react';

// 히어로 섹션 컴포넌트
const HeroComponent = ({ props }) => {
  const { 
    title, subtitle, buttonText, buttonLink, 
    backgroundType, backgroundColor, backgroundGradient, backgroundImage,
    textColor, alignment, height 
  } = props;

  const heightMap = { small: '300px', medium: '450px', large: '600px', full: '100vh' };
  
  const backgroundStyle = backgroundType === 'image' 
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : backgroundType === 'gradient' 
      ? { background: backgroundGradient }
      : { backgroundColor };

  return (
    <div 
      className="builder-hero" 
      style={{ 
        ...backgroundStyle,
        color: textColor,
        textAlign: alignment,
        minHeight: heightMap[height] || '450px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}
    >
      <div className="hero-content">
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{title}</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '30px', opacity: 0.9 }}>{subtitle}</p>
        {buttonText && (
          <a href={buttonLink} className="hero-btn" style={{
            padding: '14px 32px',
            background: '#E50914',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

// 텍스트 블록 컴포넌트
const TextComponent = ({ props }) => {
  const { content, fontSize, textAlign, textColor, backgroundColor, padding } = props;
  const fontSizeMap = { small: '0.875rem', medium: '1rem', large: '1.25rem', xlarge: '1.5rem' };
  const paddingMap = { none: '0', small: '16px', medium: '24px', large: '40px' };

  return (
    <div 
      className="builder-text"
      style={{
        fontSize: fontSizeMap[fontSize] || '1rem',
        textAlign,
        color: textColor,
        backgroundColor,
        padding: paddingMap[padding] || '24px'
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

// 제목 컴포넌트
const HeadingComponent = ({ props }) => {
  const { text, level, textAlign, textColor, fontSize } = props;
  const fontSizeMap = { small: '1.5rem', medium: '2rem', large: '2.5rem', xlarge: '3rem' };
  const Tag = level || 'h2';

  return (
    <Tag 
      className="builder-heading"
      style={{
        fontSize: fontSizeMap[fontSize] || '2rem',
        textAlign,
        color: textColor,
        margin: '20px 0'
      }}
    >
      {text}
    </Tag>
  );
};

// 이미지 컴포넌트
const ImageComponent = ({ props }) => {
  const { src, alt, width, height, borderRadius, objectFit, caption } = props;

  return (
    <figure className="builder-image" style={{ margin: '20px 0', textAlign: 'center' }}>
      <img 
        src={src} 
        alt={alt}
        style={{ 
          width, 
          height, 
          borderRadius, 
          objectFit,
          maxWidth: '100%' 
        }}
      />
      {caption && <figcaption style={{ marginTop: '8px', opacity: 0.7 }}>{caption}</figcaption>}
    </figure>
  );
};

// 버튼 컴포넌트
const ButtonComponent = ({ props }) => {
  const { text, link, variant, size, alignment, fullWidth } = props;
  
  const sizeStyles = {
    small: { padding: '8px 16px', fontSize: '0.875rem' },
    medium: { padding: '12px 24px', fontSize: '1rem' },
    large: { padding: '16px 32px', fontSize: '1.125rem' }
  };

  const variantStyles = {
    primary: { background: '#E50914', color: '#fff', border: 'none' },
    secondary: { background: 'transparent', color: '#fff', border: '2px solid #fff' },
    outline: { background: 'transparent', color: '#E50914', border: '2px solid #E50914' }
  };

  return (
    <div style={{ textAlign: alignment, padding: '10px 0' }}>
      <a 
        href={link}
        className="builder-button"
        style={{
          display: fullWidth ? 'block' : 'inline-block',
          ...sizeStyles[size],
          ...variantStyles[variant],
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          cursor: 'pointer',
          textAlign: 'center'
        }}
      >
        {text}
      </a>
    </div>
  );
};

// 여백 컴포넌트
const SpacerComponent = ({ props }) => {
  return <div style={{ height: props.height }} />;
};

// 구분선 컴포넌트
const DividerComponent = ({ props }) => {
  const { color, thickness, style, width } = props;
  return (
    <hr style={{
      border: 'none',
      borderTop: `${thickness} ${style} ${color}`,
      width,
      margin: '20px auto'
    }} />
  );
};

// 카드 그리드 컴포넌트
const CardsComponent = ({ props }) => {
  const { title, columns, gap, cards } = props;

  return (
    <div className="builder-cards" style={{ padding: '40px 20px' }}>
      {title && <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>{title}</h2>}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap
      }}>
        {cards.map((card, index) => (
          <div key={index} style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{card.icon}</div>
            <h3 style={{ marginBottom: '12px' }}>{card.title}</h3>
            <p style={{ opacity: 0.7 }}>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 기능 목록 컴포넌트
const FeaturesComponent = ({ props }) => {
  const { title, subtitle, layout, features } = props;

  return (
    <div className="builder-features" style={{ padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{title}</h2>
        <p style={{ opacity: 0.7 }}>{subtitle}</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fit, minmax(250px, 1fr))' : '1fr',
        gap: '32px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {features.map((feature, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: layout === 'grid' ? 'column' : 'row',
            alignItems: layout === 'grid' ? 'center' : 'flex-start',
            textAlign: layout === 'grid' ? 'center' : 'left',
            gap: '16px'
          }}>
            <div style={{ fontSize: '2rem' }}>{feature.icon}</div>
            <div>
              <h3 style={{ marginBottom: '8px' }}>{feature.title}</h3>
              <p style={{ opacity: 0.7 }}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 요금제 컴포넌트
const PricingComponent = ({ props }) => {
  const { title, subtitle, plans } = props;

  return (
    <div className="builder-pricing" style={{ padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>{title}</h2>
        <p style={{ opacity: 0.7 }}>{subtitle}</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${plans.length}, 1fr)`,
        gap: '24px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {plans.map((plan, index) => (
          <div key={index} style={{
            background: plan.highlighted ? 'linear-gradient(135deg, #E50914 0%, #b20710 100%)' : 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            transform: plan.highlighted ? 'scale(1.05)' : 'none',
            border: plan.highlighted ? 'none' : '1px solid rgba(255,255,255,0.1)'
          }}>
            <h3 style={{ marginBottom: '16px' }}>{plan.name}</h3>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>₩{plan.price}</span>
              <span style={{ opacity: 0.7 }}>/{plan.period}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ padding: '8px 0', opacity: 0.9 }}>✓ {feature}</li>
              ))}
            </ul>
            <button style={{
              width: '100%',
              padding: '12px',
              background: plan.highlighted ? '#fff' : '#E50914',
              color: plan.highlighted ? '#E50914' : '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 후기 컴포넌트
const TestimonialsComponent = ({ props }) => {
  const { title, reviews } = props;

  return (
    <div className="builder-testimonials" style={{ padding: '60px 20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>{title}</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {reviews.map((review, index) => (
          <div key={index} style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ marginBottom: '16px' }}>
              {'⭐'.repeat(review.rating)}
            </div>
            <p style={{ marginBottom: '16px', fontStyle: 'italic' }}>"{review.content}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#E50914',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {review.name[0]}
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>{review.name}</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>{review.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// FAQ 컴포넌트
const FAQComponent = ({ props }) => {
  const { title, items } = props;
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="builder-faq" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>{title}</h2>
      <div>
        {items.map((item, index) => (
          <div key={index} style={{
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '8px'
          }}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{
                width: '100%',
                padding: '16px',
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1rem'
              }}
            >
              <span>{item.question}</span>
              <span>{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div style={{ padding: '0 16px 16px', opacity: 0.8 }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// CTA 컴포넌트
const CTAComponent = ({ props }) => {
  const { title, subtitle, buttonText, buttonLink, backgroundColor, textColor } = props;

  return (
    <div className="builder-cta" style={{
      background: backgroundColor,
      color: textColor,
      padding: '60px 20px',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '16px', fontSize: '2rem' }}>{title}</h2>
      <p style={{ marginBottom: '32px', opacity: 0.9 }}>{subtitle}</p>
      <a href={buttonLink} style={{
        display: 'inline-block',
        padding: '14px 32px',
        background: '#fff',
        color: backgroundColor,
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '600'
      }}>
        {buttonText}
      </a>
    </div>
  );
};

// 비디오 컴포넌트
const VideoComponent = ({ props }) => {
  const { url, title, aspectRatio } = props;
  const aspectMap = { '16:9': '56.25%', '4:3': '75%', '1:1': '100%' };

  return (
    <div className="builder-video" style={{ padding: '20px 0' }}>
      {title && <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>{title}</h3>}
      <div style={{
        position: 'relative',
        paddingBottom: aspectMap[aspectRatio] || '56.25%',
        height: 0
      }}>
        <iframe
          src={url}
          title={title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px'
          }}
          allowFullScreen
        />
      </div>
    </div>
  );
};

// 갤러리 컴포넌트
const GalleryComponent = ({ props }) => {
  const { images, columns, gap } = props;

  return (
    <div className="builder-gallery" style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap,
      padding: '20px 0'
    }}>
      {images.map((img, index) => (
        <img 
          key={index} 
          src={img.src} 
          alt={img.alt}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />
      ))}
    </div>
  );
};

// 연락처 폼 컴포넌트
const ContactComponent = ({ props }) => {
  const { title, subtitle, fields, buttonText } = props;

  return (
    <div className="builder-contact" style={{ 
      padding: '60px 20px', 
      maxWidth: '600px', 
      margin: '0 auto' 
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>{title}</h2>
      <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '32px' }}>{subtitle}</p>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {fields.includes('name') && (
          <input type="text" placeholder="이름" style={{
            padding: '14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: 'inherit'
          }} />
        )}
        {fields.includes('email') && (
          <input type="email" placeholder="이메일" style={{
            padding: '14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: 'inherit'
          }} />
        )}
        {fields.includes('message') && (
          <textarea placeholder="메시지" rows={5} style={{
            padding: '14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: 'inherit',
            resize: 'vertical'
          }} />
        )}
        <button type="submit" style={{
          padding: '14px',
          background: '#E50914',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          {buttonText}
        </button>
      </form>
    </div>
  );
};

// 뉴스레터 컴포넌트
const NewsletterComponent = ({ props }) => {
  const { title, subtitle, buttonText, placeholder } = props;

  return (
    <div className="builder-newsletter" style={{
      padding: '60px 20px',
      textAlign: 'center',
      background: 'rgba(255,255,255,0.05)'
    }}>
      <h2 style={{ marginBottom: '16px' }}>{title}</h2>
      <p style={{ opacity: 0.7, marginBottom: '24px' }}>{subtitle}</p>
      <form style={{
        display: 'flex',
        gap: '12px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <input type="email" placeholder={placeholder} style={{
          flex: 1,
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.05)',
          color: 'inherit'
        }} />
        <button type="submit" style={{
          padding: '14px 24px',
          background: '#E50914',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          {buttonText}
        </button>
      </form>
    </div>
  );
};

// 소셜 링크 컴포넌트
const SocialComponent = ({ props }) => {
  const { links, alignment, size } = props;
  const sizeMap = { small: '32px', medium: '44px', large: '56px' };

  const platformIcons = {
    instagram: '📷',
    youtube: '🎬',
    twitter: '🐦',
    facebook: '📘',
    linkedin: '💼',
    github: '💻'
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      justifyContent: alignment,
      padding: '20px 0'
    }}>
      {links.map((link, index) => (
        <a key={index} href={link.url} style={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          fontSize: size === 'large' ? '1.5rem' : '1.25rem'
        }}>
          {platformIcons[link.platform] || '🔗'}
        </a>
      ))}
    </div>
  );
};

// HTML 컴포넌트
const HTMLComponent = ({ props }) => {
  return (
    <div 
      className="builder-html"
      dangerouslySetInnerHTML={{ __html: props.code }}
    />
  );
};

// 메인 렌더러
const ComponentRenderer = ({ component }) => {
  const { type, props } = component;

  const renderers = {
    hero: HeroComponent,
    text: TextComponent,
    heading: HeadingComponent,
    image: ImageComponent,
    button: ButtonComponent,
    spacer: SpacerComponent,
    divider: DividerComponent,
    cards: CardsComponent,
    features: FeaturesComponent,
    pricing: PricingComponent,
    testimonials: TestimonialsComponent,
    faq: FAQComponent,
    cta: CTAComponent,
    video: VideoComponent,
    gallery: GalleryComponent,
    contact: ContactComponent,
    newsletter: NewsletterComponent,
    social: SocialComponent,
    html: HTMLComponent
  };

  const Renderer = renderers[type];
  
  if (!Renderer) {
    return (
      <div style={{ padding: '20px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>
        알 수 없는 컴포넌트: {type}
      </div>
    );
  }

  return <Renderer props={props} />;
};

export default ComponentRenderer;

