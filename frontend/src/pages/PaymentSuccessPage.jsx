import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import './PaymentSuccessPage.css';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest('/payment/confirm', {
          method: 'POST',
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount)
          })
        });

        if (response.success) {
          // 사용자 정보 업데이트
          if (updateUser && response.subscription) {
            updateUser({ ...user, subscription: response.subscription });
          }
          setLoading(false);
        } else {
          setError(response.message || '결제 승인에 실패했습니다.');
          setLoading(false);
        }
      } catch (err) {
        console.error('결제 승인 오류:', err);
        setError('결제 승인 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    if (user) {
      confirmPayment();
    } else {
      navigate('/login');
    }
  }, [paymentKey, orderId, amount, user, updateUser, navigate]);

  if (loading) {
    return (
      <div className="payment-result-page">
        <div className="container">
          <motion.div
            className="result-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="loading-spinner"></div>
            <h2>결제를 처리하고 있습니다...</h2>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-result-page">
        <div className="container">
          <motion.div
            className="result-content error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="result-icon error-icon">✕</div>
            <h2>결제 실패</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/pricing')}>
              요금제로 돌아가기
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-page">
      <div className="container">
        <motion.div
          className="result-content success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="result-icon">
            <CheckCircle size={64} />
          </div>
          <h2>결제가 완료되었습니다!</h2>
          <p>구독이 성공적으로 활성화되었습니다.</p>
          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => navigate('/mypage')}>
              마이페이지로 이동
              <ArrowRight size={18} />
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

export default PaymentSuccessPage;


