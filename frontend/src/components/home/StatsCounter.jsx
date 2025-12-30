import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Shield, Star, TrendingUp } from 'lucide-react';
import './StatsCounter.css';

const StatsCounter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    {
      icon: <Users size={32} />,
      value: 50000,
      suffix: '+',
      label: '만족한 고객',
      color: '#E50914'
    },
    {
      icon: <Shield size={32} />,
      value: 99.9,
      suffix: '%',
      label: '보안 안정성',
      color: '#46D369'
    },
    {
      icon: <Star size={32} />,
      value: 4.9,
      suffix: '/5',
      label: '평균 평점',
      color: '#FFB800'
    },
    {
      icon: <TrendingUp size={32} />,
      value: 70,
      suffix: '%',
      label: '평균 절약률',
      color: '#0080FF'
    }
  ];

  return (
    <section className="stats-section" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <span className="stat-value">
                  {isInView && (
                    <CountUp 
                      end={stat.value} 
                      suffix={stat.suffix} 
                      decimals={stat.value % 1 !== 0 ? 1 : 0}
                    />
                  )}
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 숫자 카운팅 애니메이션 컴포넌트
const CountUp = ({ end, suffix = '', decimals = 0, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // easeOutQuart easing
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentCount = eased * end;
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </>
  );
};

export default StatsCounter;


