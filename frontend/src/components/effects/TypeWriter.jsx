import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TypeWriter.css';

const TypeWriter = ({ 
  texts = [], 
  typingSpeed = 80, 
  deletingSpeed = 40, 
  pauseDuration = 2000,
  className = ''
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (texts.length === 0) return;

    const currentText = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // 타이핑 중
        if (displayedText.length < currentText.length) {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        } else {
          // 타이핑 완료, 잠시 대기 후 삭제 시작
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // 삭제 중
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          // 삭제 완료, 다음 텍스트로
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [texts, currentTextIndex, displayedText, isDeleting, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`typewriter ${className}`}>
      <span className="typewriter-text">{displayedText}</span>
      <motion.span 
        className="typewriter-cursor"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        |
      </motion.span>
    </span>
  );
};

export default TypeWriter;


