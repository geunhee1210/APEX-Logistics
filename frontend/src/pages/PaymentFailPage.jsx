import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';
import './PaymentSuccessPage.css';

const PaymentFailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  const getErrorMessage = () => {
    if (errorMessage) return errorMessage;
    
    switch (errorCode) {
      case 'USER_CANCEL':
        return '결제가 취소되었습니다.';
      case 'INVALID_CARD':
        return '유효하지 않은 카드 정보입니다.';
      case 'INSUFFICIENT_BALANCE':
        return '잔액이 부족합니다.';
      default:
        return '결제 중 오류가 발생했습니다.';
    }
  };

  return (
    <div className="payment-result-page">
      <div className="container">
        <motion.div
          className="result-content error"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="result-icon error-icon">
            <XCircle size={64} />
          </div>
          <h2>결제 실패</h2>
          <p>{getErrorMessage()}</p>
          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => navigate('/pricing')}>
              <ArrowLeft size={18} />
              요금제로 돌아가기
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              홈으로 이동
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentFailPage;


