import { motion } from 'framer-motion';
import { ChevronDown, Mouse } from 'lucide-react';
import './ScrollIndicator.css';

const ScrollIndicator = ({ text = '스크롤하여 더 알아보기' }) => {
  const handleClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <motion.div 
      className="scroll-indicator"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      onClick={handleClick}
    >
      <motion.div 
        className="mouse-icon"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Mouse size={24} />
        <motion.div 
          className="scroll-wheel"
          animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
      <span className="scroll-text">{text}</span>
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <ChevronDown size={20} />
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;


