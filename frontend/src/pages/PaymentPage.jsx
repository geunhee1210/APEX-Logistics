import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, Smartphone, Wallet, Lock, 
  Check, ArrowLeft, Shield, Info, Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './PaymentPage.css';

// 토스페이먼츠 테스트 클라이언트 키
const TOSS_CLIENT_KEY = 'test_ck_26DlbXAaV07dXxJBgmMz3qY50Q9R';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('카드');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const tossPaymentsRef = useRef(null);

  // URL 파라미터에서 플랜 정보 가져오기
  const planInfo = location.state?.plan || {
    id: 'standard',
    name: 'Standard',
    price: 19900,
    period: 'monthly'
  };

  // 로그인 체크
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/payment', plan: planInfo } });
    }
  }, [user, navigate, planInfo]);

  // 토스페이먼츠 SDK 로드
  useEffect(() => {
    if (!user) return;

    const loadTossPayments = async () => {
      try {
        if (window.TossPayments) {
          tossPaymentsRef.current = window.TossPayments(TOSS_CLIENT_KEY);
          setLoading(false);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.tosspayments.com/v1/payment';
        script.async = true;
        script.onload = () => {
          tossPaymentsRef.current = window.TossPayments(TOSS_CLIENT_KEY);
          setLoading(false);
        };
        script.onerror = () => {
          setError('결제 모듈을 불러오는데 실패했습니다.');
          setLoading(false);
        };
        document.head.appendChild(script);
      } catch (err) {
        console.error('토스페이먼츠 로드 오류:', err);
        setError('결제 모듈을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    loadTossPayments();
  }, [user]);

  if (!user) {
    return null;
  }

  const paymentMethods = [
    { id: '카드', name: '신용/체크카드', icon: <CreditCard size={24} />, color: '#E50914' },
    { id: '간편결제', name: '간편결제', icon: <Smartphone size={24} />, color: '#FEE500' },
    { id: '가상계좌', name: '가상계좌', icon: <Wallet size={24} />, color: '#0064FF' },
    { id: '계좌이체', name: '계좌이체', icon: <Smartphone size={24} />, color: '#03C75A' },
  ];

  const handlePayment = async () => {
    if (!tossPaymentsRef.current) {
      setError('결제 모듈이 준비되지 않았습니다.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const orderId = `order_${Date.now()}_${user.id}`;
      
      await tossPaymentsRef.current.requestPayment(selectedMethod, {
        amount: planInfo.price,
        orderId: orderId,
        orderName: `${planInfo.name} 플랜 구독`,
        customerName: user.name || '고객',
        customerEmail: user.email,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      console.error('결제 요청 오류:', err);
      if (err.code === 'USER_CANCEL') {
        setError('결제가 취소되었습니다.');
      } else {
        setError(err.message || '결제 요청 중 오류가 발생했습니다.');
      }
      setProcessing(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="container">
        {/* Header */}
        <motion.div
          className="payment-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            돌아가기
          </button>
          <h1>결제하기</h1>
          <p>안전하고 빠른 결제를 진행해주세요</p>
        </motion.div>

        <div className="payment-content">
          {/* Order Summary */}
          <motion.div
            className="order-summary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3>주문 내역</h3>
            <div className="summary-card">
              <div className="summary-item">
                <span>플랜</span>
                <span className="value">{planInfo.name} 플랜</span>
              </div>
              <div className="summary-item">
                <span>결제 주기</span>
                <span className="value">{planInfo.period === 'monthly' ? '월간' : '연간'}</span>
              </div>
              <div className="summary-item total">
                <span>총 결제 금액</span>
                <span className="value">₩{planInfo.price?.toLocaleString() || '0'}</span>
              </div>
            </div>

            <div className="security-badge">
              <Shield size={18} />
              <span>SSL 암호화로 안전하게 결제됩니다</span>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            className="payment-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3>결제 수단 선택</h3>

            {/* 에러 메시지 */}
            {error && (
              <div className="error-message">
                <Info size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* 로딩 상태 */}
            {loading ? (
              <div className="loading-state">
                <Loader size={32} className="spinning" />
                <p>결제 모듈을 불러오는 중...</p>
              </div>
            ) : (
              <>
                {/* Payment Methods */}
                <div className="payment-methods">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      className={`method-btn ${selectedMethod === method.id ? 'active' : ''}`}
                      onClick={() => setSelectedMethod(method.id)}
                      style={{ '--method-color': method.color }}
                    >
                      {method.icon}
                      <span>{method.name}</span>
                      {selectedMethod === method.id && <Check size={18} className="check-icon" />}
                    </button>
                  ))}
                </div>

                {/* 선택된 결제 수단 안내 */}
                <div className="method-info">
                  <Info size={18} />
                  <p>
                    {selectedMethod === '카드' && '신용카드 또는 체크카드로 결제합니다.'}
                    {selectedMethod === '간편결제' && '카카오페이, 네이버페이, 토스페이 등으로 결제합니다.'}
                    {selectedMethod === '가상계좌' && '가상계좌로 입금하여 결제합니다.'}
                    {selectedMethod === '계좌이체' && '계좌에서 직접 이체하여 결제합니다.'}
                  </p>
                </div>

                {/* Submit Button */}
                <button 
                  type="button"
                  className="btn btn-primary btn-lg payment-submit"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader size={20} className="spinning" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      ₩{planInfo.price?.toLocaleString() || '0'} 결제하기
                    </>
                  )}
                </button>
              </>
            )}

            <div className="payment-info">
              <Info size={16} />
              <p>결제 정보는 토스페이먼츠에서 안전하게 처리됩니다.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
