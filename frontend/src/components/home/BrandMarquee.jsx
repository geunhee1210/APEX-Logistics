import { motion } from 'framer-motion';
import './BrandMarquee.css';

const BrandMarquee = () => {
  const brands = [
    { name: 'Netflix', logo: '🎬', color: '#E50914' },
    { name: 'YouTube', logo: '▶️', color: '#FF0000' },
    { name: 'Spotify', logo: '🎵', color: '#1DB954' },
    { name: 'Disney+', logo: '🏰', color: '#113CCF' },
    { name: 'ChatGPT', logo: '🤖', color: '#10A37F' },
    { name: 'Apple TV+', logo: '🍎', color: '#000000' },
    { name: 'Wavve', logo: '📺', color: '#1A0DAB' },
    { name: 'Watcha', logo: '🎞️', color: '#FF0558' },
    { name: 'Coupang Play', logo: '🛒', color: '#E31937' },
    { name: 'TVING', logo: '📹', color: '#FF143C' },
  ];

  // 무한 스크롤을 위해 브랜드 목록 복제
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="brand-marquee-section">
      <div className="container">
        <div className="marquee-header">
          <span className="marquee-label">함께하는 파트너</span>
          <h3>다양한 OTT 서비스를 지원합니다</h3>
        </div>
      </div>
      
      <div className="marquee-container">
        <motion.div 
          className="marquee-track"
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: 'linear'
          }}
        >
          {duplicatedBrands.map((brand, idx) => (
            <div 
              key={idx} 
              className="brand-item"
              style={{ '--brand-color': brand.color }}
            >
              <span className="brand-logo">{brand.logo}</span>
              <span className="brand-name">{brand.name}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 역방향 스크롤 */}
      <div className="marquee-container reverse">
        <motion.div 
          className="marquee-track"
          animate={{ x: ['-33.33%', '0%'] }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: 'linear'
          }}
        >
          {duplicatedBrands.reverse().map((brand, idx) => (
            <div 
              key={idx} 
              className="brand-item"
              style={{ '--brand-color': brand.color }}
            >
              <span className="brand-logo">{brand.logo}</span>
              <span className="brand-name">{brand.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandMarquee;


